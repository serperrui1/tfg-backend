const { response } = require('express');
const Comprador = require('../models/comprador');
const Proveedor = require('../models/proveedor');
const Administrador = require('../models/administrador');
const AsistenteTecnico = require('../models/asistenteTecnico');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

const loginComprador = async(req, res = response) => {
    const { email, password } = req.body;


    try {

        //Verificar email
        const compradorDB = await Comprador.findOne({ email });

        if (!compradorDB) {
            return res.status(404).json({
                ok: false,
                msg: 'El email no es válido'
            })
        }

        //Verificar contraseña

        const validPassword = bcrypt.compareSync(password, compradorDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta'
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
const googleSignIn = async(req, res = response) => {
    const googleToken = req.body.token;

    try {

        const { given_name, family_name, email, picture, locale } = await googleVerify(googleToken);

        const compradorDB = await Comprador.findOne({ email });
        let comprador;
        let nacionalidad = locale;
        if (locale === 'es') {
            nacionalidad = "España"
        }
        if (!compradorDB) {
            // si no existe el usuario
            comprador = new Comprador({
                nombre: given_name,
                apellidos: family_name,
                fechaNacimiento: " ",
                email,
                password: '@@@',
                nacionalidad,
                paisResidencia: " ",
                ciudad: " ",
                localidad: " ",
                direccionResidencia: " ",
                img: picture

            });

            // Guardar en DB
            await comprador.save();
        } else {
            // existe usuario
            comprador = compradorDB;
            comprador.google = true;
        }



        // Generar el TOKEN - JWT
        const token = await generarJWT(comprador.id);

        res.json({
            ok: true,
            token
        });

    } catch (error) {

        res.status(401).json({
            ok: false,
            msg: 'Token no es correcto',


        });
    }
}

const renewToken = async(req, res = response) => {

    const uid = req.uid;

    // Generar el TOKEN - JWT
    const token = await generarJWT(uid);

    res.json({
        ok: true,
        token
    });

}
const loginProveedor = async(req, res = response) => {
    const { email, password } = req.body;


    try {

        //Verificar email
        const proveedorDB = await Proveedor.findOne({ email });

        if (!proveedorDB) {
            return res.status(404).json({
                ok: false,
                msg: 'El email no es válido'
            })
        }

        //Verificar contraseña

        const validPassword = bcrypt.compareSync(password, proveedorDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta'
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
                msg: 'El email no es válido'
            })
        }

        //Verificar contraseña

        const validPassword = bcrypt.compareSync(password, administradorDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta',
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
                msg: 'El email no es válido'
            })
        }

        //Verificar contraseña

        const validPassword = bcrypt.compareSync(password, asistenteDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta'
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
    loginAsistente,
    googleSignIn,
    renewToken
}