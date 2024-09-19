import db from '../models/index';

const createNewEvaluationService = async (data) => {
    try {
        if (!data.reviewText) {
            return {
                status: 1,
                message: 'Thiếu thông số bắt buộc!'
            };
        }

        await db.Evaluation.create({
            userId: data.userId,
            productId: data.productId,
            rating: data.rating,
            text: data.reviewText,
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


const getEvaluationService = async (evaluationId, productId) => {
    try {

        let allEvaluations = [];

        if (productId) {
            const allEvaluations = await db.Evaluation.findAll({
                where: { productId: productId },
                include: [
                    {
                        model: db.User,
                        as: 'userEvaluationData',
                        attributes: ['name', 'avatar', 'address'],
                    }
                ],
                raw: false,
                nest: true
            });

            return {
                status: 0,
                data: allEvaluations
            };
        }

        if (evaluationId) {
            const allEvaluations = await db.Evaluation.findOne({
                where: { id: evaluationId },
            });

            return {
                status: 0,
                data: allEvaluations
            };
        }

        return {
            status: 0,
            data: allEvaluations
        };

    } catch (error) {
        throw new Error('Error fetching getEvaluationService');
    }
};

const updateEvaluationService = async (data) => {

    try {
        const evaluation = await db.Evaluation.findOne({
            where: { id: data.id },
            raw: false
        });

        if (!evaluation) {
            return {
                status: 1,
                message: 'Danh mục không tồn tại!'
            };
        }

        evaluation.rating = data.rating;
        evaluation.text = data.reviewText;

        await evaluation.save();

        return {
            status: 0,
            message: 'Cập nhật thành công!'
        };

    } catch (error) {
        console.error('Cập nhật thất bại:', error);
        throw new Error('Cập nhật thất bại!');
    }
};

module.exports = {
    createNewEvaluationService,
    getEvaluationService,
    updateEvaluationService
}