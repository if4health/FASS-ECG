const { Schema, model } = require('mongoose');

const ChunckSchema = new Schema({
    id: {
        type: String
    },
    reference: {
        type: String
    },
    position: {
        type: Number
    },
    data: {
        type: String
    }
});

module.exports = model('chunck', ChunckSchema);