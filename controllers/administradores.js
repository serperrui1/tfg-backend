const { response } = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const AsistenteTecnico = require('../models/asistenteTecnico');
const Administrador = require('../models/administrador');
const { generarJWT } = require('../helpers/jwt');
const Incidencia = require('../models/incidencia');
const Chat = require('../models/chat');
const Pedido = require('../models/pedido');
const Comprador = require('../models/comprador');
const Producto = require('../models/producto');
const Proveedor = require('../models/proveedor');



const getAdministradores = async(req, res = response) => {

    const administradores = await Administrador.find({}, 'nombre email ');
    res.json({
        ok: true,
        administradores
    });
}

const crearAsistenteTecnico = async(req, res) => {

    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    const { email, password } = req.body;

    try {
        const admin = await Administrador.findById(uid);
        if (!admin) {
            return res.status(400).json({
                ok: false,
                msg: 'Controller: Debes ser administrador para registrar un asistente técnico.'
            });
        }
        const asistenteYaRegistrado = await AsistenteTecnico.findOne({ email });
        if (asistenteYaRegistrado) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un asistente técnico con ese email.'
            });
        }
        const asistenteTecnico = new AsistenteTecnico(req.body);

        // Encriptar contraseña 
        const salt = bcrypt.genSaltSync();
        asistenteTecnico.password = bcrypt.hashSync(password, salt);
        /* comprador.img = ""; */
        await asistenteTecnico.save();
        //Generar el token
        const token = await generarJWT(asistenteTecnico.id);

        res.json({
            ok: true,
            asistenteTecnico,
            token
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado ... revisa logs'
        });
    }

};

const actualizarAdministrador = async(req, res = response) => {

    // TODO: Validar token y comprobar si el usuario es correcto

    const uid = req.params.id;

    try {

        const administradorDB = await Administrador.findById(uid);

        if (!administradorDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un administrador con ese id'
            })
        }

        // Actualizaciones
        const { password, ...campos } = req.body;

        if (administradorDB.email === req.body.email) {
            delete campos.email;
        } else {
            const existeEmail = await Administrador.findOne({ email: req.body.email })
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un administrador con ese email'
                })
            }
        }

        const administradorActualizado = await Administrador.findByIdAndUpdate(uid, campos, { new: true })

        res.json({
            ok: true,
            administrador: administradorActualizado
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })

    }
}
const actualizarContraseñaAdministrador = async(req, res = response) => {

    // TODO: Validar token y comprobar si el usuario es correcto

    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);

    try {

        const adminDB = await Administrador.findById(uid);
        if (!adminDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un administrador con ese id'
            })
        } else {
            // Actualizaciones
            const { password, nuevaPassword } = req.body;
            const validPassword = bcrypt.compareSync(password, adminDB.password);

            if (!validPassword) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Contraseña no valida'
                })
            } else {
                const salt = bcrypt.genSaltSync();
                adminDB.password = bcrypt.hashSync(nuevaPassword, salt);

                const administradorActualizado = await Administrador.findByIdAndUpdate(uid, adminDB, { new: true })

                res.json({
                    ok: true,
                    administrador: administradorActualizado
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

const getAdministrador = async(req, res = response) => {

    const administrador = await Administrador.findById(req.uid);
    res.json({
        ok: true,
        administrador
    });
}

const borrarAsistenteTecnico = async(req, res = response) => {
    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);

    try {
        const admin = await Administrador.findById(uid);
        if (!admin) {
            return res.status(400).json({
                ok: false,
                msg: 'Controller: Debes ser administrador para registrar un asistente técnico.'
            });
        }
        const asistenteTecnicoDB = await AsistenteTecnico.findById(req.params.id);
        if (!asistenteTecnicoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe asistente técnico con ese id'

            });
        }

        if (asistenteTecnicoDB) { //se deben resetear las incidencias que el asistente tenga asignadas

            var misIncidencias = await Incidencia.find({ asistenteId: asistenteTecnicoDB._id });
            if (misIncidencias.length != 0) {
                for (var i = 0; i < misIncidencias.length; i++) {
                    var incidencia = misIncidencias[i];
                    incidencia.asistenteId = '';
                    incidencia.asignado = false;
                    incidencia.resuelto = false;
                    incidencia.leida = true;
                    //asignado true y asistente vacio, se debe controlar en front
                    await Incidencia.findByIdAndUpdate(incidencia._id, incidencia, { new: true });
                }
            }
            await AsistenteTecnico.findByIdAndDelete(req.params.id);

            res.json({
                ok: true,
                msg: 'Asistente técnico eliminado'
            });
        }

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Ha habido algún problema al eliminar el asistente técnico, revisar logs.'
        });
    }
}


