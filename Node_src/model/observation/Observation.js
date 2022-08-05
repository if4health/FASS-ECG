const {Schema, model} = require('mongoose');
const Identifier = require('./Identifier');
const Reference = require('./Reference');
const CodeableConcept = require('./CodeableConcept');
const Period = require('./Period');
const Quantity = require('./Quantity');
const Range = require('./Range');
const Ratio = require('./Ratio');
const SampledData = require('./SampledData');
const Annotation = require('./Annotation');
const Observation_ReferenceRange = require('./Observation_ReferenceRange');
const Observation_Component = require('./Observation_Component');
const {schema} = require('../patient/Patient');

const ObservationSchema = new Schema({
        id: {
            type: String
        },
        resourceType: {
            type: String,
            required: true
        },
        identifier: {
            type: [Identifier],
            default: void 0
        },
        basedOn: {
            type: [Reference],
            default: void 0
        },
        partOf: {
            type: [Reference],
            default: void 0
        },
        status: {
            type: String,
            default: void 0
        },
        category: {
            type: [CodeableConcept],
            default: void 0
        },
        code: {
            type: CodeableConcept,
            default: void 0
        },
        subject: {
            type: Reference,
            default: void 0
        },
        focus: {
            type: [Reference],
            default: void 0
        },
        encounter: {
            type: Reference,
            default: void 0
        },
        effectiveDateTime: {
            type: String,
            default: void 0
        },
        effectivePeriod: {
            type: Period,
            default: void 0
        },
        effectiveInstant: {
            type: String,
            default: void 0
        },
        issued: {
            type: Date,
            default: void 0
        },
        performer: {
            type: [Reference],
            default: void 0
        },
        valueQuantity: {
            type: Quantity,
            default: void 0
        },
        valueCodeableConcept: {
            type: CodeableConcept,
            default: void 0
        },
        valueString: {
            type: String,
            default: void 0
        },
        valueBoolean: {
            type: Boolean,
            default: void 0
        },
        valueInteger: {
            type: Number,
            default: void 0
        },
        valueRange: {
            type: Range,
            default: void 0
        },
        valueRatio: {
            type: Ratio,
            default: void 0
        },
        valueSampledData: {
            type: SampledData,
            default: void 0
        },
        valueTime: {
            type: String,
            default: void 0
        },
        valueDateTime: {
            type: String,
            default: void 0
        },
        valuePeriod: {
            type: Period,
            default: void 0
        },
        dataAbsentReason: {
            type: CodeableConcept,
            default: void 0
        },
        interpretation: {
            type: [CodeableConcept],
            default: void 0
        },
        note: {
            type: [Annotation],
            default: void 0
        },
        bodySite: {
            type: CodeableConcept,
            default: void 0
        },
        method: {
            type: CodeableConcept,
            default: void 0
        },
        specimen: {
            type: Reference,
            default: void 0
        },
        device: {
            type: Reference,
            default: void 0
        },
        referenceRange: {
            type: [Observation_ReferenceRange],
            default: void 0
        },
        hasMember: {
            type: [Reference],
            default: void 0
        },
        derivedFrom: {
            type: [Reference],
            default: void 0
        },
        component: {
            type: [Observation_Component],
            default: void 0
        }
    },
    {
        versionKey: false
    });

module.exports = model('observation', ObservationSchema);

