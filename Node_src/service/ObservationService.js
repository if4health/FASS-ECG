const PatientSchema = require("../model/patient/Patient");
const ObservationSchema = require("../model/observation/Observation");
const PatientService = require("../service/PatientService");

class ObservationService {

    async createObeservation(observation) {
        let patientReference = this.getReference(observation);
        if (patientReference) {
            const isValidPatient = await this.isValidPatient(patientReference);
            if (!isValidPatient) {
                throw new Error("Patient not found");
            }
        }
        const result = await ObservationSchema.create(observation);
        return result;
    }

    getReference(observation) {
        let subject = observation.subject;
        if(subject) {
            let reference = subject.reference;
            if(reference)
                return reference;
        }
        return undefined;
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
        const observation = await ObservationSchema.findById(id).exec();
        if (observation == null) {
            throw new Error("Observation not found");
        }

        if (observation.component === undefined) {
            observation.component = [...component];
        } else {
            observation.component = [...observation.component, ...component];
        }

        const updated = await ObservationSchema.updateOne({_id: id}, observation).exec();

        if (updated.nModified == 1) {
            return observation;
        } else{
            throw new Error("Erro ao fazer patch de component em observation");
        }


    }

    async getObservationById(id) {
        const result = await ObservationSchema.findById(id).exec();
        return result;
    }

    async updateObservation(observation, id) {

        const toVerify = await ObservationSchema.findById(id).exec();

        if (toVerify == null) {
            throw new Error("Observation not found");
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
    }

    async update(id, observation) {
        const updated = await ObservationSchema.findByIdAndUpdate({_id: id}, observation).exec();
        if (updated) {
            return "Atualizado";
        } else {
            throw new Error("Erro ao atualizar");
        }
    }

    async delete(id) {
        const deleted = await ObservationSchema.findByIdAndDelete(id).exec();
        return deleted;
    }
}

module.exports = new ObservationService();
