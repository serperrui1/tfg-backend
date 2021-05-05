const { response } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Proveedor = require('../models/proveedor');
const { generarJWT } = require('../helpers/jwt');

const crearProveedor = async(req, res) => {

    const { email, password } = req.body;


    try {
        const existeEmail = await Proveedor.findOne({ email });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un proveedor con ese email'
            });
        }

        const proveedor = new Proveedor(req.body);

        // Encriptar contraseña 
        const salt = bcrypt.genSaltSync();
        proveedor.password = bcrypt.hashSync(password, salt);

        proveedor.img = "";
        proveedor.fechaRegistro = new Date;

        //Guardar usuario
        await proveedor.save();

        //Generar el tocken

        const token = await generarJWT(proveedor.id);

        res.json({
            ok: true,
            proveedor,
            token
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado ... revisa logs'
        });
    }


    /* await proveedor.save();

    res.json({
        ok: true,
        proveedor

    }); */
};

const getProveedores = async(req, res = response) => {

    const proveedores = await Proveedor.find({});
    res.json({
        ok: true,
        proveedores
    });
};


const getProveedor = async(req, res = response) => {

    const proveedor = await Proveedor.findById(req.uid);
    res.json({
        ok: true,
        proveedor
    });
};

const getProveedorPorId = async(req, res = response) => {

    const proveedor = await Proveedor.findById(req.params.id);
    res.json({
        ok: true,
        proveedor
    });
};

const getProveedorNombre = async(req, res = response) => {
    try {
        const proveedor = await Proveedor.findById(req.params.id);
        if (proveedor) {
            res.json({
                ok: true,
                nombreEmpresa: proveedor.nombreEmpresa
            });
        } else {
            if (!proveedor) {
                res.json({
                    ok: true,
                    nombre: ""
                });
            }
        }

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })

    }
};

const actualizarProveedor = async(req, res = response) => {

    // TODO: Validar token y comprobar si el usuario es correcto

    const uid = req.params.id;

    try {

        const proveedorDB = await Proveedor.findById(uid);

        if (!proveedorDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un proveedor con ese id'
            });
        }

        // Actualizaciones
        const { password, google, ...campos } = req.body;

        if (proveedorDB.email === req.body.email) {
            delete campos.email;
        } else {
            const existeEmail = await Proveedor.findOne({ email: req.body.email })
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un proveedor con ese email'
                });
            }
        }

        const proveedorActualizado = await Proveedor.findByIdAndUpdate(uid, campos, { new: true });

        res.json({
            ok: true,
            proveedor: proveedorActualizado
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });

    }
};


const actualizarContraseñaProveedor = async(req, res = response) => {

    // TODO: Validar token y comprobar si el usuario es correcto

    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);

    try {

        const proveedorDB = await Proveedor.findById(uid);
        if (!proveedorDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un proveedor con ese id'
            })
        } else {
            // Actualizaciones
            const { password, nuevaPassword } = req.body;
            const validPassword = bcrypt.compareSync(password, proveedorDB.password);

            if (!validPassword) {
                return res.status(400).json({
                    ok: false,
                    msg: 'La contraseña actual introducida es incorrecta.'
                })
            } else {
                const salt = bcrypt.genSaltSync();
                proveedorDB.password = bcrypt.hashSync(nuevaPassword, salt);

                const proveedorActualizado = await Proveedor.findByIdAndUpdate(uid, proveedorDB, { new: true })

                res.json({
                    ok: true,
                    proveedor: proveedorActualizado
                })

            }

        }


    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })

    }
}




module.exports = {

    crearProveedor,
    getProveedores,
    actualizarProveedor,
    getProveedor,
    getProveedorNombre,
    getProveedorPorId,
    actualizarContraseñaProveedor

};