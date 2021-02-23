const { Schema, model } = require('mongoose');


const ProductoSchema = Schema({

    imagenes: [{
        type: String
    }],
    titulo: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    datosTecnicos: [{
        datosTecnicosTitulo: {
            type: String,
            required: true
        },
        datosTecnicosDescripcion: {
            type: String,
            required: true
        }
    }],
    valoraciones: [{
        comentario: {
            type: String,
            required: true
        },
        puntuacion: {
            type: Number,
            required: true
        }
    }],

    categoria: {
        type: String,
        requireD: true
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