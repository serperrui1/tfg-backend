const { response } = require('express')
const bcrypt = require('bcrypt')

const Administrador = require('../models/administrador');
const { generarJWT } = require('../helpers/jwt');

const getAdministradores = async(req, res = response) => {

    const administradores = await Administrador.find({}, 'nombre email ');
    res.json({
        ok: true,
        administradores
    });
}

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


module.exports = {

    getAdministradores,
    actualizarAdministrador

}