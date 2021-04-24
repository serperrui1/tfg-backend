const { response } = require('express')
const bcrypt = require('bcrypt')

const Comprador = require('../models/comprador');
const { generarJWT } = require('../helpers/jwt');

const crearComprador = async(req, res) => {

    const { email, password } = req.body;


    try {
        const existeEmail = await Comprador.findOne({ email });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }

        const comprador = new Comprador(req.body);

        // Encriptar contraseña 
        const salt = bcrypt.genSaltSync();
        comprador.password = bcrypt.hashSync(password, salt);


        //Guardar usuario
        await comprador.save();

        //Generar el tocken

        //const token = await generarJWT(comprador.id);

        res.json({
            ok: true,
            comprador,
            //token
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado ... revisa logs'
        });
    }


    await comprador.save();
    res.json({
        ok: true,
        comprador

    });
}

module.exports = {
    crearComprador,
    getCompradores,
    getCompradorNombre,
    actualizarComprador,
    getComprador,
    getCompradorEmail,
    actualizarContraseñaComprador

}