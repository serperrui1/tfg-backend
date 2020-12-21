/*
Ruta : /api/compradores
 */

const { Router } = require('express');
const { crearProveedor, getProveedores, actualizarProveedor, getProveedor } = require('../controllers/proveedores');
const { check, validationResult } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../helpers/validar-jwt');

const router = Router()

router.get('/', validarJWT, getProveedores);

router.get('/perfil', validarJWT, getProveedor);

router.post('/', [
        check('nombreEmpresa', 'El nombre de la empresa es obligatorio').not().isEmpty(),
        check('autonomo', 'El autonomo TRUE/FALSE es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('sector', 'Al menos un sector es obligatorio').not().isEmpty(),
        check('direccion', 'La direccion es obligatoria').not().isEmpty(),
        check('cuentaBancariaIBAN', 'La cuenta bancaria es obligatoria').not().isEmpty(),
        check('titularCuenta', 'El titular de la cuenta es obligatorio').not().isEmpty(),
        validarCampos
    ],
    crearProveedor);
router.put('/:id', [validarJWT,
        check('nombreEmpresa', 'El nombre de la empresa es obligatorio').not().isEmpty(),
        check('autonomo', 'El autonomo TRUE/FALSE es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('sector', 'Al menos un sector es obligatorio').not().isEmpty(),
        check('direccion', 'La direccion es obligatoria').not().isEmpty(),
        check('cuentaBancariaIBAN', 'La cuenta bancaria es obligatoria').not().isEmpty(),
        check('titularCuenta', 'El titular de la cuenta es obligatorio').not().isEmpty(),
        validarCampos
    ],
    actualizarProveedor);

// router.delete('/:id',
//     borrarUsuario);


module.exports = router;