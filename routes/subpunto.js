var express = require('express');
var router = express.Router();
var subpuntoController = require('../controllers/subpuntoController');
const auth = require('../middleware/auth');

router.get('/idsAll', auth.isUserAuth, subpuntoController.getByRutaId_All);

router.get('/idsId', auth.isUserAuth, subpuntoController.getByRutaId_Id);

router.get('/:id', auth.isUserAuth, subpuntoController.getCampo);

router.post('/', auth.isUserAuth, subpuntoController.add);

router.post('/subpuntos', auth.isUserAuth, subpuntoController.multipleAdd);

router.put('/:id', auth.isUserAuth, subpuntoController.update);

router.delete('/:id', auth.isUserAuth, subpuntoController.remove);

module.exports = router;