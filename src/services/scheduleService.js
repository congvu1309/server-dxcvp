import db from '../models/index';

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
                        attributes: ['title', 'provinces', 'districts'],
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
                where: { productId: productId, status: 'accept' },
                attributes: ['productId', 'status', 'startDate', 'endDate'],
                raw: false,
                nest: true
            });

            return {
                status: 0,
                data: allSchedule
            };
        }

        if (pageNumber || search || selected) {
            allSchedule = await db.Schedule.findAll({
                include: [
                    {
                        model: db.Product,
                        as: 'productScheduleData',
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
                    if (selected === 'pending' || selected === 'accept' || selected === 'refuse' || selected === 'completed' || selected === 'canceled') {
                        return schedule.status === selected;
                    }
                    return true;
                });
            }

            const sortedSchedules = filteredSchedule.sort((a, b) => {
                if (a.status === 'pending' && b.status !== 'pending') {
                    return -1;
                }
                if (a.status !== 'pending' && b.status === 'pending') {
                    return 1;
                }
                if (a.status === 'accept' && b.status !== 'accept') {
                    return -1;
                }
                if (a.status !== 'accept' && b.status === 'accept') {
                    return 1;
                }
                return 0;
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
                        attributes: ['title'],
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
            if (a.status === 'pending' && b.status !== 'pending') {
                return -1;
            }
            if (a.status !== 'pending' && b.status === 'pending') {
                return 1;
            }
            if (a.status === 'accept' && b.status !== 'accept') {
                return -1;
            }
            if (a.status !== 'accept' && b.status === 'accept') {
                return 1;
            }
            return 0;
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
                    attributes: ['title'],

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

        schedule.status = data.status;

        await schedule.save();

        return {
            status: 0,
            message: 'Cập nhật thành công!'
        };

    } catch (error) {
        console.error('Error updating user:', error);
        throw new Error('Cập nhật thất bại!');
    }
};


module.exports = {
    createNewScheduleService,
    getAllScheduleByUserIdService,
    updateScheduleService
}
