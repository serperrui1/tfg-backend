const { response } = require('express');
const Proveedor = require('../models/proveedor');
const jwt = require('jsonwebtoken');

const validarProveedor = async(req, res = response, next) => {
    const token = req.header('x-token');

    const { uid } = jwt.verify(token, process.env.JWT_SECRET);

    if (await Proveedor.findById(uid) === null) {

        return res.status(400).json({
            ok: false,
            errors: "Solo pueden crear productos los proveedores"
        });
    } else {
        next();
    }




}

module.exports = {
    validarProveedor
}