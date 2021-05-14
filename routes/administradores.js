/*
Ruta : /api/administradores
 */

const { Router } = require('express');
const { getAdministradores, actualizarAdministrador, actualizarContraseñaAdministrador, getAdministrador, crearAsistenteTecnico, borrarAsistenteTecnico, borrarComprador, borrarProveedor } = require('../controllers/administradores');
const { check, validationResult } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../helpers/validar-jwt');

const router = Router()

router.get('/', validarJWT, getAdministradores);

router.get('/perfil', validarJWT, getAdministrador);

router.post('/', [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('apellidos', 'El apellido es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos
    ],
    crearAsistenteTecnico);

router.put('/:id', [validarJWT,
        check('nombre', 'El nombre del administrador es obligatorio').not().isEmpty(),
        check('apellidos', 'El nombre del administrador es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos
    ],
    actualizarAdministrador);

router.put('/actualizar/contrasena', [validarJWT,
        check('password', 'La contraseña es obligatoria').not().isEmpty(),
        check('nuevaPassword', 'La nueva contraseña es obligatoria').not().isEmpty(),
        validarCampos
    ],
    actualizarContraseñaAdministrador);

router.delete('/eliminar/asistente/:id', validarJWT, borrarAsistenteTecnico);

router.delete('/eliminar/proveedor/:id', validarJWT, borrarProveedor);

router.delete('/eliminar/comprador/:id', validarJWT, borrarComprador);

module.exports = router;