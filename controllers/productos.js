const { response } = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Producto = require('../models/producto');
const Proveedor = require('../models/proveedor');
const { generarJWT } = require('../helpers/jwt');

const crearProducto = async(req, res) => {

    const { id } = req.body;
    // Leer el Token

    const token = req.header('x-token');

    const { uid } = jwt.verify(token, process.env.JWT_SECRET);

    try {
        const producto = new Producto(req.body);


        if (!req.body.subcategoria)
            producto.subcategoria = "";

        //Añadir el proveedor que lo ha creado



        if (await Proveedor.findById(uid) !== null) {

            producto.proveedor = uid;

            //Guardar usuario
            await producto.save();



            res.json({
                ok: true,
                producto
                //  token
            });
        }
        res.json({
            ok: true,
            msg: 'Solo el proveedor puede crear un producto'
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado ... revisa logs'
        });
    }

};
const getProductos = async(req, res = response) => {

    const productos = await Producto.find({}, 'titulo, img, descripcion ');
    res.json({
        ok: true,
        productos
    });
}



module.exports = {

    crearProducto,
    getProductos

}