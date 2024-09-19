import db from '../models/index';
import { format, parse } from 'date-fns';
import emailService from './emailService';

const createNewScheduleService = async (data) => {

    try {
        const requiredFields = ['image', 'phoneNumber'];
        for (const field of requiredFields) {
            if (!data[field]) {
                return {
                    status: 1,
                    message: `Thiếu thông số bắt buộc: ${field}!`
                };
            }
        }

        await db.Schedule.create({
            productId: data.productId,
            userId: data.userId,
            startDate: data.startDate,
            endDate: data.endDate,
            numberOfDays: data.numberOfDays,
            guestCount: data.guestCount,
            image: data.image,
            phoneNumber: data.phoneNumber,
            pay: data.pay,
            status: 'pending'
        });

        return {
            status: 0,
            message: 'Tạo mới thành công!'
        };

    } catch (error) {
        console.error('Tạo mới thất bại:', error);
        throw new Error('Tạo mới thất bại!');
    }
};

const getAllScheduleByUserIdService = async (userId, scheduleId, productId, pageNumber, search, selected) => {

    const pageSize = 20;

    try {
        let allSchedule = [];

        if (scheduleId) {
            allSchedule = await db.Schedule.findOne({
                where: { id: scheduleId },
                include: [
                    {
                        model: db.Product,
                        as: 'productScheduleData',
                        attributes: ['title', 'price', 'provinces', 'districts'],
                    }
                ],
                raw: false,
                nest: true
            });

            return {
                status: 0,
                data: allSchedule
            };
        }

        if (productId) {
            allSchedule = await db.Schedule.findAll({
                where: {
                    productId: productId,
                    status: ['accept', 'in-use']
                },
                attributes: ['productId', 'status', 'startDate', 'endDate'],
                raw: false,
                nest: true
            });

            return {
                status: 0,
                data: allSchedule
            };
        }

        const STATUS_PRIORITY = {
            'canceled': 1,
            'pending': 2,
            'accept': 3,
            'in-use': 4,
            'completed': 5,
            'refunded': 6,
            'refuse': 7
        };

        if (pageNumber || search || selected) {
            allSchedule = await db.Schedule.findAll({
                include: [
                    {
                        model: db.Product,
                        as: 'productScheduleData',
                        attributes: ['title', 'price'],
                        include: [
                            {
                                model: db.User,
                                as: 'userProductData',
                                attributes: ['name'],
                            }
                        ],
                    },
                ],
                raw: false,
                nest: true
            });

            let filteredSchedule = allSchedule;

            if (search) {
                filteredSchedule = filteredSchedule.filter(schedule =>
                    schedule.productScheduleData.userProductData.name.toLowerCase().includes(search.toLowerCase()) ||
                    schedule.startDate.toLowerCase().includes(search.toLowerCase()) ||
                    schedule.endDate.toLowerCase().includes(search.toLowerCase())
                );
            }

            if (selected !== 'ALL') {
                filteredSchedule = filteredSchedule.filter(schedule => {
                    if (selected === 'pending' || selected === 'accept' || selected === 'refuse' || selected === 'completed' || selected === 'canceled' || selected === 'arrange') {
                        return schedule.status === selected;
                    }
                    return true;
                });
            }

            const sortedSchedules = filteredSchedule.sort((a, b) => {
                const priorityA = STATUS_PRIORITY[a.status] || Number.MAX_SAFE_INTEGER;
                const priorityB = STATUS_PRIORITY[b.status] || Number.MAX_SAFE_INTEGER;
                return priorityA - priorityB;
            });

            const offset = (pageNumber - 1) * pageSize;
            const paginatedSchedule = sortedSchedules.slice(offset, offset + pageSize);

            const totalCount = sortedSchedules.length;

            const data = {
                schedule: paginatedSchedule,
                totalCount: totalCount
            };

            return {
                status: 0,
                data: data
            };
        }

        if (userId) {
            allSchedule = await db.Schedule.findAll({
                where: { userId: userId },
                include: [
                    {
                        model: db.Product,
                        as: 'productScheduleData',
                        attributes: ['title'],
                    }
                ],
                raw: false,
                nest: true
            });
        } else {
            allSchedule = await db.Schedule.findAll({
                include: [
                    {
                        model: db.Product,
                        as: 'productScheduleData',
                        attributes: ['title', 'price'],
                        include: [
                            {
                                model: db.User,
                                as: 'userProductData',
                                attributes: ['name'],
                            }
                        ],
                    },
                ],
                raw: false,
                nest: true
            });
        }

        const sortedSchedules = allSchedule.sort((a, b) => {
            const priorityA = STATUS_PRIORITY[a.status] || Number.MAX_SAFE_INTEGER;
            const priorityB = STATUS_PRIORITY[b.status] || Number.MAX_SAFE_INTEGER;
            return priorityA - priorityB;
        });

        return {
            status: 0,
            data: sortedSchedules
        };

    } catch (error) {
        console.error('Error fetching allSchedule:', error);
        throw new Error('Error fetching allSchedule');
    }
};

