const PatientSchema = require("../model/patient/Patient");
const ObservationSchema = require("../model/observation/Observation");

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

    async update(id, patient) {
        try {
            const updated = await PatientSchema.findByIdAndUpdate({_id: id}, patient).exec();
            console.log(updated);
            if (updated) {
                return "Patient Atualizado";
            } else {
                return "Não atualizado";
            }
        } catch (error) {
            console.log(error);
            return error;
        }

    }

    async delete(id) {
        try {
            const deleted = await PatientSchema.findByIdAndDelete(id).exec();
            return deleted;
        } catch (error) {
            console.log(error);
            return error;
        }

    }
}

module.exports = new PatientService();