/*
Ruta : /api/productos
 */

const { Router } = require('express');
const { crearProducto, getProductos, getMisProductos, getProducto, borrarProducto, actualizarProducto, getProductosBuscador, getMisProductosBuscador, getProductosPorProveedorId, crearValoracion, borrarValoracion, soyElProveedor, getProductosCategoria } = require('../controllers/productos');
const { check, validationResult } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../helpers/validar-jwt');
const { validarProveedor } = require('../helpers/validar-proveedor');

const router = Router();

router.get('/', getProductos);

router.post('/buscador', getProductosBuscador);

router.post('/buscador-mios', validarJWT, getMisProductosBuscador);

router.get('/productos-de/:id', getProductosPorProveedorId);

router.get('/producto/:id', getProducto);

router.get('/mis-productos', validarJWT, getMisProductos);

router.post('/', [validarProveedor,
        check('titulo', 'El título es obligatorio').not().isEmpty(),
        check('descripcion', 'La descripción es obligatoria').not().isEmpty(),
        // check('imagenes', 'La imagen es obligatoria').not().isEmpty(),
        // check('datosTecnicos', 'Los datos técnicos son obligatorios').not().isEmpty(),
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
        //check('imagenes', 'La imagen es obligatoria').not().isEmpty(),
        //check('datosTecnicos', 'Los datos técnicos son obligatorios').not().isEmpty(),
        check('categoria', 'La categoría es obligatoria').not().isEmpty(),
        check('precio', 'El precio es obligatorio').not().isEmpty(),
        check('unidadesMinimas', 'Las unidades mínimas son obligatorias').not().isEmpty(),
        check('stock', 'El stock es obligatorio').not().isEmpty(),
        validarCampos
    ],
    actualizarProducto);

router.delete('/:id', validarJWT, validarProveedor,
    borrarProducto);



router.put('/valoracion/:id', [
        check('comentario', 'El comentario es obligatorio').not().isEmpty(),
        check('puntuacion', 'La puntuacion es obligatoria').not().isEmpty(),
        validarCampos
    ],
    crearValoracion);


router.put('/borrar-valoracion/:id', [
        check('index', 'El index es obligatorio').not().isEmpty(),
        borrarValoracion
    ],
    crearValoracion);


router.post('/soyElProveedor', [validarProveedor,
        check('id', 'El id del producato es obligatorio').not().isEmpty(),
        validarCampos
    ],
    soyElProveedor);

router.get('/productosCategoria/:categoria', getProductosCategoria);

module.exports = router;