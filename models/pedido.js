const { Schema, model } = require('mongoose');


const PedidoSchema = Schema({

    producto: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Producto'
    },
    unidades: {
        type: Number,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    fechaCompra: {
        type: String,
        required: true
    },
    proveedor: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Proveedor'
    },
    comprador: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Comprador'
    },
    direccionEnvio: {
        type: String,
        required: true
    },
    codigoPostal: {
        type: Number,
        required: true
    },
    numeroTelefono: {
        type: Number,
        required: true
    },
    nombreComprador: {
        type: String,
        required: true
    }



});

PedidoSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object;
})


module.exports = model('Pedido', PedidoSchema);