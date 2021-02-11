/*
Ruta : /api/spam
 */

const { Router } = require('express');
const { getSpam, actualizarSpam } = require('../controllers/spam');

const router = Router();

router.get('/', getSpam);
router.put('/', actualizarSpam);

module.exports = router;