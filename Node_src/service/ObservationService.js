const PatientSchema = require("../model/patient/Patient");
const ObservationSchema = require("../model/observation/Observation");

class ObservationService {

    async createObeservation(req, res) {
        let observation = req.body;
        let patientReference = observation.subject.reference;
        let patientId = patientReference.split("/")[1];

        try {
            if (patientId.match(/^[0-9a-fA-F]{24}$/)) {
                const patient = await PatientSchema.findById(patientId).exec();
                if (patient == null) {
                    return res.status(404).json("Patient not found");
                }
            } else {
                return res.status(404).json("Patient not found");
            }

        } catch (error) {
            return res.status(500).json(error);
        }


        observation.subject.reference = `Patient/${patientId}`;

        try {
            const result = await ObservationSchema.create(observation);
            return res.status(201).json(result);
        } catch (error) {
            return res.status(500).json(error);
        }
    }
}

module.exports = new ObservationService();