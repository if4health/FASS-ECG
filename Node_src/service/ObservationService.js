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

    async patchComponent(component, id) {
        try {
            const observation = await ObservationSchema.findById(id).exec();
            if (observation == null) {
                return "Observation not found";
            }

            if (observation.component === undefined) {
                observation.component = [...component];
            } else {
                observation.component = [...observation.component, ...component];
            }

            const updated = await ObservationSchema.updateOne({_id: id}, observation)
            if (updated.nModified == 1) {
                return observation;
            } else
                return "Não atualizado";
        } catch (error) {
            console.log(error)
            return error;
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

    async updateObservation(observation, id) {
        try {

            const toVerify = await ObservationSchema.findById(id).exec();

            if (toVerify == null) {
                return "Observation not found";
            }

            if (observation.component === undefined) {
                return await this.update(id, observation);

            } else {

                if (toVerify.component === undefined) {
                    return await this.update(id, observation);
                } else {
                    const component = [...toVerify.component];
                    observation.component = [...observation.component, ...component];
                    return await this.update(id, observation);
                }
            }

        } catch (error) {
            console.log(error)
            return error;
        }

    }

    async update(id, observation) {
        const updated = await ObservationSchema.findByIdAndUpdate({_id: id}, observation).exec();
        if (updated) {
            return "Observation Atualizado";
        } else {
            return "Não atualizado";
        }
    }

    async delete(id) {
        const deleted = await ObservationSchema.findByIdAndDelete(id).exec();
        if(deleted) {
            return "Deletado com sucesso";
        }else{
            return `Observation not found`;
        }
    }
}

module.exports = new ObservationService();