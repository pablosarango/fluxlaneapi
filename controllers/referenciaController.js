var mongoose = require('mongoose');
var Referencia = require('../models/Referencia');

module.exports = {
    getCampo: function (req, res) {
        var id = mongoose.Types.ObjectId(req.params.id);
        var code = parseInt(req.query.code);
        Referencia.findById(id, function (err, response) {
            res.set('Content-Type', 'application/json');
            if (err) { // err != null
                console.log(err);
                return res.status(500).json({
                    message: 'Error en la búsqueda.'
                })
            } else if (isEmpty(response)) {
                return res.status(404).json({
                    message: 'No existe una referencia con ese ID'
                });
            } else {
                switch (code) {
                    case 5:
                        return res.status(200).json(response);
                    case 6:
                        return res.status(200).json(response.fecha_hora);
                    case 7:
                        return res.status(200).json(response.ruta_id);
                    case 8:
                        return res.status(200).json(response.coordenadas);
                    case 9:
                        return res.status(200).json(response.velocidad_promedio);
                    default:
                        return res.status(200).json({
                            message: 'Codigo no soportado'
                        });
                }
            }
        });
    },
    add: function (req, res) {
        var referencia = new Referencia(req.body);
        referencia.save(function (err, response) {
            res.set('Content-Type', 'application/json');
            res.location('referencia/' + response._id)
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: 'Error al guardar la ruta',
                    error: err
                })
            }
            return res.status(201).json({
                message: 'Guardado',
                _id: response._id
            })
        })
    },
    update: function (req, res) {
        var id = mongoose.Types.ObjectId(req.params.id);
        Referencia.findByIdAndUpdate(id, req.body, { new: true }, function (err, response) {
            res.set('Content-Type', 'application/json');
            if (err) { // err != null
                console.log(err);
                return res.status(500).json({
                    message: 'Error en la actualización.'
                })
            } else if (isEmpty(response)) {
                return res.status(404).json({
                    message: 'No existe la ruta.'
                });
            } else {
                return res.json(response);
            }
        });
    },
    remove: function (req, res) {
        var id = mongoose.Types.ObjectId(req.params.id);
        Referencia.findByIdAndRemove(id, function (err, response) {
            res.set('Content-Type', 'application/json');
            if (err) { // err != null
                console.log(err);
                return res.status(500).json({
                    message: 'Error al borrar.'
                })
            } else if (isEmpty(response)) {
                return res.status(404).json({
                    message: 'No existe la referencia'
                });
            } else {
                return res.json({
                    message: 'Referencia eliminada satisfactoriamente'
                });
            }
        });
    }
}

function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}