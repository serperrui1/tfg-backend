const { response } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Pedido = require('../models/pedido');
const Administrador = require('../models/administrador');
const { generarJWT } = require('../helpers/jwt');
const Comprador = require('../models/comprador');
const Producto = require('../models/producto');
const Proveedor = require('../models/proveedor');

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
        var productoDB = await Producto.findById(pedido.producto);

        pedido.comprador = uid;
        pedido.fechaCompra = new Date;

        pedido.tituloProducto = productoDB.titulo;
        var prov = await Proveedor.findById(pedido.proveedor);
        pedido.nombreProveedor = prov.nombreEmpresa;



        //Guardar 
        await pedido.save();

        /* var productoDB = await Producto.findById(pedido.producto); */

        if (!productoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el producto con esa ID en la base de datos'
            });
        }
        productoDB.stock = productoDB.stock - pedido.unidades;
        productoDB.unidadesVendidas = productoDB.unidadesVendidas + pedido.unidades;




        //productoEstrella producto---------------------------------------------------
        var pMedia = productoDB.puntuacionMedia;
        var ventas = productoDB.unidadesVendidas;
        var valoraciones = productoDB.valoraciones.length;
        if (pMedia >= 4 && ventas >= 2 && valoraciones >= 2) {
            productoDB.productoEstrella = true;
        } else {
            productoDB.productoEstrella = false;
        }
        //--------------------------------------------------------------------------





        await Producto.findByIdAndUpdate(productoDB._id, productoDB);

        var proveedorDB = await Proveedor.findById(req.body.proveedor);

        proveedorDB.unidadesVendidas = proveedorDB.unidadesVendidas + pedido.unidades;

        await Proveedor.findByIdAndUpdate(pedido.proveedor, proveedorDB);

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

const getPedidosBuscador = async(req, res = response) => {
    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    const { pedido } = req.body;
    if (pedido == "") {
        var pedidos = await Pedido.find({ $or: [{ proveedor: uid }, { comprador: uid }] });
        res.json({
            ok: true,
            pedidos
        });
    } else {
        var pedidos = await Pedido.find({ $or: [{ proveedor: uid }, { comprador: uid }] });
        var pedidosResult = [];
        for (var i = 0; i < pedidos.length; i++) {
            var producto = await Producto.findById(pedidos[i].producto);
            var tituloProducto = producto.titulo;
            if (tituloProducto.toLowerCase().includes(pedido.toLowerCase())) {
                pedidosResult.push(pedidos[i]);
            }
        }
        console.log(pedidosResult);

        res.json({
            ok: true,
            pedidos: pedidosResult
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
const actualizarEnvio = async(req, res = response) => {
    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    const pedido = await Pedido.findById(req.params.id);
    console.log(req.body.estado);

    if (pedido.comprador == uid || pedido.proveedor == uid) {
        pedido.estadoEnvio = req.body.estado;
        await Pedido.findByIdAndUpdate(req.params.id, pedido);
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
    getPedidosBuscador,
    getMisPedidosProveedor,
    actualizarEnvio


}