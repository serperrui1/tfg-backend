const { response } = require('express');
const Administrador = require('../models/administrador');
const AsistenteTecnico = require('../models/asistenteTecnico');
const jwt = require('jsonwebtoken');

const validarPermisosFaq = async(req, res = response, next) => {
    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);

    if ((await Administrador.findById(uid) === null) && (await AsistenteTecnico.findById(uid) === null)) {
        return res.status(400).json({
            ok: false,
            errors: "Sólo los administradores y asistentes técnicos pueden crear y borrar faqs"
        });
    } else {
        next();
    }
}

module.exports = {
    validarPermisosFaq
}