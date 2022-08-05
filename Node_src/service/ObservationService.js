const PatientSchema = require("../model/patient/Patient");
const ObservationSchema = require("../model/observation/Observation");
const PatientService = require("../service/PatientService");
const uuid = require('uuid');
var mongoose = require('mongoose');

class ObservationService {

    async createObeservation(observation) {
        let patientReference = this.getReference(observation);
        if (patientReference) {
            const isValidPatient = await this.isValidPatient(patientReference);
            if (!isValidPatient) {
                throw new Error("Patient not found");
            }
        }

        let id = mongoose.Types.ObjectId();
        observation.id = id;
        observation._id = id;

        const result = await ObservationSchema.create(observation);

        return result;
    }

    getReference(observation) {
        let subject = observation.subject;
        if (subject) {
            let reference = subject.reference;
            if (reference)
                return reference;
        }
        return undefined;
    }

    async isValidPatient(patientReference) {
        let patientId = patientReference.split("/")[1];
        if (patientId.match(/^[0-9a-fA-F]{24}$/)) {
            const patient = await PatientService.getPatientById(patientId);
            return patient != null;
        } else {
            return false;
        }
    }

    async patchComponent(array, id) {
        const observation = await ObservationSchema.findById(id).exec();

        let sorted = this.sortPatchJson(array);

        let values = sorted.map((a, index) => {
            let oldValue = observation.component[index].valueSampledData.data;
            let patchValue = a.value;
            if (oldValue === null || oldValue === undefined) {
                return patchValue;
            } else {
                return oldValue.concat(" " + patchValue);
            }
        });

        let newComponent = observation.component.map((c, index) => {
            if (values[index] != undefined) {
                c.valueSampledData.data = values[index];
                return c;
            } else {
                return c.valueSampledData.data;
            }
        });

        observation.component = newComponent;
        return this.update(id, observation);
    }

    sortPatchJson(array) {
        return array.sort((a, b) => {
            let posA = a.path.split("/")[2];
            let posB = b.path.split("/")[2];
            if (posA > posB) {
                return 1;
            }
            if (posA < posB) {
                return -1;
            }
            return 0;
        });
    }

    async getObservationByIdData(id) {
        const result = await ObservationSchema.findById(id).exec();
        //component/0/valueSampledData/data
        //return result.component[2].valueSampledData.data.length;
        return result;
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
        return await this.update(id, observation);
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
