const ObservationSchema = require("../model/observation/Observation");
const PatientService = require("../service/PatientService");
const S3Service = require('../service/S3Service');
const uuid = require('uuid');
const mongoose = require('mongoose');

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

        observation.component.map((comp, index) => {
            const fileName = `data_${id}_${index}.txt`;
            const data = comp.valueSampledData.data || "";
            S3Service.upload(fileName, data);
            comp.valueSampledData.data = fileName;
        });

        const result = await ObservationSchema.create(observation);

        return observation;
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
        const observation = await this.findById(id);
        const samplesValues = await this.convertUploadsToData(observation);
        let sorted = this.sortPatchJson(array);

        let values = sorted.map((patchValue, index) => {
            let oldValue = samplesValues[index];
            let newValue = patchValue.value;
            if (oldValue === null || oldValue === undefined) {
                return patchValue;
            } else {
                return oldValue.concat(" " + newValue);
            }
        });

        let promisses = observation.component.map((comp, index) => {
            const fileName = `data_${id}_${index}.txt`;
            const data = values[index];
            comp.valueSampledData.data = fileName;
            return S3Service.upload(fileName, data);
        });

        await Promise.all(promisses).then((values) => {
            values.map((value, index) => {
                console.log("depois da promisse");
                console.log(value);
            })
        })

        return this.update(id, observation);
    }

    async findById(id) {
        if (mongoose.Types.ObjectId.isValid(id)) {
            const observation = await ObservationSchema.findById(id).exec();
            if (!observation) {
                throw new HttpError('Observation not found!', 404);
            }
            return observation;
        } else {
            throw new HttpError('Observation not found!', 404);
        }
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

    async getObservationByIdData(id, range) {
        const observation = await this.findById(id);
        let results = [];
        let codes = [];
        let promisses = observation.component.map(comp => {
            const data = comp.valueSampledData.data;
            codes.push({
                'code': comp.code.coding[0].display,
                'period': comp.valueSampledData.period
            });
            return S3Service.downloadWithRange(data, range);
        });

        await Promise.all(promisses).then((values) => {
            values.map((value, index) => {
                value = value.trim();
                const valuesSplited = value.split(' ');
                valuesSplited.pop();
                let finalValue = ""
                valuesSplited.forEach(v => {
                    finalValue = finalValue + v + " ";
                });

                let json = {
                    ...codes[index],
                    'data': finalValue.trim()
                }
                results.push(json);
            })
        })

        return results;
    }

    async getObservationById(id) {
        const result = await this.findById(id);
        console.log(result);
        // const result = await ObservationSchema.findById(id).exec();
        // if (!result) throw new Error("Observation not foud!");
        const sampleValues = await this.convertUploadsToData(result);
        result.component.forEach((comp, index) => {
            comp.valueSampledData.data = sampleValues[index];
        });
        return result;
    }

    async convertUploadsToData(observation) {
        let dataValues = [];
        if (observation) {
            const promisses = observation.component.map((comp) => {
                const data = comp.valueSampledData.data;
                return S3Service.downloadFromS3(data)
            });

            await Promise.all(promisses).then((values) => {
                values.map(value => {
                    dataValues.push(value);
                })
            })
        }

        return dataValues;
    }

    async updateObservation(observation, id) {
        const toVerify = await ObservationSchema.findById(id).exec();
        if (toVerify == null) {
            throw new Error("Observation not found");
        }
        if (observation.component) {
            observation.component.map((comp, index) => {
                const fileName = `data_${id}_${index}.txt`;
                const data = comp.valueSampledData.data || "";
                S3Service.upload(fileName, data);
                comp.valueSampledData.data = fileName;
            });
        }
        return await this.update(id, observation);
    }

    async update(id, observation) {
        const updated = await ObservationSchema.findByIdAndUpdate({ _id: id }, observation).exec();
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

class HttpError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

module.exports = new ObservationService();
