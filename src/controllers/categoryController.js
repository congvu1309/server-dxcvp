import categoryService from '../services/categoryService';

const handleCreateNewCategory = async (req, res) => {
    try {
        let response = await categoryService.createNewCategoryService(req.body);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: 500,
            message: 'Error from server'
        })
    }
}

const handleGetAllCategory = async (req, res) => {
    try {
        let response = await categoryService.getAllCategoryService();
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: 500,
            message: 'Error from server'
        })
    }
}

const handleGetCategoryById = async (req, res) => {
    try {
        let response = await categoryService.getCategoryByIdService(req.query.id);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: 500,
            message: 'Error from server'
        })
    }
}

const handleUpdateCategory = async (req, res) => {
    try {
        let response = await categoryService.updateCategoryService(req.body);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: 500,
            message: 'Error from server'
        })
    }
}

const handleDeleteCategory = async (req, res) => {
    try {
        let response = await categoryService.deleteCategoryService(req.query.id);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: 500,
            message: 'Error from server'
        })
    }
}

module.exports = {
    handleCreateNewCategory,
    handleGetAllCategory,
    handleGetCategoryById,
    handleUpdateCategory,
    handleDeleteCategory
}