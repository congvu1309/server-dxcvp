import db from '../models/index';

const createNewCategoryService = async (data) => {
    try {
        if (!data.title) {
            return {
                status: 1,
                message: 'Thiếu thông số bắt buộc!'
            };
        }

        await db.Category.create({
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

const getAllCategoryService = async () => {
    try {
        const allCategories = await db.Category.findAll({});

        return {
            status: 0,
            data: allCategories
        };
    } catch (error) {
        throw new Error('Error fetching allCategories');
    }
};

const getCategoryByIdService = async (categoryId) => {
    try {
        const category = await db.Category.findOne({
            where: { id: categoryId }
        });

        if (!category) {
            return {
                status: 1,
                message: 'Không tìm thấy danh mục!'
            };
        }

        return {
            status: 0,
            data: category
        };
    } catch (error) {
        throw new Error('Error fetching category by ID');
    }
};

const updateCategoryService = async (data) => {
    try {
        const category = await db.Category.findOne({
            where: { id: data.id },
            raw: false
        });

        if (!category) {
            return {
                status: 1,
                message: 'Danh mục không tồn tại!'
            };
        }

        category.title = data.title;

        if (data.image) {
            category.image = data.image;
        }

        await category.save();

        return {
            status: 0,
            message: 'Cập nhật thành công!'
        };

    } catch (error) {
        console.error('Cập nhật thất bại:', error);
        throw new Error('Cập nhật thất bại!');
    }
};

const deleteCategoryService = async (categoryId) => {
    try {
        const category = await db.Category.findOne({
            where: { id: categoryId }
        })

        if (!category) {
            return {
                status: 1,
                message: 'Không tìm thấy danh mục!'
            };
        }

        await db.Category.destroy({
            where: { id: categoryId }
        });

        return {
            status: 0,
            message: 'Xóa thành công!'
        };

    } catch (error) {
        throw new Error('Error fetching category by ID');
    }
};

module.exports = {
    createNewCategoryService,
    getAllCategoryService,
    getCategoryByIdService,
    updateCategoryService,
    deleteCategoryService
}