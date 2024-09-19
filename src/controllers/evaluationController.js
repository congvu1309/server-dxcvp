import evaluationService from '../services/evaluationService';

const handleCreateNewEvaluation = async (req, res) => {
    try {
        let response = await evaluationService.createNewEvaluationService(req.body);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: 500,
            message: 'Error from server'
        })
    }
}

const handleGetEvaluation = async (req, res) => {
    try {
        let response = await evaluationService.getEvaluationService(req.query.id, req.query.productId);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: 500,
            message: 'Error from server'
        })
    }
}

const handleUpdateEvaluation = async (req, res) => {
    try {
        let response = await evaluationService.updateEvaluationService(req.body);
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
    handleCreateNewEvaluation,
    handleGetEvaluation,
    handleUpdateEvaluation
}
