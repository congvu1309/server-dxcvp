import scheduleService from '../services/scheduleService';

const handleCreateNewSchedule = async (req, res) => {
    try {
        let response = await scheduleService.createNewScheduleService(req.body);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: 500,
            message: 'Error from server'
        })
    }
}

const handleGetAllScheduleByUserId = async (req, res) => {
    try {
        let response = await scheduleService.getAllScheduleByUserIdService(req.query.userId, req.query.scheduleId, req.query.productId, req.query.page, req.query.search, req.query.selected);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: 500,
            message: 'Error from server'
        })
    }
}

const handleUpdateSchedule = async (req, res) => {
    try {
        let response = await scheduleService.updateScheduleService(req.body);
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
    handleCreateNewSchedule,
    handleGetAllScheduleByUserId,
    handleUpdateSchedule
}