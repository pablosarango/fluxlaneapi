'use strict'

var express = require('express');
var router = express.Router();
const clienteController = require('../controllers/clienteController');
const rutaController = require('../controllers/rutaController');
// const referenciaController = require('../controllers/referenciaController');
const subpuntoController = require('../controllers/subpuntoController');
const access = require('../middleware/access');
const auth = require('../middleware/auth');

//Rutas para gestión del CLIENTE
router.get('/', clienteController.info);

router.get('/token/:email', clienteController.getNewToken);

router.get('/:email', auth.isClientAuth, clienteController.getByEmail);

router.post('/', clienteController.create);

//Rutas para consultar "rutas"
router.get('/ruta/fecha', auth.isClientAuth, rutaController.intervaloFechas);

router.get('/ruta/:id', auth.isClientAuth, access, rutaController.getCampo);

// Rutas para consultar "referencias"
// router.get('/referencia/:id', auth.isClientAuth, access, referenciaController.getCampo);

//Rutas para consultar "subpuntos"
router.get('/subpunto/:id', auth.isClientAuth, access, subpuntoController.getCampo);

module.exports = router;