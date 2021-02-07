const { Schema, model } = require('mongoose');


const ChatSchema = Schema({

    fechaPublicacion: {
        type: String,
        required: true
    },
    mensajes: [{
        type: String,
        required: true
    }],
    compradorId: {
        type: String,
        required: true
    },
    proveedorId: {
        type: String,
        required: true
    },
    productoId: {
        type: String,
        required: true
    },
    proveedorNombre: {
        type: String,
        required: true
    }

});

ChatSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object;
})


module.exports = model('Chat', ChatSchema);