/*
Ruta : /api/compradores
 */

const { Router } = require('express');
const { crearComprador, getCompradores, actualizarComprador } = require('../controllers/compradores');
const { check, validationResult } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../helpers/validar-jwt');

const router = Router()

router.get('/', validarJWT, getCompradores);

router.post('/', [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('apellidos', 'El apellido es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('fechaNacimiento', 'La fecha de nacimiento es obligatoria').not().isEmpty(),
        check('nacionalidad', 'La nacionalidad es obligatoria').not().isEmpty(),
        check('paisResidencia', 'El pais de residencia es obligatorio').not().isEmpty(),
        check('ciudad', 'La ciudad es obligatoria').not().isEmpty(),
        check('localidad', 'La localidad es obligatoria').not().isEmpty(),
        check('direccionResidencia', 'La direccion de residenciaes obligatoria').not().isEmpty(),
        validarCampos
    ],
    crearComprador);
router.put('/:id', [validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('apellidos', 'El apellido es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('fechaNacimiento', 'La fecha de nacimiento es obligatoria').not().isEmpty(),
        check('nacionalidad', 'La nacionalidad es obligatoria').not().isEmpty(),
        check('paisResidencia', 'El pais de residencia es obligatorio').not().isEmpty(),
        check('ciudad', 'La ciudad es obligatoria').not().isEmpty(),
        check('localidad', 'La localidad es obligatoria').not().isEmpty(),
        check('direccionResidencia', 'La direccion de residenciaes obligatoria').not().isEmpty(),
        validarCampos
    ],
    actualizarComprador);

// router.delete('/:id',
//     borrarUsuario);


module.exports = router;