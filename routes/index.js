var express = require('express');
var router = express.Router();
var usuarios = require('./usuarios');
var cliente = require('./cliente');
var ruta = require('./ruta');
var referencia = require('./referencia');
var subpunto = require('./subpunto');


/* GET home page. 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'FLYCAR' });
});
*/


router.use('/usuario', usuarios);
router.use('/cliente', cliente);
router.use('/ruta', ruta);
router.use('/referencia', referencia);
router.use('/subpunto', subpunto);

router.get('/', function (req, res) {
  res.status(200).json({ 
    author: "Pablo Sarango",
    email: "pablosarangouchuari@gmail.com",
    description: "Proyecto Final de Carrera",
    message: 'Bienvenido a FLYCAR. ENJOY!!! :)' })
})

module.exports = router;
