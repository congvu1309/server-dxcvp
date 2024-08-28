import express from 'express';
import userController from '../controllers/userController';
import categoryController from '../controllers/categoryController';
import utilitiesController from '../controllers/utilitiesController';
import productController from '../controllers/productController';
import scheduleController from '../controllers/scheduleController';

const router = express.Router();

const initRoutes = (app) => {
    //user 
    router.post('/api/log-in-user', userController.handleLoginUser);
    router.get('/api/get-me', userController.handleGetMe);
    router.post('/api/logout', userController.handleLogout);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.get('/api/get-all-user', userController.handleGetAllUser);
    router.get('/api/get-user-by-id', userController.handleGetUserById);
    router.post('/api/update-user', userController.handleUpdateUser);

    //category
    router.post('/api/create-new-category', categoryController.handleCreateNewCategory);
    router.get('/api/get-all-category', categoryController.handleGetAllCategory);
    router.get('/api/get-category-by-id', categoryController.handleGetCategoryById);
    router.post('/api/update-category', categoryController.handleUpdateCategory);
    router.delete('/api/delete-category-by-id', categoryController.handleDeleteCategory);

    //utilities
    router.post('/api/create-new-utilities', utilitiesController.handleCreateNewUtilities);
    router.get('/api/get-all-utilities', utilitiesController.handleGetAllUtilities);
    router.get('/api/get-utilities-by-id', utilitiesController.handleGetUtilitiesById);
    router.post('/api/update-utilities', utilitiesController.handleUpdateUtilities);
    router.delete('/api/delete-utilities-by-id', utilitiesController.handleDeleteUtilities);

    //product
    router.post('/api/create-new-product', productController.handleCreateNewProduct);
    router.get('/api/get-all-product', productController.handleGetAllProduct);
    router.get('/api/get-product-by-id', productController.handleGetProductById);
    router.post('/api/update-product', productController.handleUpdateProduct);
    router.delete('/api/delete-product-by-id', productController.handleDeleteProduct);

    //schedule
    router.post('/api/create-new-schedule', scheduleController.handleCreateNewSchedule);
    router.get('/api/get-all-schedule-by-userId', scheduleController.handleGetAllScheduleByUserId);
    router.post('/api/update-schedule', scheduleController.handleUpdateSchedule);


    return app.use('/', router);
}

module.exports = initRoutes;