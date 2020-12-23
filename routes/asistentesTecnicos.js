/*
Ruta : /api/asistentesTecnicos
 */

const { Router } = require('express');
const { getAsistentesTecnicos, getAsistenteTecnico, actualizarAsistenteTecnico } = require('../controllers/asistentesTecnicos');
const { check, validationResult } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../helpers/validar-jwt');

const router = Router()

router.get('/', validarJWT, getAsistentesTecnicos);

router.get('/perfil', validarJWT, getAsistenteTecnico);

router.put('/:id', [validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos
    ],
    actualizarAsistenteTecnico);

/* router.delete('/:id',
    borrarAsistenteTecnico
); */


module.exports = router;