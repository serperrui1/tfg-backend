/*
    Path:'api/login'
 */
const { Router } = require('express');
const { check } = require('express-validator');
const { loginComprador, loginProveedor } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');



const router = Router();

router.post('/comprador', [
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos

], loginComprador);

router.post('/proveedor', [
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos

], loginProveedor);




module.exports = router;