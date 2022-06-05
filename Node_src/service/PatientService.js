const PatientSchema = require("../model/patient/Patient");

class PatientService {

    async createPatient(patient) {
        try {
            const result = await PatientSchema.create(patient);
            return result;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async getPatientById(id) {
        try {
            const result = await PatientSchema.findById(id).exec();
            return result;
        } catch (error) {
            console.log(error);
            return error;
        }
    }
}

module.exports = new PatientService();