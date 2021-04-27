const { response } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Chat = require('../models/chat');
const Proveedor = require('../models/proveedor');
const Comprador = require('../models/comprador');
const { generarJWT } = require('../helpers/jwt');


const crearChat = async(req, res) => {
    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);

    const año = new Date().getFullYear();
    año.toString();
    const mes = new Date().getMonth() + 1;
    mes.toString();
    const dia = new Date().getDate();
    dia.toString();

    try {
        if (await Comprador.findById(uid) != null) {

            const chat = new Chat(req.body);

            chat.compradorId = uid;

            if (!req.body.fechaPublicacion) {
                chat.fechaPublicacion = año + "-" + mes + "-" + dia;
            }

            if (!req.body.proveedorId) {
                res.json({
                    ok: false,
                    msg: 'Controller: proveedorId no debe estar vacío.'
                });
            }

            if (!req.body.productoId) {
                res.json({
                    ok: false,
                    msg: 'Controller: productoId no debe estar vacío.'
                });
            }

            if (!req.body.proveedorNombre) {
                res.json({
                    ok: false,
                    msg: 'Controller: Nombre del proveedor es necesario.'
                });
            }

            chat.ultimoEmisor = uid;
            chat.leido = false;

            //Guardar incidencia
            await chat.save();

            res.json({
                ok: true,
                chat
                //  token
            });
        } else {
            res.json({
                ok: false,
                msg: 'Controller: Sólo los compradores pueden crear un chat.'
            });
        }

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Controller: Error inesperado ... revisa logs'
        });
    }

};


const getMisChats = async(req, res = response) => {
    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    const misChatsComprador = await Chat.find({ compradorId: uid }); //si no es null, el que accede es su comprador
    const misChatsProveedor = await Chat.find({ proveedorId: uid }); //si no es null, el que accede es su proveedor

    if (misChatsComprador.length != 0) {
        res.json({
            ok: true,
            chats: misChatsComprador
        });
    } else if (misChatsProveedor.length != 0) {
        res.json({
            ok: true,
            chats: misChatsProveedor
        });
    } else {
        res.json({
            ok: false,
            msg: 'Controller: No tienes chats.'
        });
    }

};

const getChat = async(req, res = response) => {
    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    const proveedor = await Proveedor.findById(uid);
    const chat = await Chat.findById(req.params.id);

    if (proveedor != null || chat.compradorId === uid) {
        res.json({
            ok: true,
            chat
        });
    } else {
        res.json({
            ok: false,
            msg: 'Controller: No eres el proveedor ni el comprador de este chat.'
        });
    }
};


const actualizarChat = async(req, res = response) => {
    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    try {
        const chat = await Chat.findById(req.params.id);
        const { proveedorId, compradorId, ...campos } = req.body;
        if (!chat) {
            return res.status(404).json({
                ok: false,
                msg: 'Controller: No puedes actualizar un chat inexistente.'
            });
        } else {
            // soy el comprador o el proveedor del chat
            if (chat.proveedorId === uid || chat.compradorId === uid) {
                chat.ultimoEmisor = uid;
                chat.leido = false;
                chat.mensajes.push(campos.mensajes);
                const chatActualizado = await Chat.findByIdAndUpdate(req.params.id, chat, { new: true });
                res.json({
                    ok: true,
                    chat: chatActualizado
                });
            } else {
                return res.status(400).json({
                    ok: false,
                    msg: 'Controller: Debes ser el comprador o proveedor de este chat.'
                });
            }
        }
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Controller: Error inesperado'
        });
    }
};

const chatLeido = async(req, res = response) => {
    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    try {
        const chat = await Chat.findById(req.params.id);
        if (!chat) {
            return res.status(404).json({
                ok: false,
                msg: 'Controller: No puedes actualizar un chat inexistente.'
            });
        } else {
            // soy el comprador o el proveedor del chat
            if (chat.ultimoEmisor != uid) {
                chat.leido = true;
                const chatActualizado = await Chat.findByIdAndUpdate(req.params.id, chat, { new: true });
                res.json({
                    ok: true,
                    chat: chatActualizado
                });
            } else if (chat.ultimoEmisor === uid) {
                res.json({
                    ok: true,
                    chat: chat
                });
            } else {
                return res.status(400).json({
                    ok: false,
                    msg: 'Controller: Debes ser el comprador o proveedor de este chat.'
                });
            }
        }
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Controller: Error inesperado'
        });
    }
}

const borrarChat = async(req, res = response) => {
    const chat = await Chat.findByIdAndDelete(req.params.id);
    res.json({
        ok: true,
        msg: 'Controller: Chat borrado'
    });
};

const existeChat = async(req, res = response) => {
    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    const chat = await Chat.find({ compradorId: uid, proveedorId: req.body.proveedorId });
    if (chat) {
        res.json({
            ok: true,
            chatId: chat[0]._id
        });
    } else {
        res.json({
            ok: false,
            msg: 'No existe chat'
        });
    }
};


module.exports = {

    crearChat,
    chatLeido,
    getMisChats,
    getChat,
    actualizarChat,
    borrarChat,
    existeChat

}