const updateScheduleService = async (data) => {
    try {
        const schedule = await db.Schedule.findOne({
            where: { id: data.id },
            include: [
                {
                    model: db.User,
                    as: 'userScheduleData',
                    attributes: ['email', 'name'],
                },
                {
                    model: db.Product,
                    as: 'productScheduleData',
                    attributes: ['title', 'price', 'checkIn', 'checkOut', 'provinces', 'districts'],
                    include: [
                        {
                            model: db.User,
                            as: 'userProductData',
                            attributes: ['name'],
                        }
                    ],
                },
            ],
            raw: false,
            nest: true
        });

        if (!schedule) {
            return {
                status: 1,
                message: 'Không tồn tại!'
            };
        }

        const currentDate = format(new Date(), 'dd/MM/yyyy');
        const startDate = format(parse(schedule.startDate, 'dd/MM/yyyy', new Date()), 'dd/MM/yyyy');
        const endDate = format(parse(schedule.endDate, 'dd/MM/yyyy', new Date()), 'dd/MM/yyyy');

        const today = new Date();
        const start = parse(startDate, 'dd/MM/yyyy', new Date());

        // Check if status changes to 'accept' and send email
        if (data.status === 'accept' && schedule.status !== 'accept') {
            await emailService.sendSimpleEmail({
                reciverEmail: schedule.userScheduleData.email,
                name: schedule.userScheduleData.name,
                hoast: schedule.productScheduleData.userProductData.name,
                startDate: schedule.startDate,
                endDate: schedule.endDate,
                title: schedule.productScheduleData.title,
                checkIn: schedule.productScheduleData.checkIn,
                checkOut: schedule.productScheduleData.checkOut,
                provinces: schedule.productScheduleData.provinces,
                districts: schedule.productScheduleData.districts,
                content: `Chúc mừng! Lịch trình của bạn đã được chấp nhận. Vui lòng xem thông tin chi tiết bên dưới`,
                redirectLink: 'https://www.youtube.com/watch?v=UTv7l6czu5s'
            });
        }

        // Check if status changes to 'refuse' and send email with different content
        if (data.status === 'refuse' && schedule.status !== 'refuse') {
            await emailService.sendSimpleEmail({
                reciverEmail: schedule.userScheduleData.email,
                name: schedule.userScheduleData.name,
                hoast: schedule.productScheduleData.userProductData.name,
                startDate: schedule.startDate,
                endDate: schedule.endDate,
                title: schedule.productScheduleData.title,
                checkIn: schedule.productScheduleData.checkIn,
                checkOut: schedule.productScheduleData.checkOut,
                provinces: schedule.productScheduleData.provinces,
                districts: schedule.productScheduleData.districts,
                content: `Xin lỗi! Lịch trình của bạn đã bị từ chối. Vui lòng liên hệ chúng tôi để biết thêm chi tiết`,
                redirectLink: 'https://www.youtube.com/watch?v=UTv7l6czu5s'
            });
        }

        if (start < today) {
            schedule.status = 'refuse';
        } else if (endDate === currentDate || schedule.status === 'in-use') {
            schedule.status = 'completed';
        } else {
            schedule.status = data.status;
        }

        await schedule.save();

        return {
            status: 0,
            message: 'Cập nhật thành công!'
        };

    } catch (error) {
        console.error('Error updating schedule:', error);
        throw new Error('Cập nhật thất bại!');
    }
};

module.exports = {
    createNewScheduleService,
    getAllScheduleByUserIdService,
    updateScheduleService
}
