/*
Ruta : /api/chats
 */

const { Router } = require('express');
const { crearChat, getMisChats, getChat, borrarChat, actualizarChat, getChatsBuscador, chatLeido, existeChat } = require('../controllers/chats');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../helpers/validar-jwt');

const router = Router();

router.get('/chat/:id', getChat);

router.get('/mis-chats', validarJWT, getMisChats);

router.post('/buscador', validarJWT, getChatsBuscador);

router.post('/', check('mensajes', 'Para iniciar un chat debes dejar algún mensaje').not().isEmpty(), validarCampos, crearChat);

router.put('/actualizar/:id', check('mensajes', 'No puedes borrar los mensajes de un chat iniciado').not().isEmpty(), validarCampos, actualizarChat);

router.put('/leido/:id', chatLeido);

router.delete('/:id', validarJWT, borrarChat);

router.post('/existe-chat', validarCampos, existeChat);

module.exports = router;