const { Schema, model } = require('mongoose');


const articuloCarritoSchema = Schema({

    producto: {
        type: Schema.Types.ObjectId,
        ref: 'Producto'
    },
    cantidad: {
        type: Number,
        required: true
    }

});

articuloCarritoSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object;
})


module.exports = model('articuloCarrito', articuloCarritoSchema);