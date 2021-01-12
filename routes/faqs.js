/*
Ruta : /api/faqs
 */

const { Router } = require('express');
const { crearFaq, getFaqs, getFaq, borrarFaq } = require('../controllers/faqs');
const { check, validationResult } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../helpers/validar-jwt');
const { validarPermisosFaq } = require('../helpers/permisos-faq');

const router = Router();

router.get('/', getFaqs);

router.get('/:id', getFaq);

router.post('/', [validarPermisosFaq,
        check('pregunta', 'La pregunta es obligatoria').not().isEmpty(),
        check('respuesta', 'Una respuesta es obligatoria').not().isEmpty(),
        check('tematica', 'Una temática es obligatoria').not().isEmpty(),
        validarCampos
    ],
    crearFaq);

router.delete('/:id', validarJWT, validarPermisosFaq,
    borrarFaq);

module.exports = router;