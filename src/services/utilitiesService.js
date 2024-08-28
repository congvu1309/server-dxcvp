import db from '../models/index';

const createNewUtilitiesService = async (data) => {
    try {
        if (!data.title) {
            return {
                status: 1,
                message: 'Thiếu thông số bắt buộc!'
            };
        }

        await db.Utility.create({
            title: data.title,
            image: data.image,
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

const getAllUtilitiesService = async () => {
    try {
        const allUtilities = await db.Utility.findAll({});

        return {
            status: 0,
            data: allUtilities
        };
    } catch (error) {
        throw new Error('Error fetching allUtilities');
    }
};
    
const getUtilitiesByIdService = async (utilityId) => {
    try {
        const utility = await db.Utility.findOne({
            where: { id: utilityId }
        });

        if (!utility) {
            return {
                status: 1,
                message: 'Không tìm thấy danh mục!'
            };
        }

        return {
            status: 0,
            data: utility
        };
    } catch (error) {
        throw new Error('Error fetching utility by ID');
    }
};

const updateUtilitiesService = async (data) => {
    try {
        const utility = await db.Utility.findOne({
            where: { id: data.id },
            raw: false
        });

        if (!utility) {
            return {
                status: 1,
                message: 'Danh mục không tồn tại!'
            };
        }

        utility.title = data.title;

        if (data.image) {
            utility.image = data.image;
        }

        await utility.save();

        return {
            status: 0,
            message: 'Cập nhật thành công!'
        };

    } catch (error) {
        console.error('Cập nhật thất bại:', error);
        throw new Error('Cập nhật thất bại!');
    }
};

const deleteUtilitiesService = async (utilityId) => {
    try {
        const Utility = await db.Utility.findOne({
            where: { id: utilityId }
        })

        if (!Utility) {
            return {
                status: 1,
                message: 'Không tìm thấy danh mục!'
            };
        }

        await db.Utility.destroy({
            where: { id: utilityId }
        });

        return {
            status: 0,
            message: 'Xóa thành công!'
        };

    } catch (error) {
        throw new Error('Error fetching utilityId by ID');
    }
};

module.exports = {
    createNewUtilitiesService,
    getAllUtilitiesService,
    getUtilitiesByIdService,
    updateUtilitiesService,
    deleteUtilitiesService
}