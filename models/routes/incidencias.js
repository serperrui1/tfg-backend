/*
Ruta : /api/incidencias
 */

const { Router } = require('express');
const { crearIncidencia, getIncidencias, getMisIncidencias, getIncidencia, borrarIncidencia, actualizarIncidencia } = require('../controllers/incidencias');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../helpers/validar-jwt');
const { modificarIncidencia, publicarIncidencia, eliminarIncidencia, accesoIncidencias, accesoMisIncidencias, accesoIncidencia } = require('../helpers/permisos-incidencia');

const router = Router();

router.get('/', accesoIncidencias, getIncidencias);

router.get('/incidencia/:id', getIncidencia);

router.get('/mis-incidencias', validarJWT, getMisIncidencias);

router.post('/', [publicarIncidencia,
        check('titulo', 'El título es obligatorio').not().isEmpty(),
        check('descripcion', 'La descripción es obligatoria').not().isEmpty(),
        check('tematica', 'La temática es obligatoria').not().isEmpty(),
        validarCampos
    ],
    crearIncidencia);

router.put('/:id', [modificarIncidencia,
        check('titulo', 'El título es obligatorio').not().isEmpty(),
        check('descripcion', 'La descripción es obligatoria').not().isEmpty(),
        check('tematica', 'La temática es obligatoria').not().isEmpty(),
        validarCampos
    ],
    actualizarIncidencia);

router.delete('/:id', validarJWT, eliminarIncidencia,
    borrarIncidencia);

module.exports = router;