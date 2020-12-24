/*
Ruta : /api/administradores
 */

const { Router } = require('express');
const { getAdministradores, getAdministrador, actualizarAdministrador } = require('../controllers/administradores');
const { check, validationResult } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../helpers/validar-jwt');

const router = Router()

router.get('/', validarJWT, getAdministradores);

router.get('/perfil', validarJWT, getAdministrador);

router.put('/:id', [validarJWT,
        check('nombre', 'El nombre del administrador es obligatorio').not().isEmpty(),
        check('apellidos', 'Los apellidos son obligatorios').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos
    ],
    actualizarAdministrador);

// router.delete('/:id',
//     borrarUsuario);


module.exports = router;