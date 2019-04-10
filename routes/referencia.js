var express = require('express');
var router = express.Router();
var referenciaController = require('../controllers/referenciaController');
const auth = require('../middleware/auth');

router.get('/:id', auth.isUserAuth,referenciaController.getCampo);

router.post('/', auth.isUserAuth, referenciaController.add);

router.put('/:id', auth.isUserAuth, referenciaController.update);

router.delete('/:id', auth.isUserAuth, referenciaController.remove);

module.exports = router;