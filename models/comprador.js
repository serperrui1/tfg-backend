const { Schema, model } = require('mongoose');

const CompradorSchema = Schema({

    nombre: {
        type: String,
        required: true
    },
    apellidos: {
        type: String,
        required: true
    },
    fechaNacimiento: {
        type: String,
        required: true
    },
    fechaRegistro: {
        type: Date,
        required: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    paisResidencia: {
        type: String,
        required: true
    },
    ciudad: {
        type: String,
        required: true
    },
    localidad: {
        type: String,
        required: true
    },
    direccionResidencia: {
        type: String,
        required: true
    },
    codigoPostal: {
        type: String,
        required: true
    },
    numeroTelefono: {
        type: Number,
    },
    tarjetaCredito: {
        type: String,
        required: false
    },
    cuentaPaypal: {
        type: String,
        required: false
    },
    google: {
        type: Boolean,
        default: false
    },
    img: {
        type: String,
        required: false
    },
    carritoCompra: [{
        type: Schema.Types.ObjectId,
        ref: 'articuloCarrito'
    }]


});
CompradorSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
})
module.exports = model('Comprador', CompradorSchema);