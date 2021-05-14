/*
Ruta : /api/compradores
 */

const { Router } = require('express');
const { crearComprador, getCompradores, actualizarComprador, getComprador, getCompradorEmail, getCompradorNombre, actualizarContraseñaComprador, borrarUsuario, getCompradoresBuscador } = require('../controllers/compradores');
const { check, validationResult } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../helpers/validar-jwt');

const router = Router()

router.get('/', validarJWT, getCompradores);

router.get('/email/:id', getCompradorEmail);

router.post('/buscador', validarJWT, getCompradoresBuscador);

router.get('/nombre/:id', getCompradorNombre);

router.get('/perfil', validarJWT, getComprador);

router.post('/', [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('apellidos', 'El apellido es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('fechaNacimiento', 'La fecha de nacimiento es obligatoria').not().isEmpty(),
        check('paisResidencia', 'El pais de residencia es obligatorio').not().isEmpty(),
        check('ciudad', 'La ciudad es obligatoria').not().isEmpty(),
        check('localidad', 'La localidad es obligatoria').not().isEmpty(),
        check('codigoPostal', 'El código postal es obligatorio').not().isEmpty(),
        check('direccionResidencia', 'La direccion de residenciaes obligatoria').not().isEmpty(),
        validarCampos
    ],
    crearComprador);
router.put('/:id', [validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('apellidos', 'El apellido es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('fechaNacimiento', 'La fecha de nacimiento es obligatoria').not().isEmpty(),
        check('paisResidencia', 'El pais de residencia es obligatorio').not().isEmpty(),
        check('ciudad', 'La ciudad es obligatoria').not().isEmpty(),
        check('localidad', 'La localidad es obligatoria').not().isEmpty(),
        check('codigoPostal', 'El código postal es obligatorio').not().isEmpty(),
        check('direccionResidencia', 'La direccion de residenciaes obligatoria').not().isEmpty(),
        validarCampos
    ],
    actualizarComprador);

router.put('/actualizar/contrasena', [validarJWT,
        check('password', 'La contraseña es obligatoria').not().isEmpty(),
        check('nuevaPassword', 'La nueva contraseña es obligatoria').not().isEmpty(),
        validarCampos
    ],
    actualizarContraseñaComprador);

router.delete('/:id', validarJWT, borrarUsuario);


module.exports = router;