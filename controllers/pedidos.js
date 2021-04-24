const { response } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Pedido = require('../models/pedido');
const Administrador = require('../models/administrador');
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
        pedido.fechaCompra = new Date;
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

const getPedidos = async(req, res = response) => {
    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Administrador.findById(uid);
    if (admin) {
        const pedidos = await Pedido.find({});
        res.json({
            ok: true,
            pedidos
        });
    } else {
        res.json({
            ok: false,
            msg: 'Controller: Sólo un administrador puede obtener todos los pedidos.'
        });
    }
};

const getMisPedidos = async(req, res = response) => {

    const token = req.header('x-token');

    const { uid } = jwt.verify(token, process.env.JWT_SECRET);

    const pedidos = await Pedido.find({ comprador: uid });
    res.json({
        ok: true,
        pedidos
    });
};

const getMisPedidosProveedor = async(req, res = response) => {
    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    const pedidos = await Pedido.find({ proveedor: uid });
    res.json({
        ok: true,
        pedidos
    });
};

const getPedido = async(req, res = response) => {
    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    const pedido = await Pedido.findById(req.params.id);

    if (pedido.comprador == uid || pedido.proveedor == uid) {
        res.json({
            ok: true,
            pedido
        });
    } else {
        res.json({
            ok: false,
            msg: 'Controller: No eres el proveedor ni el comprador de este pedido.'
        });
    }
};


module.exports = {

    crearPedido,
    getMisPedidos,
    getPedido,
    getPedidos,
    getMisPedidosProveedor


}