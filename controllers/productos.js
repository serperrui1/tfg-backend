const { response } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Producto = require('../models/producto');
const Pedido = require('../models/pedido');
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

        const proveedor = await Proveedor.findById(uid);

        if (proveedor !== null) {

            producto.proveedor = uid;
            for (var i = producto.datosTecnicos.length - 1; i >= 0; i--) {
                if (producto.datosTecnicos[i].datosTecnicosTitulo == "") {
                    producto.datosTecnicos.splice(i, 1);
                }
            }

            producto.posicion[0] = proveedor.posicion[0];
            producto.unidadesVendidas = 0;


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
    const { titulo, categoria, subcategoria, valoraciones, precioMinimo, precioMaximo } = req.body;
    if (titulo == "") {
        var productos = await Producto.find({});

    } else {
        var productos = await Producto.find({ titulo: new RegExp(titulo, "i") });

    }

    if (categoria != "") {
        for (var i = productos.length - 1; i >= 0; i--) {
            if (productos[i].categoria !== categoria)
                productos.splice(i, 1);
        }

        if (subcategoria != "") {
            for (var i = productos.length - 1; i >= 0; i--) {
                if (productos[i].subcategoria !== subcategoria)
                    productos.splice(i, 1);
            }
        }

    }
    for (var i = productos.length - 1; i >= 0; i--) {
        var puntuacion = 0;
        for (var valoracion of productos[i].valoraciones) {
            puntuacion = puntuacion + valoracion.puntuacion;
        }

        puntuacion = puntuacion / productos[i].valoraciones.length;

        if (productos[i].valoraciones.length == 0 && valoraciones > 0)
            productos.splice(i, 1)

        else if (puntuacion < valoraciones)
            productos.splice(i, 1)
    }
    for (var i = productos.length - 1; i >= 0; i--) {
        if (productos[i].precio < precioMinimo)
            productos.splice(i, 1);

        else if (productos[i].precio > precioMaximo)
            productos.splice(i, 1);
    }

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


    try {

        const productoDB = await Producto.findById(productoId);

        if (!productoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el producto con esa ID en la base de datos'
            });
        }

        // Actualizaciones
        const { proveedor, ...campos } = req.body;

        if (productoDB.proveedor == uid) {


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
const crearValoracion = async(req, res = response) => {

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
        } else if (pedidos != null && pedidos.length != 0) {
            const { comentario, puntuacion } = req.body;
            let comprador = uid


            let nuevaValoracion = {
                comentario,
                puntuacion,
                comprador
            };



            productoDB.valoraciones.push(nuevaValoracion)

            const productoActualizado = await Producto.findByIdAndUpdate(productoId, productoDB, { new: true });

            res.json({
                ok: true,
                producto: productoActualizado
            });
        } else {
            return res.status(400).json({
                ok: false,
                msg: 'No tienes pedidos para este producto'
            });
        }


    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });

    }
};

const borrarValoracion = async(req, res = response) => {

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
        } else if (pedidos != null && pedidos.length != 0) {
            const { index } = req.body;

            productoDB.valoraciones.splice(index)

            const productoActualizado = await Producto.findByIdAndUpdate(productoId, productoDB, { new: true });

            res.json({
                ok: true,
                producto: productoActualizado
            });
        } else {
            return res.status(400).json({
                ok: false,
                msg: 'No tienes pedidos para este producto'
            });
        }


    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });

    }
};

const soyElProveedor = async(req, res = response) => {

    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = req.body;


    const proveedorProducto = await Producto.findById(id)

    if (uid == proveedorProducto.proveedor) {
        res.json({
            ok: true,
            soyElProveedor: true
        });
    } else {
        res.json({
            ok: true,
            soyElProveedor: false
        });
    }
};




module.exports = {

    crearProducto,
    getProductos,
    getMisProductos,
    getProducto,
    actualizarProducto,
    borrarProducto,
    getProductosBuscador,
    getProductosPorProveedorId,
    crearValoracion,
    borrarValoracion,
    soyElProveedor

}