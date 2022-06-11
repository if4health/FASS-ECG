const ObservationSchema = require('../model/observation/Observation.js');
const PatientSchema = require('../model/patient/Patient');
const ObservationService = require('../service/ObservationService');

class ObservationController {

    async createObeservation(req, res) {
        const result = await ObservationService.createObeservation(req.body);
        return res.status(201).json(result);
    }

    async patchComponent(req, res) {
        const component = req.body.component;
        const id = req.params.id;
        const result = await ObservationService.patchComponent(component, id);
        res.json(result);
    }

    async getObservationById(req, res) {
        const result = await ObservationService.getObservationById(req.params.id);
        return res.json(result);
    }

    async updateObservation(req, res) {
        const observation = req.body;
        const id = req.params.id;
        const result = await ObservationService.updateObservation(observation, id);
        res.json(result);
    }

    async deleteObservation(req, res) {
        const id = req.params.id;
        const result = await  ObservationService.delete(id);
        console.log(result);
        res.json(result);
    }
}

module.exports = new ObservationController();