import userService from '../services/userService';

const handleCreateNewUser = async (req, res) => {
    try {
        let response = await userService.createNewUserService(req.body);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: 500,
            message: 'Error from server'
        })
    }
}

const handleLoginUser = async (req, res) => {
    try {
        let response = await userService.loginUserService(req.body, res);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: 500,
            message: 'Error from server'
        })
    }
}

const handleGetMe = async (req, res) => {
    try {
        let response = await userService.getMeService(req.cookies['jwt']);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            status: 200,
            message: 'Not Found'
        })
    }
}

const handleLogout = async (req, res) => {
    try {
        let response = await userService.logoutService(res);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: 500,
            message: 'Error from server'
        });
    }
};


const handleGetAllUser = async (req, res) => {
    try {
        const response = await userService.getAllUserService(req.query.page, req.query.search, req.query.selected);
        return res.status(200).json(response);
    } catch (error) {
        console.log(e);
        return res.status(500).json({
            status: 500,
            message: 'Error from server'
        });
    }
};

const handleGetUserById = async (req, res) => {
    try {
        const response = await userService.getUserByIdService(req.query.id);
        return res.status(200).json(response);
    } catch (error) {
        console.log(e);
        return res.status(500).json({
            status: 500,
            message: 'Error from server'
        });
    }
};


const handleUpdateUser = async (req, res) => {
    try {
        let response = await userService.updateUserService(req.body);
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
    handleCreateNewUser,
    handleLoginUser,
    handleGetMe,
    handleLogout,
    handleGetAllUser,
    handleGetUserById,
    handleUpdateUser,
}