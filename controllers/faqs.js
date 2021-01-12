const { response } = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Faq = require('../models/faq');
const AsistenteTecnico = require('../models/asistenteTecnico');
const Administrador = require('../models/administrador');
const { generarJWT } = require('../helpers/jwt');

const crearFaq = async(req, res) => {

    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);

    try {
        const faq = new Faq(req.body);

        if (await Administrador.findById(uid) !== null) {
            //Guardar faq
            await faq.save();
            res.json({
                ok: true,
                faq
            });
        } else if (await AsistenteTecnico.findById(uid) !== null) {
            //Guardar faq
            await faq.save();
            res.json({
                ok: true,
                faq
            });
        } else {
            res.json({
                ok: false,
                msg: 'Sólo un administrador o asistente técnico puede crear un FAQ'
            });
        }
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado ... revisa logs'
        });
    }
};

const getFaqs = async(req, res = response) => {

    const faqs = await Faq.find({});
    res.json({
        ok: true,
        faqs
    });
};

const getFaq = async(req, res = response) => {

    const faq = await Faq.findById(req.params.id);
    res.json({
        ok: true,
        faq
    });
};

const borrarFaq = async(req, res = response) => {

    const faq = await Faq.findByIdAndDelete(req.params.id);
    res.json({
        ok: true,
        msg: 'faq borrado'
    });
};

module.exports = {
    crearFaq,
    getFaqs,
    getFaq,
    borrarFaq
}