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
        } else {
            res.json({
                ok: true,
                msg: 'Solo el proveedor puede crear un producto'
            });


        }
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado ... revisa logs'
        });
    }

};

const getProductos = async(req, res = response) => {

    const productos = await Producto.find({});
    res.json({
        ok: true,
        productos
    });
};

const getMisProductos = async(req, res = response) => {

    const token = req.header('x-token');

    const { uid } = jwt.verify(token, process.env.JWT_SECRET);

    const productos = await Producto.find({ proveedor: uid });
    res.json({
        ok: true,
        productos
    });
};

const getProductosPorProveedorId = async(req, res = response) => {

    const proveedorId = req.params.id;
    const productos = await Producto.find({ proveedor: proveedorId });
    res.json({
        ok: true,
        productos
    });
};

const getProducto = async(req, res = response) => {

    const producto = await Producto.findById(req.params.id);
    res.json({
        ok: true,
        producto
    });
};

const getProductosBuscador = async(req, res = response) => {
    console.log(req.params.nombre)

    const productos = await Producto.find({ titulo: { $regex: req.params.nombre } });
    res.json({
        ok: true,
        productos
    });
};


const actualizarProducto = async(req, res = response) => {

    // TODO: Validar token y comprobar si el usuario es correcto
    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    const productoId = req.params.id;
    const pedidos = await Pedido.find({ comprador: uid });

    try {

        const productoDB = await Producto.findById(productoId);

        if (!productoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el producto con esa ID en la base de datos'
            });
        }

        // Actualizaciones
        const { proveedor, datosTecnicosAntiguos, valoracionesAntiguas, ...campos } = req.body;

        if (productoDB.proveedor == uid) {


            for (datos of datosTecnicosAntiguos) {
                campos.datosTecnicos.push(datos);
            }
            console.log(campos.datosTecnicos)
            const productoActualizado = await Producto.findByIdAndUpdate(productoId, campos, { new: true });

            res.json({
                ok: true,
                producto: productoActualizado
            });

        } else if (pedidos != null && pedidos.length != 0) {
            for (valoracion of valoracionesAntiguas) {
                campos.valoraciones.push(valoracion);
            }
            console.log(campos.valoraciones)
            const productoActualizado = await Producto.findByIdAndUpdate(productoId, campos, { new: true });

            res.json({
                ok: true,
                producto: productoActualizado
            });

        } else {
            return res.status(400).json({
                ok: false,
                msg: 'No es el proveedor del producto'
            });
        }


    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });

    }
};

const borrarProducto = async(req, res = response) => {

    const producto = await Producto.findByIdAndDelete(req.params.id);
    res.json({
        ok: true,
        msg: 'producto borrado'
    });
};




module.exports = {

    crearProducto,
    getProductos,
    getMisProductos,
    getProducto,
    actualizarProducto,
    borrarProducto,
    getProductosBuscador,
    getProductosPorProveedorId

}