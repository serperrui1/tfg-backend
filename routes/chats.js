/*
Ruta : /api/chats
 */

const { Router } = require('express');
const { crearChat, getMisChats, getChat, borrarChat, actualizarChat } = require('../controllers/chats');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../helpers/validar-jwt');

const router = Router();

router.get('/chat/:id', getChat);

router.get('/mis-chats', validarJWT, getMisChats);

router.post('/', check('mensajes', 'Para iniciar un chat debes dejar algún mensaje').not().isEmpty(), validarCampos, crearChat);

router.put('/:id', check('mensajes', 'No puedes borrar los mensajes de un chat iniciado').not().isEmpty(), validarCampos, actualizarChat);

router.delete('/:id', validarJWT, borrarChat);

module.exports = router;