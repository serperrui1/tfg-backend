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

        comprador.img = "";

        //Guardar usuario
        await comprador.save();

        //Generar el token

        // const token = await generarJWT(comprador.id);

        res.json({
            ok: true,
            comprador
            //  token
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado ... revisa logs'
        });
    }

}

const getCompradores = async(req, res = response) => {

    const compradores = await Comprador.find({}, 'nombre email ');
    res.json({
        ok: true,
        compradores
    });
}

const getCompradorNombre = async(req, res = response) => {
    const comprador = await Comprador.findById(req.params.id);
    res.json({
        ok: true,
        nombre: comprador.nombre
    });
};

const getComprador = async(req, res = response) => {

    const compradores = await Comprador.findById(req.uid);
    res.json({
        ok: true,
        compradores
    });
}

const getCompradorEmail = async(req, res = response) => {

    const comprador = await Comprador.findOne(req.body.email);
    res.json({
        ok: true,
        email: comprador.email
    });
};

const actualizarComprador = async(req, res = response) => {

    // TODO: Validar token y comprobar si el usuario es correcto

    const uid = req.params.id;

    try {

        const compradorDB = await Comprador.findById(uid);

        if (!compradorDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un comprador con ese id'
            })
        }

        // Actualizaciones
        const { password, google, ...campos } = req.body;

        if (compradorDB.email === req.body.email) {
            delete campos.email;
        } else {
            const existeEmail = await Comprador.findOne({ email: req.body.email })
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un comprador con ese email'
                })
            }
        }

        const compradorActualizado = await Comprador.findByIdAndUpdate(uid, campos, { new: true })

        res.json({
            ok: true,
            comprador: compradorActualizado
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })

    }
}


module.exports = {

    crearComprador,
    getCompradores,
    getCompradorNombre,
    actualizarComprador,
    getComprador,
    getCompradorEmail

}