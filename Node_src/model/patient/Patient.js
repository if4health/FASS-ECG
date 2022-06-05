const {Schema, model} = require('mongoose');
const Identifier = require('./Identifier');
const HumanName = require('./HumanName');
const ContactPoint = require('./ContactPoint');
const Address = require('./Address');
const CodeableConcept = require('./CodeableConcept');
const Attachment = require('./Attachment');
const Patient_Contact = require('./Patient_Contact');
const Patient_Communication = require('./Patient_Communication');
const Reference = require('./Reference');
const Patient_Link = require('./Patient_Link');

const PatientSchema = new Schema(
    {
        id: {
            type: String,
        },
        resourceType: {
            type: String,
            required: true
        },
        identifier: {
            type: [Identifier],
            default: void 0
        },
        active: {
            type: Boolean,
            default: void 0
        },
        name: {
            type: [HumanName],
            default: void 0
        },
        telecom: {
            type: [ContactPoint],
            default: void 0
        },
        gender: {
            type: String,
            default: void 0
        },
        birthDate: {
            type: Date,
            default: void 0
        },
        deceasedBoolean: {
            type: Boolean,
            default: void 0
        },
        deceasedDateTime: {
            type: String,
            default: void 0
        },
        address: {
            type: [Address],
            default: void 0
        },
        maritalStatus: {
            type: CodeableConcept,
            default: void 0
        },
        multipleBirthBoolean: {
            type: Boolean,
            default: void 0
        },
        multipleBirthInteger: {
            type: Number,
            default: void 0
        },
        photo: {
            type: [Attachment],
            default: void 0
        },
        contact: {
            type: [Patient_Contact],
            default: void 0
        },
        communication: {
            type: [Patient_Communication],
            default: void 0
        },
        generalPractitioner: {
            type: [Reference],
            default: void 0
        },
        managingOrganization: {
            type: Reference,
            default: void 0
        },
        link: {
            type: [Patient_Link],
            default: void 0
        }
    },
    {
        versionKey: false
    }).set('toJSON', {
        transform: function (doc, ret, options) {
            ret.id = ret._id;
        }
    }
);

module.exports = model('patient', PatientSchema);