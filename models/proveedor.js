const { Schema, model } = require('mongoose');

const ProveedorSchema = Schema({

    nombreEmpresa: {
        type: String,
        required: true
    },
    autonomo: {
        type: Boolean,
        required: true
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
    sector: [{
        type: String,
        required: true
    }],
    registroMercantil: {
        type: String,
    },
    nif: {
        type: String,
    },
    direccion: {
        type: String,
        required: true
    },
    cuentaBancariaIBAN: {
        type: String,
        required: true
    },
    titularCuenta: {
        type: String,
        required: true
    },
    productosId: [{
        type: String
    }]


});
ProveedorSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
})
module.exports = model('Proveedor', ProveedorSchema);