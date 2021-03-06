const { response } = require('express');
const Comprador = require('../models/comprador');
const Proveedor = require('../models/proveedor');
const Administrador = require('../models/administrador');
const AsistenteTecnico = require('../models/asistenteTecnico');
const bcrypt = require('bcrypt');
const { generarJWT } = require('../helpers/jwt');

const loginComprador = async(req, res = response) => {
    const { email, password } = req.body;


    try {

        //Verificar email
        const compradorDB = await Comprador.findOne({ email });

        if (!compradorDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Contraseña o email no son validos'
            })
        }

        //Verificar contraseña

        const validPassword = bcrypt.compareSync(password, compradorDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña o email no son validos'
            })
        }

        //Generar el tocken

        const token = await generarJWT(compradorDB.id);

        res.json({
            ok: true,
            token
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })

    }

}

const loginProveedor = async(req, res = response) => {
    const { email, password } = req.body;


    try {

        //Verificar email
        const proveedorDB = await Proveedor.findOne({ email });

        if (!proveedorDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Contraseña o email no son validos'
            })
        }

        //Verificar contraseña

        const validPassword = bcrypt.compareSync(password, proveedorDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña o email no son validos'
            })
        }

        //Generar el tocken

        const token = await generarJWT(proveedorDB.id);

        res.json({
            ok: true,
            token
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })

    }

}

const loginAdministrador = async(req, res = response) => {
    const { email, password } = req.body;


    try {

        //Verificar email
        const administradorDB = await Administrador.findOne({ email });

        if (!administradorDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Contraseña o email no son validos'
            })
        }

        //Verificar contraseña

        const validPassword = bcrypt.compareSync(password, administradorDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña o email no son validos',
                email: email
            })
        }

        //Generar el tocken

        const token = await generarJWT(administradorDB.id);

        res.json({
            ok: true,
            token
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })

    }

}

const loginAsistente = async(req, res = response) => {
    const { email, password } = req.body;


    try {

        //Verificar email
        const asistenteDB = await AsistenteTecnico.findOne({ email });

        if (!asistenteDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Contraseña o email no son validos'
            })
        }

        //Verificar contraseña

        const validPassword = bcrypt.compareSync(password, asistenteDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña o email no son validos'
            })
        }

        //Generar el tocken

        const token = await generarJWT(asistenteDB.id);

        res.json({
            ok: true,
            token
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })

    }

}

module.exports = {
    loginComprador,
    loginProveedor,
    loginAdministrador,
    loginAsistente
}