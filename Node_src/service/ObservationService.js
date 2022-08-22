const ObservationSchema = require("../model/observation/Observation");
const ChunckSchema = require('../model/chunck/Chunck');
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
        if (observation.component) {
            observation.component.map(async (comp, index) => {
                const reference = `data_${id}_${index}`;
                const data = comp.valueSampledData.data;
                comp.valueSampledData.data = reference;
                const period = comp.valueSampledData.period;
                // const maxSamples = Math.round(60 / (period / 1000));
                const maxSamples = this.getMaxSamples(period);
                await this.chuckData(maxSamples, data, reference, 0);
            });
        }
        const result = await ObservationSchema.create(observation);
        return observation;
    }

    async chuckData(maxSamples, data, reference, position) {
        const values = data.split(' ');
        let soma = 0;
        let chunckData = "";
        for (let i of values) {
            chunckData = chunckData + i + " ";
            soma++;
            if (soma == maxSamples) {
                const chunck = {
                    reference: reference,
                    position: position,
                    data: chunckData.trim()
                }
                await ChunckSchema.create(chunck);
                chunckData = "";
                soma = 0;
                position++;
            }
        }
        if (chunckData != "") {
            const chunck = {
                reference: reference,
                position: position++,
                data: chunckData.trim()
            }
            await ChunckSchema.create(chunck);
        }
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
        //busco observation
        const observation = await this.findById(id);

        //busco as ultimas posições
        const lastChunks = [];
        const references = observation.component.map(comp => comp.valueSampledData.data);

        const promisses = references.map(async (ref) =>
            await ChunckSchema.find({ 'reference': ref }).sort({ position: -1 }).limit(1).exec());

        await Promise.all(promisses)
            .then((values) => {
                values.map((value, index) => {
                    lastChunks.push(value[0]);
                })
            });
        //busco e ordeno valores do patch
        let sorted = this.sortPatchJson(array);
        let values = sorted.map((patchValue) => patchValue.value);

        observation.component.map((comp, index) => {
            const maxSamples = this.getMaxSamples(comp.valueSampledData.period);
            const lastChunck = lastChunks[index];
            const lastChunckSize = Math.round(lastChunck.data.split(' ').length);
            const reference = comp.valueSampledData.data;
            if (lastChunckSize >= maxSamples) {
                //Fazer fluxo de chunck com uma posicao acima da ultima se 30 proximo é 31
                this.chuckData(maxSamples, values[index], reference, lastChunck.position++);
            } else {

                //Juntar data ate o 1 min e fazer update na ultima posição;
                const data = lastChunck.data.concat(' ' + values[index]);
                const samples = data.split(' ');

                let chuncks = [];
                let soma = 0;
                let position = lastChunck.position;
                let chunckData = "";

                for (let i of samples) {
                    chunckData = chunckData + i + " ";
                    soma++;
                    if (soma == maxSamples) {
                        chuncks.push({
                            reference: reference,
                            position: position,
                            data: chunckData.trim()
                        });
                        position++;
                        soma = 0;
                        chunckData = "";
                    }
                }
                if (chunckData != "") {
                    chuncks.push({
                        reference: reference,
                        position: position++,
                        data: chunckData.trim()
                    });
                }
                chuncks.forEach(async (chunck, index) => {
                    if (index == 0) {
                        await ChunckSchema.findByIdAndUpdate({
                            _id: lastChunck._id,
                            reference: reference,
                            position: lastChunck.position
                        }, chunck);
                    } else {
                        await ChunckSchema.create(chunck);
                    }
                })
            }
        });
        await this.update(id, observation);
        return observation;
    }

    getMaxSamples(period) {
        const periodInSeconds = period / 1000;
        const maxSamples = Math.round(60 / periodInSeconds);
        return maxSamples;
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

    async getObservationByStartAndEnd(id, start, end) {
        const observation = await this.findById(id);
        const preResponses = [];

        const promisses = observation.component.map((comp, index) => {
            const ref = comp.valueSampledData.data;
            preResponses.push({
                'code': comp.code.coding[0].display,
                'period': comp.valueSampledData.period
            });
            console.log(start);
            console.log(end);
            return ChunckSchema.find({ reference: ref, position: { '$gte': start - 1, '$lte': end - 1 } })
        })

        let responses = [];

        await Promise.all(promisses).then((values) => {
            values.map((value, index) => {
                let data = "";
                value.forEach(v => {
                    data = data + v.data + ' ';
                })
                responses.push({
                    ...preResponses[index],
                    data: data
                });
            })
        });

        return responses;
    }

    async getObservationByIdAndMin(id, min) {
        const observation = await this.findById(id);
        const preResponses = [];
        const promisses = observation.component.map((comp, index) => {
            const ref = comp.valueSampledData.data;
            preResponses.push({
                'code': comp.code.coding[0].display,
                'period': comp.valueSampledData.period
            });
            return ChunckSchema.findOne({ reference: ref, position: min - 1 }).exec();
        })

        let responses = [];

        await Promise.all(promisses).then((values) => {
            values.map((value, index) => {
                responses.push({
                    ...preResponses[index],
                    data: value.data
                });
            })
        });

        return responses;
    }

    async getObservationById(id) {
        const result = await this.findById(id);
        console.log(result);
        const sampleValues = await this.convertChunckToData(result);
        result.component.forEach((comp, index) => {
            comp.valueSampledData.data = sampleValues[index];
        });
        return result;
    }

    async convertChunckToData(observation) {
        let samples = [];
        if (observation) {
            const promisses = observation.component.map((comp) => {
                const ref = comp.valueSampledData.data;
                return ChunckSchema.find({ reference: ref })
            });

            await Promise.all(promisses).then((values) => {
                values.map((value, index) => {
                    let data = "";
                    value.forEach(v => {
                        data = data + v.data + ' ';
                    })
                    samples.push(data);
                })
            })
        }

        return samples;
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
