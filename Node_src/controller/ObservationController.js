const ObservationSchema = require('../model/observation/Observation.js');
const PatientSchema = require('../model/patient/Patient');
const ObservationService = require('../service/ObservationService');

class ObservationController {

    async createObeservation(req, res) {
        const result = await ObservationService.createObeservation(req.body);
        return res.status(201).json(result);
    }

    async patchComponent(req, res) {
        let component = req.body;
        console.log(component);
        try {
            const observation = await ObservationSchema.findById(req.params.id).exec();
            if (observation == null) {
                return res.status(404).json("Observation not found");
            }
            console.log(observation.component);
            observation.component = [...observation.component, ...component];
            const updated = await ObservationSchema.updateOne({_id: req.params.id}, observation)
            if (updated.nModified == 1) {
                return res.status(200).json(observation)
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }

    }

    async getObservationById(req, res) {
       const result = await ObservationService.getObservationById(req.params.id);
       return res.json(result);
    }

}

module.exports = new ObservationController();