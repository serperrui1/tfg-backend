/*
    Path:'api/login'
 */
const { Router } = require('express');
const { check } = require('express-validator');
const { loginComprador, loginProveedor, googleSignIn, renewToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');



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

router.post('/google', [
    check('token', 'El token de google es obligatorio').not().isEmpty(),
    validarCampos

], googleSignIn);

router.get('/renew', validarJWT, renewToken);



module.exports = router;