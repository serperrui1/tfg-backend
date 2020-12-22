/*
Ruta : /api/compradores
 */

const { Router } = require('express');
const { crearProducto, getProductos, getMisProductos, getProducto, borrarProducto, actualizarProducto } = require('../controllers/productos');
const { check, validationResult } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../helpers/validar-jwt');
const { validarProveedor } = require('../helpers/validar-proveedor');

const router = Router();

router.get('/', getProductos);

router.get('/producto/:id', getProducto);

router.get('/misproductos', validarJWT, getMisProductos);

router.post('/', [validarProveedor,
        check('titulo', 'El título es obligatorio').not().isEmpty(),
        check('descripcion', 'La descripción es obligatoria').not().isEmpty(),
        check('imagenes', 'La imagen es obligatoria').not().isEmpty(),
        check('datosTecnicos', 'Los datos técnicos son obligatorios').not().isEmpty(),
        check('categoria', 'La categoría es obligatoria').not().isEmpty(),
        check('precio', 'El precio es obligatorio').not().isEmpty(),
        check('unidadesMinimas', 'Las unidades mínimas son obligatorias').not().isEmpty(),
        check('stock', 'El stock es obligatorio').not().isEmpty(),
        validarCampos
    ],
    crearProducto);

router.put('/:id', [validarProveedor,
        check('titulo', 'El título es obligatorio').not().isEmpty(),
        check('descripcion', 'La descripción es obligatoria').not().isEmpty(),
        check('imagenes', 'La imagen es obligatoria').not().isEmpty(),
        check('datosTecnicos', 'Los datos técnicos son obligatorios').not().isEmpty(),
        check('categoria', 'La categoría es obligatoria').not().isEmpty(),
        check('precio', 'El precio es obligatorio').not().isEmpty(),
        check('unidadesMinimas', 'Las unidades mínimas son obligatorias').not().isEmpty(),
        check('stock', 'El stock es obligatorio').not().isEmpty(),
        validarCampos
    ],
    actualizarProducto);

router.delete('/:id', validarJWT, validarProveedor,
    borrarProducto);

module.exports = router;