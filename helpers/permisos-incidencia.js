const { response } = require('express');
const AsistenteTecnico = require('../models/asistenteTecnico');
const Comprador = require('../models/comprador');
const Proveedor = require('../models/proveedor');
const Incidencia = require('../models/incidencia');
const jwt = require('jsonwebtoken');


const accesoIncidencia = async(req, res = response, next) => {
    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    const asistente = await AsistenteTecnico.findById(uid);
    const incidencia = await Incidencia.findById(req.params.id);

    if (asistente === null && incidencia.creadorId != uid) {
        /* if (asistente === null && !Incidencia.findById(req.params.id)) { */
        return res.status(400).json({
            ok: false,
            msg: 'Helper: No eres un asistente ni el dueño de esta incidencia.'
        });
    } else {
        next();
    }
};

const accesoIncidencias = async(req, res = response, next) => {
    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    const asistente = await AsistenteTecnico.findById(uid);
    if (asistente === null) {
        return res.status(400).json({
            ok: false,
            msg: 'Helper: Debes ser un asistente para ver todas las incidencias.'
        });
    } else {
        next();
    }
};

const accesoMisIncidencias = async(req, res = response, next) => {
    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    const misIncidenciasDueño = await Incidencia.find({ creadorId: uid }); //si no es null, el que accede es su creador
    const misIncidenciasAsistente = await Incidencia.find({ asistenteId: uid }); //si no es null, el que accede es su asistente

    if ((misIncidenciasDueño === null && misIncidenciasAsistente === null) || (misIncidenciasDueño === [] && misIncidenciasAsistente === [])) {
        return res.status(400).json({
            ok: false,
            msg: 'Helper: No tienes incidencias.'
        });
    } else {
        next();
    }

};

const eliminarIncidencia = async(req, res = response, next) => {
    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    const incidencia = await Incidencia.findById(req.params.id);

    if (incidencia.asistenteId != uid) {
        return res.status(400).json({
            ok: false,
            errors: "Helper: Debes ser el asistente de esta incidencia para poder borrarla."
        });
    }
    if (incidencia.asistenteId === uid && incidencia.asignado === true && incidencia.resuelto === true) {
        next();
    }
};

const publicarIncidencia = async(req, res = response, next) => {
    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);

    if ((await Comprador.findById(uid) === null) && (await Proveedor.findById(uid) === null)) {
        return res.status(400).json({
            ok: false,
            errors: "Helper: Sólo los compradores y proveedores pueden crear una incidencia."
        });
    } else {
        next();
    }
};

const modificarIncidencia = async(req, res = response, next) => {
    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    const incidencia = await Incidencia.findById(req.params.id);

    if (incidencia.asistenteId != uid && incidencia.creadorId != uid) {
        return res.status(400).json({
            ok: false,
            errors: "Helper: Debes ser el dueño o el asistente de esta incidencia para poder modificarla."
        });
    } else {
        next();
    }
};

module.exports = {
    eliminarIncidencia,
    modificarIncidencia,
    publicarIncidencia,
    accesoIncidencias,
    accesoMisIncidencias,
    accesoIncidencia
};