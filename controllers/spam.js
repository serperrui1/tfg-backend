const { response } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Spam = require('../models/spam');
const Administrador = require('../models/administrador');
const { generarJWT } = require('../helpers/jwt');

const getSpam = async(req, res = response) => {
    /* const token = req.header('x-token'); */
    /* const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    const administrador = await Administrador.findById(uid); */
    /* if (administrador != null) { */
    const spam = await Spam.find({});
    console.log(spam);
    res.json({
        ok: true,
        spam: spam
    });
    /* } else {
        res.json({
            ok: false,
            msg: 'Controller: Sólo los administradores tienen acceso al spam.'
        });
    } */

}

const actualizarSpam = async(req, res = response) => {
    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    const administrador = await Administrador.findById(uid);

    try {
        const spam = await Spam.find({});
        /* const { proveedorId, compradorId, ...campos } = req.body; */
        if (!spam) {
            return res.status(404).json({
                ok: false,
                msg: 'Controller: no se encontró spam en la bbdd.'
            });
        } else {
            if (administrador != null) {
                console.log(spam[0].expresiones)
                console.log(req.body.expresiones)
                spam[0].expresiones = req.body.expresiones;
                console.log(spam[0])
                const spamActualizado = await Spam.findByIdAndUpdate(spam[0]._id, spam[0], { new: true });
                console.log(spam[0]._id)
                res.json({
                    ok: true,
                    spam: spamActualizado
                });
            } else {
                return res.status(400).json({
                    ok: false,
                    msg: 'Controller: Sólo los administradores tienen acceso al spam.'
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

module.exports = {
    getSpam,
    actualizarSpam
}