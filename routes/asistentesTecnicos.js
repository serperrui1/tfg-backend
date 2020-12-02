/*
Ruta : /api/asistentesTecnicos
 */

const { Router } = require('express');
const { getAsistentesTecnicos, actualizarAsistenteTecnico, borrarAsistenteTecnico } = require('../controllers/asistentesTecnicos');
const { check, validationResult } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../helpers/validar-jwt');

const router = Router()

router.get('/', validarJWT, getAsistentesTecnicos);

router.put('/:id', [validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos
    ],
    actualizarAsistenteTecnico);

router.delete('/:id',
    borrarAsistenteTecnico
);


module.exports = router;