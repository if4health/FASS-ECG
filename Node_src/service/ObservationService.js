const PatientSchema = require("../model/patient/Patient");
const ObservationSchema = require("../model/observation/Observation");
const PatientService = require("../service/PatientService");

class ObservationService {

    async createObeservation(observation) {
        let patientReference = observation.subject?.reference;
        if (patientReference) {
            const isValidPatient = await this.isValidPatient(patientReference);
            if (!isValidPatient) {
                return "Patient not found";
            }
        }
        try {
            const result = await ObservationSchema.create(observation);
            return result;
        } catch (error) {
            return error;
        }
    }

    async isValidPatient(patientReference) {
        let patientId = patientReference.split("/")[1];
        if (patientId.match(/^[0-9a-fA-F]{24}$/)) {
            const patient = await PatientService.getPatientById(patientId);
            return !(patient == null);
        } else {
            return false;
        }
    }

    async getObservationById(id) {
        try {
            const result = await ObservationSchema.findById(id).exec();
            if (result == null) {
                return "Observation not found";
            }
            return result;
        } catch (error) {
            console.log(error);
            return error;
        }
    }
}

module.exports = new ObservationService();