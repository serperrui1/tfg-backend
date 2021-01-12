const { Schema, model } = require('mongoose');


const FaqSchema = Schema({

    pregunta: {
        type: String,
        required: true
    },
    respuesta: {
        type: String,
        required: true
    },
    tematica: {
        type: String,
        required: true
    }

});

FaqSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object;
})


module.exports = model('Faq', FaqSchema);