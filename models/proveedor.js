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
    fechaRegistro: {
        type: Date,
        required: false
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
    unidadesVendidas: {
        type: Number,
        required: true
    },
    titularCuenta: {
        type: String,
        required: true
    },
    img: {
        type: String
    },
    posicion: [{
        lat: {
            type: Number,
        },
        lng: {
            type: Number,
        }
    }],
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