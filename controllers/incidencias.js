const { response } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Incidencia = require('../models/incidencia');
const Proveedor = require('../models/proveedor');
const { generarJWT } = require('../helpers/jwt');
const Comprador = require('../models/comprador');
const AsistenteTecnico = require('../models/asistenteTecnico');

const crearIncidencia = async(req, res) => {

    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    const año = new Date().getFullYear();
    año.toString();
    const mes = new Date().getMonth() + 1;
    mes.toString();
    const dia = new Date().getDate();
    dia.toString();

    try {
        if ((await Proveedor.findById(uid) !== null) || (await Comprador.findById(uid) !== null)) {

            const incidencia = new Incidencia(req.body);
            incidencia.creadorId = uid;

            if (!req.body.asistenteId)
                incidencia.asistenteId = "";

            if (!req.body.fechaPublicacion) {
                incidencia.fechaPublicacion = año + "-" + mes + "-" + dia;
                console.log(incidencia.fechaPublicacion);
            }

            incidencia.ultimoEmisor = uid;
            incidencia.leida = true;

            await incidencia.save();

            res.json({
                ok: true,
                incidencia
                //  token
            });

        } else {
            res.json({
                ok: false,
                msg: 'Controller: Sólo los compradores y proveedores pueden crear una incidencia.'
            });
        }

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
    const incidencias = await Incidencia.find({ asistenteId: "" });
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

    if (misIncidenciasDueño.length != 0) {
        res.json({
            ok: true,
            incidencias: misIncidenciasDueño
        });
    } else if (misIncidenciasAsistente.length != 0) {
        res.json({
            ok: true,
            incidencias: misIncidenciasAsistente
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
    const asistente = await AsistenteTecnico.findById(uid);

    try {
        const incidencia = await Incidencia.findById(req.params.id);
        const { asistenteId, creadorId, asignado, ...campos } = req.body;
        if (!incidencia) {
            return res.status(404).json({
                ok: false,
                msg: 'Controller: No existe esta incidencia.'
            });
        } else {
            // soy el dueño de esta incidencia o ya soy su asistente
            if ((incidencia.asistenteId === uid && incidencia.asignado === true) || incidencia.creadorId === uid) {
                incidencia.ultimoEmisor = uid;
                incidencia.leida = false;
                incidencia.mensajes.push(campos.mensajes);
                const incidenciaActualizada = await Incidencia.findByIdAndUpdate(req.params.id, incidencia, { new: true });
                res.json({
                    ok: true,
                    incidencia: incidenciaActualizada
                });
            }
            //la quiero actualizar por primera vez para ser su asistente
            else if (incidencia.asistenteId === "" && incidencia.asignado === false && asistente != null) {
                incidencia.asistenteId = uid;
                incidencia.ultimoEmisor = uid;
                incidencia.asignado = true;
                incidencia.leida = false;
                incidencia.mensajes.push(campos.mensajes);
                const incidenciaActualizada = await Incidencia.findByIdAndUpdate(req.params.id, incidencia, { new: true });

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

const incidenciaLeida = async(req, res = response) => {
    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    try {
        const incidencia = await Incidencia.findById(req.params.id);
        if (!incidencia) {
            return res.status(404).json({
                ok: false,
                msg: 'Controller: No existe esta incidencia.'
            });
        } else {
            if (incidencia.ultimoEmisor != uid) {
                incidencia.leida = true;
                const incidenciaActualizada = await Incidencia.findByIdAndUpdate(req.params.id, incidencia, { new: true });
                res.json({
                    ok: true,
                    incidencia: incidenciaActualizada
                });
            } else if (incidencia.ultimoEmisor === uid) {
                res.json({
                    ok: true,
                    incidencia: incidencia
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
}

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
    borrarIncidencia,
    incidenciaLeida

}