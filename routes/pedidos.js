/*
Ruta : /api/pedidos
 */

const { Router } = require('express');
const { crearPedido, getMisPedidos, getPedido, getPedidosBuscador, getPedidos, getMisPedidosProveedor, actualizarEnvio } = require('../controllers/pedidos');
const { check, validationResult } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarComprador } = require('../helpers/validar-proveedor');
const { validarJWT } = require('../helpers/validar-jwt');

const router = Router();


router.get('/pedido/:id', getPedido);

router.get('/mis-pedidos', validarJWT, getMisPedidos);

router.get('/mis-pedidos-proveedor', validarJWT, getMisPedidosProveedor);

router.get('/todos', validarJWT, getPedidos);

router.post('/buscador', validarJWT, getPedidosBuscador);

router.post('/', [validarComprador,
        check('precio', 'El precio es obligatorio').not().isEmpty(),
        check('unidades', 'Las unidades son obligatorias').not().isEmpty(),
        check('direccionEnvio', 'La direccion de envio es obligatoria').not().isEmpty(),
        check('codigoPostal', 'El codigo postal es obligatorio').not().isEmpty(),
        check('numeroTelefono', 'El numero de telefono es obligatorio').not().isEmpty(),
        check('nombreComprador', 'El nombre del comprador es obligatorio').not().isEmpty(),
        validarCampos
    ],
    crearPedido);

router.put('/envio/:id', validarJWT, actualizarEnvio);

module.exports = router;