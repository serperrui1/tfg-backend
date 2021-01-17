const { response } = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Incidencia = require('../models/incidencia');
const Proveedor = require('../models/proveedor');
const { generarJWT } = require('../helpers/jwt');
const Comprador = require('../models/comprador');
const AsistenteTecnico = require('../models/asistenteTecnico');

const crearIncidencia = async(req, res) => {

    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);

    try {
        const incidencia = new Incidencia(req.body);

        if ((await Proveedor.findById(uid) !== null) || (await Comprador.findById(uid) !== null)) {
            incidencia.creadorId = uid;

            if (!req.body.asistenteId)
                incidencia.asistenteId = "";

            //Guardar incidencia
            await incidencia.save();

            res.json({
                ok: true,
                incidencia
                //  token
            });
        }
        res.json({
            ok: false,
            msg: 'Controller: Sólo los compradores y proveedores pueden crear una incidencia.'
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Controller: Error inesperado ... revisa logs'
        });
    }

};

const getIncidencias = async(req, res = response) => { //si el que accede a las incidencias no es un asistente, error
    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    const asistente = await AsistenteTecnico.findById(uid);
    const incidencias = await Incidencia.find({});
    if (asistente != null) {
        res.json({
            ok: true,
            incidencias
        });
    } else {
        res.json({
            ok: false,
            msg: 'Controller: Debes ser un asistente para ver todas las incidencias.'
        });
    }
};

const getMisIncidencias = async(req, res = response) => {
    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    const misIncidenciasDueño = await Incidencia.find({ creadorId: uid }); //si no es null, el que accede es su creador
    const misIncidenciasAsistente = await Incidencia.find({ asistenteId: uid }); //si no es null, el que accede es su asistente

    if (misIncidenciasDueño != null && misIncidenciasDueño != []) {
        const incidencias = misIncidenciasDueño;
        res.json({
            ok: true,
            incidencias
        });
    }
    if (misIncidenciasAsistente != null && misIncidenciasAsistente != []) {
        const incidencias = misIncidenciasAsistente;
        res.json({
            ok: true,
            incidencias
        });
    } else {
        res.json({
            ok: false,
            msg: 'Controller: No tienes incidencias.'
        });
    }

};

const getIncidencia = async(req, res = response) => {
    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    const asistente = await AsistenteTecnico.findById(uid);
    const incidencia = await Incidencia.findById(req.params.id);

    if (asistente != null || incidencia.creadorId === uid) {
        res.json({
            ok: true,
            incidencia
        });
    } else { //no accede ni el dueño ni un asistente, error
        res.json({
            ok: false,
            msg: 'Controller: No eres un asistente ni el dueño de esta incidencia.'
        });
    }
};


const actualizarIncidencia = async(req, res = response) => {
    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);

    try {
        const incidencia = await Incidencia.findById(req.params.id);
        const { asistenteId, creadorId, ...campos } = req.body;
        if (!incidencia) {
            return res.status(404).json({
                ok: false,
                msg: 'Controller: No existe esta incidencia.'
            });
        } else {
            if (incidencia.asistenteId === uid || incidencia.creadorId === uid) { // soy el dueño de esta incidencia

                const incidenciaActualizada = await Incidencia.findByIdAndUpdate(req.params.id, campos, { new: true });
                res.json({
                    ok: true,
                    incidencia: incidenciaActualizada
                });
            } else {
                return res.status(400).json({
                    ok: false,
                    msg: 'Controller: Debes ser el asistente o dueño de esta incidencia.'
                });
            }
        }

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Controller: Error inesperado'
        });

    }
};

const borrarIncidencia = async(req, res = response) => {

    const incidencia = await Incidencia.findByIdAndDelete(req.params.id);
    res.json({
        ok: true,
        msg: 'Controller: Incidencia borrada'
    });
};


module.exports = {

    crearIncidencia,
    getIncidencias,
    getMisIncidencias,
    getIncidencia,
    actualizarIncidencia,
    borrarIncidencia

}