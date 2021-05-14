/*
Ruta : /api/asistentesTecnicos
*/

const { Router } = require('express');
const { getAsistentesTecnicos, actualizarAsistenteTecnico, getAsistenteTecnicoNombre, getAsistenteTecnico, actualizarContraseñaAsistente, getAsistentesBuscador } = require('../controllers/asistentesTecnicos');
const { check, validationResult } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../helpers/validar-jwt');

const router = Router()

router.get('/', getAsistentesTecnicos);

router.get('/nombre/:id', getAsistenteTecnicoNombre);

router.post('/buscador', validarJWT, getAsistentesBuscador);

router.get('/perfil', validarJWT, getAsistenteTecnico);

router.put('/:id', [validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('apellidos', 'El apellido es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos
    ],
    actualizarAsistenteTecnico);

router.put('/actualizar/contrasena', [validarJWT,
        check('password', 'La contraseña es obligatoria').not().isEmpty(),
        check('nuevaPassword', 'La nueva contraseña es obligatoria').not().isEmpty(),
        validarCampos
    ],
    actualizarContraseñaAsistente);

module.exports = router;