import productService from '../services/productService';

const handleCreateNewProduct = async (req, res) => {
    try {
        let response = await productService.createNewProductService(req.body);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: 500,
            message: 'Error from server'
        })
    }
}

const handleGetAllProduct = async (req, res) => {

    try {
        let response = await productService.getAllProductService(req.query.userId, req.query.categoryId, req.query.address,req.query.page);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: 500,
            message: 'Error from server'
        })
    }
}

const handleGetProductById = async (req, res) => {
    try {
        let response = await productService.getProductByIdService(req.query.id);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: 500,
            message: 'Error from server'
        })
    }
}

const handleUpdateProduct = async (req, res) => {
    try {
        let response = await productService.updateProductService(req.body);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: 500,
            message: 'Error from server'
        })
    }
}

const handleDeleteProduct = async (req, res) => {
    try {
        let response = await productService.deleteProductService(req.query.id);
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
    handleCreateNewProduct,
    handleGetAllProduct,
    handleGetProductById,
    handleUpdateProduct,
    handleDeleteProduct
}