const { response } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Proveedor = require('../models/proveedor');
const Administrador = require('../models/administrador');
const Incidencia = require('../models/incidencia');
const Chat = require('../models/chat');
const Pedido = require('../models/pedido');
const Producto = require('../models/producto');
const { generarJWT } = require('../helpers/jwt');

const crearProveedor = async(req, res) => {

    const { email, password, lat, lng } = req.body;


    try {
        const existeEmail = await Proveedor.findOne({ email });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un proveedor con ese email'
            });
        }

        const proveedor = new Proveedor(req.body);

        if (!req.body.puntuacionMedia)
            proveedor.puntuacionMedia = 0;

        // Encriptar contraseña 
        const salt = bcrypt.genSaltSync();
        proveedor.password = bcrypt.hashSync(password, salt);

        proveedor.img = "";
        proveedor.fechaRegistro = new Date;
        proveedor.posicion = [{
            lat: lat,
            lng: lng
        }];
        proveedor.unidadesVendidas = 0;


        //Guardar usuario
        await proveedor.save();

        //Generar el tocken

        const token = await generarJWT(proveedor.id);

        res.json({
            ok: true,
            proveedor,
            token
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado ... revisa logs'
        });
    }


    /* await proveedor.save();

    res.json({
        ok: true,
        proveedor

    }); */
};

const getProveedores = async(req, res = response) => {

    const proveedores = await Proveedor.find({});
    res.json({
        ok: true,
        proveedores
    });
};


const getProveedor = async(req, res = response) => {

    const proveedor = await Proveedor.findById(req.uid);
    res.json({
        ok: true,
        proveedor
    });
};

const getProveedorPorId = async(req, res = response) => {

    const proveedor = await Proveedor.findById(req.params.id);
    res.json({
        ok: true,
        proveedor
    });
};

const getProveedorNombre = async(req, res = response) => {
    try {
        const proveedor = await Proveedor.findById(req.params.id);
        if (proveedor) {
            res.json({
                ok: true,
                nombreEmpresa: proveedor.nombreEmpresa
            });
        } else {
            if (!proveedor) {
                res.json({
                    ok: true,
                    nombre: ""
                });
            }
        }

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })

    }
};

const actualizarProveedor = async(req, res = response) => {

    // TODO: Validar token y comprobar si el usuario es correcto

    const uid = req.params.id;

    try {

        const proveedorDB = await Proveedor.findById(uid);

        if (!proveedorDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un proveedor con ese id'
            });
        }

        // Actualizaciones
        const { password, google, ...campos } = req.body;

        if (proveedorDB.email === req.body.email) {
            delete campos.email;
        } else {
            const existeEmail = await Proveedor.findOne({ email: req.body.email })
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un proveedor con ese email.'
                });
            }
        }

        const proveedorActualizado = await Proveedor.findByIdAndUpdate(uid, campos, { new: true });

        res.json({
            ok: true,
            proveedor: proveedorActualizado
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });

    }
};


const actualizarContraseñaProveedor = async(req, res = response) => {

    // TODO: Validar token y comprobar si el usuario es correcto

    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);

    try {

        const proveedorDB = await Proveedor.findById(uid);
        if (!proveedorDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un proveedor con ese id'
            })
        } else {
            // Actualizaciones
            const { password, nuevaPassword } = req.body;
            const validPassword = bcrypt.compareSync(password, proveedorDB.password);

            if (!validPassword) {
                return res.status(400).json({
                    ok: false,
                    msg: 'La contraseña actual introducida es incorrecta.'
                })
            } else {
                const salt = bcrypt.genSaltSync();
                proveedorDB.password = bcrypt.hashSync(nuevaPassword, salt);

                const proveedorActualizado = await Proveedor.findByIdAndUpdate(uid, proveedorDB, { new: true })

                res.json({
                    ok: true,
                    proveedor: proveedorActualizado
                })

            }

        }


    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })

    }
}

const getProveedoresBuscador = async(req, res = response) => {
    var proveedoresResult = [];
    const { proveedor, sector } = req.body;
    let proveedores = await Proveedor.find({ nombreEmpresa: new RegExp(proveedor, "i") });
    for (const prov of proveedores) {
        proveedoresResult.push(prov);
    }
    if (sector) {
        proveedoresResult = proveedoresResult.filter((e) => e.sector == sector);
    }
    res.json({
        ok: true,
        proveedores: proveedoresResult
    });


    /* const { proveedor } = req.body;

    if (proveedor == "") {
        var proveedores = await Proveedor.find({});
        res.json({
            ok: true,
            proveedores
        });

    } else {
        console.log("he entrado")
        var proveedores = await Proveedor.find({});
        var proveedoresResult = [];
        for (var i = 0; i < proveedores.length; i++) {
            if (proveedores[i].nombreEmpresa.toLowerCase().includes(proveedor.toLowerCase())) {
                proveedoresResult.push(proveedores[i]);
            }
        }
        console.log(proveedoresResult);

        res.json({
            ok: true,
            proveedores: proveedoresResult
        });
    } */



};

const borrarUsuario = async(req, res = response) => {
    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);

    try {
        const proveedorDB = await Proveedor.findById(uid);
        if (!proveedorDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe proveedor con ese id'
            });

        } else {
            /* var misIncidencias = await Incidencia.find({ creadorId: uid });
            if (misIncidencias.length != 0) {
                for (var i = 0; i < misIncidencias.length; i++) {
                    await Incidencia.findByIdAndDelete(misIncidencias[i]._id);
                }
            } */

            var misIncidencias = await Incidencia.find({ creadorId: uid });
            if (misIncidencias.length != 0) {
                for (var i = 0; i < misIncidencias.length; i++) {
                    var incidencia = misIncidencias[i];
                    await Incidencia.findByIdAndDelete(incidencia._id);
                    /* incidencia.creadorId = '';
                    //asignado true y creador vacio, se debe controlar en front
                    await Incidencia.findByIdAndUpdate(incidencia._id, incidencia, { new: true }); */
                }
            }

            var misChats = await Chat.find({ proveedorId: uid });
            if (misChats.length != 0) {
                for (var i = 0; i < misChats.length; i++) {
                    var chat = misChats[i];
                    await Chat.findByIdAndDelete(chat._id);
                    /* chat.proveedorId = '';
                    //asignado true y creador vacio, se debe controlar en front
                    await Chat.findByIdAndUpdate(chat._id, chat, { new: true }); */
                }
            }

            /* var misPedidos = await Pedido.find({ proveedor: uid });
            if (misPedidos.length != 0) {
                for (var i = 0; i < misPedidos.length; i++) {
                    var pedido = misPedidos[i];
                    pedido.proveedor = '';
                    console.log(pedido.proveedor)
                        //asignado true y creador vacio, se debe controlar en front
                    await Pedido.findByIdAndUpdate(pedido._id, pedido, { new: true });
                }
            } */

            var misProductos = await Producto.find({ proveedor: uid });
            if (misProductos.length != 0) {
                for (var i = 0; i < misProductos.length; i++) {
                    await Producto.findByIdAndDelete(misProductos[i]._id);
                }
            }

            await Proveedor.findByIdAndDelete(uid);
            res.json({
                ok: true,
                msg: 'Proveedor y sus entidades borrados'
            });
        }
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}




module.exports = {

    crearProveedor,
    getProveedores,
    actualizarProveedor,
    getProveedor,
    getProveedorNombre,
    getProveedorPorId,
    actualizarContraseñaProveedor,
    borrarUsuario,
    getProveedoresBuscador

};