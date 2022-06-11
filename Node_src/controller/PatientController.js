const PatientService = require('../service/PatientService');

class PatientController {

    async createPatient(req, res) {
        const result = await PatientService.createPatient(req.body);
        res.json(result);
    }

    async getPatientById(req, res) {
        const result = await PatientService.getPatientById(req.params.id);
        if (result == null)
            res.status(404).send('Patient not found');
        else
            res.json(result);
    }

    async deletePatient(req, res) {
        const id = req.params.id;
        const result = await PatientService.delete(id);
        if (result == null)
            res.status(404).send('Patient not found');
        else
            res.json("Patient deleted");
    }

    async updateObservation(req, res) {
       const id = req.params.id;
       const patient = req.body;
       const result = await PatientService.update(id, patient);
       res.json(result);
    }

}

module.exports = new PatientController();