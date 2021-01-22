const { response } = require('express')
const bcrypt = require('bcrypt')

const AsistenteTecnico = require('../models/asistenteTecnico');
const { generarJWT } = require('../helpers/jwt');

const getAsistentesTecnicos = async(req, res = response) => {

    const asistentesTecnicos = await AsistenteTecnico.find({}, 'nombre email ');
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

const borrarAsistenteTecnico = async(req, res = response) => {

    const uid = req.params.id;
    try {
        const asistenteTecnicoDB = await AsistenteTecnico.findById(uid);
        if (!asistenteTecnicoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe asistente técnico con ese id'

            });
        }

        await AsistenteTecnico.findByIdAndDelete(uid);


        res.json({
            ok: true,
            msg: 'Asistente técnico eliminado'
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });

    }

}

module.exports = {

    getAsistentesTecnicos,
    actualizarAsistenteTecnico,
    getAsistenteTecnicoNombre,
    borrarAsistenteTecnico,
    getAsistenteTecnico


}