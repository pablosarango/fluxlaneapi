var express = require('express');
var router = express.Router();
var rutaController = require('../controllers/rutaController');
const auth = require('../middleware/auth');

router.get('/', auth.isUserAuth, rutaController.intervaloFechas);

router.get('/search', auth.isUserAuth, rutaController.search);

router.get('/lastItems', auth.isUserAuth, rutaController.getLastNItems);

router.get('/:id', auth.isUserAuth, rutaController.getCampo);

router.post('/', auth.isUserAuth, rutaController.add);

router.put('/:id', auth.isUserAuth, rutaController.update);

router.patch('/:id', auth.isUserAuth, rutaController.updateCampo);

router.delete('/:id', auth.isUserAuth, rutaController.remove);

module.exports = router;