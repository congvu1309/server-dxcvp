import utilitiesService from '../services/utilitiesService';

const handleCreateNewUtilities = async (req, res) => {
    try {
        let response = await utilitiesService.createNewUtilitiesService(req.body);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: 500,
            message: 'Error from server'
        })
    }
}

const handleGetAllUtilities = async (req, res) => {
    try {
        let response = await utilitiesService.getAllUtilitiesService();
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: 500,
            message: 'Error from server'
        })
    }
}

const handleGetUtilitiesById = async (req, res) => {
    try {
        let response = await utilitiesService.getUtilitiesByIdService(req.query.id);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: 500,
            message: 'Error from server'
        })
    }
}

const handleUpdateUtilities = async (req, res) => {
    try {
        let response = await utilitiesService.updateUtilitiesService(req.body);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: 500,
            message: 'Error from server'
        })
    }
}

const handleDeleteUtilities = async (req, res) => {
    try {
        let response = await utilitiesService.deleteUtilitiesService(req.query.id);
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
    handleCreateNewUtilities,
    handleGetAllUtilities,
    handleGetUtilitiesById,
    handleUpdateUtilities,
    handleDeleteUtilities
}