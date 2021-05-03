const { response } = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const AsistenteTecnico = require('../models/asistenteTecnico');
const Administrador = require('../models/administrador');
const { generarJWT } = require('../helpers/jwt');

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

        if (!asistenteTecnicoDB) {
            await AsistenteTecnico.findByIdAndDelete(req.params.id);
        }

        res.json({
            ok: true,
            msg: 'Asistente técnico eliminado'
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Ha habido algún problema al eliminar el asistente técnico, revisar logs.'
        });
    }

}

module.exports = {
    getAdministradores,
    actualizarAdministrador,
    actualizarContraseñaAdministrador,
    getAdministrador,
    crearAsistenteTecnico,
    borrarAsistenteTecnico
}