const borrarProveedor = async(req, res = response) => {
    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);

    try {
        const admin = await Administrador.findById(uid);
        if (!admin) {
            return res.status(400).json({
                ok: false,
                msg: 'Controller: Debes ser administrador para registrar un asistente técnico.'
            });
        }

        const proveedorDB = await Proveedor.findById(req.params.id);
        if (!proveedorDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe proveedor con ese id'
            });

        } else {

            var misIncidencias = await Incidencia.find({ creadorId: proveedorDB._id });
            if (misIncidencias.length != 0) {
                for (var i = 0; i < misIncidencias.length; i++) {
                    var incidencia = misIncidencias[i];
                    await Incidencia.findByIdAndDelete(incidencia._id);
                    /* incidencia.creadorId = ''; */
                    //asignado true y creador vacio, se debe controlar en front
                    /* await Incidencia.findByIdAndUpdate(incidencia._id, incidencia, { new: true }); */
                }
            }

            var misChats = await Chat.find({ proveedorId: proveedorDB._id });
            if (misChats.length != 0) {
                for (var i = 0; i < misChats.length; i++) {
                    var chat = misChats[i];
                    await Chat.findByIdAndDelete(chat._id);
                    /* chat.proveedorId = '';
                    //asignado true y creador vacio, se debe controlar en front
                    await Chat.findByIdAndUpdate(chat._id, chat, { new: true }); */
                }
            }

            /* var misPedidos = await Pedido.find({ proveedor: proveedorDB._id });
            if (misPedidos.length != 0) {
                for (var i = 0; i < misPedidos.length; i++) {
                    var pedido = misPedidos[i];
                    pedido.proveedor = '';
                    //asignado true y creador vacio, se debe controlar en front
                    await Pedido.findByIdAndUpdate(pedido._id, pedido, { new: true });
                }
            } */

            var misProductos = await Producto.find({ proveedor: proveedorDB._id });
            if (misProductos.length != 0) {
                for (var i = 0; i < misProductos.length; i++) {
                    await Producto.findByIdAndDelete(misProductos[i]._id);
                }
            }

            await Proveedor.findByIdAndDelete(req.params.id);
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


const borrarComprador = async(req, res = response) => {
    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);

    try {
        const admin = await Administrador.findById(uid);
        if (!admin) {
            return res.status(400).json({
                ok: false,
                msg: 'Controller: Debes ser administrador para registrar un asistente técnico.'
            });
        }

        const compradorDB = await Comprador.findById(req.params.id);
        if (!compradorDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe comprador con ese id'
            });

        } else {
            var misIncidencias = await Incidencia.find({ creadorId: compradorDB._id });
            if (misIncidencias.length != 0) {
                for (var i = 0; i < misIncidencias.length; i++) {
                    var incidencia = misIncidencias[i];
                    await Incidencia.findByIdAndDelete(incidencia._id);
                    /* incidencia.creadorId = '';
                    //asignado true y creador vacio, se debe controlar en front
                    await Incidencia.findByIdAndUpdate(incidencia._id, incidencia, { new: true }); */
                }
            }

            var misChats = await Chat.find({ compradorId: compradorDB._id });
            if (misChats.length != 0) {
                for (var i = 0; i < misChats.length; i++) {
                    var chat = misChats[i];
                    await Chat.findByIdAndDelete(chat._id);
                    /* chat.compradorId = '';
                    //asignado true y creador vacio, se debe controlar en front
                    await Chat.findByIdAndUpdate(chat._id, chat, { new: true }); */
                }
            }

            /* var misPedidos = await Pedido.find({ comprador: compradorDB._id });
            if (misPedidos.length != 0) {
                for (var i = 0; i < misPedidos.length; i++) {
                    var pedido = misPedidos[i];
                    pedido.comprador = '';
                    //asignado true y creador vacio, se debe controlar en front
                    await Pedido.findByIdAndUpdate(pedido._id, pedido, { new: true });
                }
            } */

            await Comprador.findByIdAndDelete(req.params.id);
            res.json({
                ok: true,
                msg: 'Comprador y sus entidades borrados'
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
    getAdministradores,
    actualizarAdministrador,
    actualizarContraseñaAdministrador,
    getAdministrador,
    crearAsistenteTecnico,
    borrarAsistenteTecnico,
    borrarComprador,
    borrarProveedor
}