const { response } = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Pedido = require('../models/pedido');
const Proveedor = require('../models/proveedor');
const { generarJWT } = require('../helpers/jwt');
const Comprador = require('../models/comprador');
const Producto = require('../models/producto');

const crearPedido = async(req, res) => {

    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    const año = new Date().getFullYear();
    año.toString();
    const mes = new Date().getMonth() + 1;
    mes.toString();
    const dia = new Date().getDate();
    dia.toString();


    try {
        const pedido = new Pedido(req.body);


        pedido.comprador = uid;
        pedido.fechaCompra = new Date
            //año + "-" + mes + "-" + dia;


        //Guardar incidencia
        await pedido.save();

        console.log(pedido.producto)
        const productoDB = await Producto.findById(pedido.producto);
        console.log(productoDB.stock)
        if (!productoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el producto con esa ID en la base de datos'
            });
        }
        console.log(productoDB.stock)
        productoDB.stock = productoDB.stock - pedido.unidades;
        console.log(productoDB.stock)
        await Producto.findByIdAndUpdate(pedido.producto, productoDB, { new: true });

        res.json({
            ok: true,
            pedido
            //  token
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Controller: Error inesperado ... revisa logs'
        });
    }



};








module.exports = {

    crearPedido


}