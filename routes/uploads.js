/*

    ruta: api/uploads/
*/
const { Router } = require('express');
const expressFileUpload = require('express-fileupload');


const { validarJWT } = require('../helpers/validar-jwt');
const { fileUpload, fileCreate, retornaImagen } = require('../controllers/uploads');

const router = Router();

router.use(expressFileUpload());

router.put('/:tipo/:id', validarJWT, fileUpload);

router.post('/producto/:id', validarJWT, fileCreate);

router.get('/:tipo/:foto', retornaImagen);



module.exports = router;