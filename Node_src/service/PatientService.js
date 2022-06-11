const PatientSchema = require("../model/patient/Patient");
const ObservationSchema = require("../model/observation/Observation");

class PatientService {

    async createPatient(patient) {
        const result = await PatientSchema.create(patient);
        return result;
    }

    async getPatientById(id) {
        const result = await PatientSchema.findById(id).exec();
        return result;
    }

    async update(id, patient) {
        const updated = await PatientSchema.findByIdAndUpdate({_id: id}, patient).exec();
        return updated;
    }

    async delete(id) {
        const deleted = await PatientSchema.findByIdAndDelete(id).exec();
        return deleted;
    }
}

module.exports = new PatientService();