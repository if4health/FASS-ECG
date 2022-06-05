const PatientSchema = require('../model/patient/Patient.js');
const PatientService = require('../service/PatientService');

class PatientController {

    async createPatient(req, res) {
        const result = await PatientService.createPatient(req.body);
        res.json(result);
    }

    async getPatientById(req, res) {
        const result = await PatientService.getPatientById(req.params.id);
        if (result == null)
            res.status(404).send({message: `Patient not found`})
        else
            res.json(result);
    }

}

module.exports = new PatientController();