const { Schema, model } = require('mongoose');


const ProductoSchema = Schema({

    imagenes: [{
        type: String,
        required: true
    }],
    titulo: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    datosTecnicos: {
        type: String,
        required: true
    },
    categoria: {
        type: String,
        required: true
    },
    subcategoria: {
        type: String,
    },
    precio: {
        type: Number,
        required: true
    },
    unidadesMinimas: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    proveedor: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Proveedor'
    }

});

ProductoSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object;
})


module.exports = model('Producto', ProductoSchema);