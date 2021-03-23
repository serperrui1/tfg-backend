const { Schema, model } = require('mongoose');


const IncidenciaSchema = Schema({

    fechaPublicacion: {
        type: String,
        required: true
    },
    titulo: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    tematica: {
        type: String,
        required: true
    },
    asignado: {
        type: Boolean,
        default: false
    },
    resuelto: {
        type: Boolean,
        default: false
    },
    mensajes: [{
        type: String,
        required: false
    }],
    creadorId: {
        type: String,
        required: true
    },
    asistenteId: {
        type: String,
        required: false
    },
    leida: {
        type: Boolean,
        required: false
    },
    ultimoEmisor: {
        type: String,
        required: false
    }

});

IncidenciaSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object;
})


module.exports = model('Incidencia', IncidenciaSchema);