const { response } = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const Administrador = require('../models/administrador');
const AsistenteTecnico = require('../models/asistenteTecnico');
const { generarJWT } = require('../helpers/jwt');


const getAsistentesTecnicos = async(req, res = response) => {

    const asistentesTecnicos = await AsistenteTecnico.find({}, 'nombre apellidos email img');

    res.json({
        ok: true,
        asistentesTecnicos
    });
}

const getAsistenteTecnicoNombre = async(req, res = response) => {
    const asistenteTecnico = await AsistenteTecnico.findById(req.params.id);
    res.json({
        ok: true,
        nombre: asistenteTecnico.nombre
    });
};

const actualizarAsistenteTecnico = async(req, res = response) => {

    // TODO: Validar token y comprobar si el usuario es correcto

    const uid = req.params.id;

    try {

        const asistenteTecnicoDB = await AsistenteTecnico.findById(uid);

        if (!asistenteTecnicoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un asistente técnico con ese id'
            })
        }

        // Actualizaciones
        const { password, ...campos } = req.body;

        if (asistenteTecnicoDB.email === req.body.email) {
            delete campos.email;
        } else {
            const existeEmail = await AsistenteTecnico.findOne({ email: req.body.email })
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un asistente técnico con ese email'
                })
            }
        }

        const asistenteTecnicoActualizado = await AsistenteTecnico.findByIdAndUpdate(uid, campos, { new: true })

        res.json({
            ok: true,
            asistenteTecnico: asistenteTecnicoActualizado
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })

    }
}

const getAsistenteTecnico = async(req, res = response) => {

    const asistentesTecnicos = await AsistenteTecnico.findById(req.uid);
    res.json({
        ok: true,
        asistentesTecnicos
    });
}

const getAsistentesBuscador = async(req, res = response) => {

    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    const { asistente } = req.body;
    const admin = await Administrador.findById(uid);

    if (!admin) {
        return res.status(400).json({
            ok: false,
            msg: 'Controller: Debes ser administrador para registrar un asistente técnico.'
        });
    } else {
        if (asistente == "") {
            var asistentes = await AsistenteTecnico.find({});
            res.json({
                ok: true,
                asistentes
            });

        } else {
            console.log("he entrado")
            var asistentes = await AsistenteTecnico.find({});
            var asistentesResult = [];
            for (var i = 0; i < asistentes.length; i++) {
                if (asistentes[i].nombre.toLowerCase().includes(asistente.toLowerCase())) {
                    asistentesResult.push(asistentes[i]);
                }
            }
            console.log(asistentesResult);

            res.json({
                ok: true,
                asistentes: asistentesResult
            });
        }
    }
};

const actualizarContraseñaAsistente = async(req, res = response) => {

    // TODO: Validar token y comprobar si el usuario es correcto

    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);

    try {

        const asistenteDB = await AsistenteTecnico.findById(uid);
        if (!asistenteDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un asistente técnico con ese id'
            })
        } else {
            // Actualizaciones
            const { password, nuevaPassword } = req.body;
            const validPassword = bcrypt.compareSync(password, asistenteDB.password);

            if (!validPassword) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Contraseña no valida'
                })
            } else {
                const salt = bcrypt.genSaltSync();
                asistenteDB.password = bcrypt.hashSync(nuevaPassword, salt);

                const asistenteActualizado = await AsistenteTecnico.findByIdAndUpdate(uid, asistenteDB, { new: true })

                res.json({
                    ok: true,
                    asistente: asistenteActualizado
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


module.exports = {
    getAsistentesTecnicos,
    actualizarAsistenteTecnico,
    getAsistenteTecnicoNombre,
    getAsistenteTecnico,
    actualizarContraseñaAsistente,
    getAsistentesBuscador
}