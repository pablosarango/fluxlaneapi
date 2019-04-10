'use strict'

var express = require('express');
var router = express.Router();
// var cors = require('cors')
var usuarioController = require('../controllers/usuarioController');
var upload = require('../middleware/upload');
const auth = require('../middleware/auth');

router.get('/search', auth.isUserAuth,  usuarioController.search);

router.get('/all', auth.isUserAuth,  usuarioController.all);

router.get('/rol', auth.isUserAuth, usuarioController.getByRol);

router.get('/:id', auth.isUserAuth,  usuarioController.findById);

router.post('/', auth.isUserAuth,  usuarioController.create);
//router.post('/', usuarioController.create);

router.put('/:id', auth.isUserAuth,  usuarioController.update);

router.patch('/avatar/:id', auth.isUserAuth, upload.uploadImage,  usuarioController.updateCampo);

router.patch('/campo/:id', auth.isUserAuth,  usuarioController.updateCampo);

router.patch('/password/:id', auth.isUserAuth,  usuarioController.updatePassword);

// router.options('/login', cors());
router.patch('/login/admin', usuarioController.loginAdmin);

router.patch('/login/user', usuarioController.loginUser);

router.delete('/:id', auth.isUserAuth,  usuarioController.remove);

module.exports = router;