var mongoose = require('mongoose');
var Subpunto = require('../models/Subpunto');

module.exports = {
    getCampo: function (req, res) {
        var id = mongoose.Types.ObjectId(req.params.id);
        var code = parseInt(req.query.code);
        Subpunto.findById(id, function (err, response) {
            res.set('Content-Type', 'application/json');
            if (err) { // err != null
                console.log(err);
                return res.status(500).json({
                    message: 'Error en la búsqueda.'
                })
            } else if (isEmpty(response)) {
                return res.status(404).json({
                    message: 'No existe un SUBPUNTO con ese ID'
                });
            } else {
                switch (code) {
                    case 5:
                        return res.status(200).json(response);
                    case 6:
                        return res.status(200).json(response.coordenadas);
                    case 7:
                        return res.status(200).json(response.fecha_hora);
                    case 8:
                        return res.status(200).json(response.ruta_id);
                    case 9:
                        return res.status(200).json(response.velocidad);
                    default:
                        return res.status(200).json({
                            message: 'Codigo no soportado'
                        });
                }
            }
        });
    },
    getByRutaId_All: function(req, res) {
        var rutaId = req.query.rutaId;
        res.set('Content-Type', 'application/json');
        Subpunto.find({
            $text: {
                $search: rutaId
            }
        }, function (err, subpuntos) {
            if (err) { // err != null
                console.log(err);
                return res.status(500).json({
                    message: 'Error en la búsqueda.'
                })
            } else if (isEmpty(subpuntos)) {
                return res.status(404).json({
                    message: 'Subpuntos no encontrados'
                });
            } else {
                return res.status(200).json(subpuntos);
            }
        });
    },
    getByRutaId_Id: function(req, res) {
        var rutaId = req.query.rutaId;
        res.set('Content-Type', 'application/json');
        Subpunto.find({
            $text: {
                $search: rutaId
            }
        }, {
            _id: 1
        }, function (err, subpuntos) {
            if (err) { // err != null
                console.log(err);
                return res.status(500).json({
                    message: 'Error en la búsqueda.'
                })
            } else if (isEmpty(subpuntos)) {
                return res.status(404).json({
                    message: 'Subpuntos no encontrados'
                });
            } else {
                var respuesta = [];
                subpuntos.forEach(element => {
                    respuesta.push(element._id);
                });
                return res.status(200).json(respuesta);
            }
        });
    },
    add: function (req, res) {
        var subpunto = new Subpunto(req.body);
        subpunto.save(function (err, response) {
            res.set('Content-Type', 'application/json');
            res.location('subpunto/' + response._id)
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: 'Error al guardar el subpunto',
                    error: err
                })
            }
            return res.status(201).json({
                message: 'Guardado',
                _id: response._id
            })
        })
    },
    multipleAdd: function (req, res) {
        var subpuntos = req.body;
        var subpunto;
        var id;
        res.set('Content-Type', 'application/json');
        subpuntos.forEach(element => {
            id = element.ruta_id;
            subpunto = new Subpunto(element);
            subpunto.save(function (err, response) {
                if (err) {
                    console.log(err);
                    return err;
                }
            })
        });
        return res.status(202).json({
            message: 'Aceptada. Tarea en proceso.',
            ruta_id: id
        })
    },
    update: function (req, res) {
        var id = mongoose.Types.ObjectId(req.params.id);
        Subpunto.findByIdAndUpdate(id, req.body, {
            new: true
        }, function (err, response) {
            res.set('Content-Type', 'application/json');
            if (err) { // err != null
                console.log(err);
                return res.status(500).json({
                    message: 'Error en la actualización.'
                })
            } else if (isEmpty(response)) {
                return res.status(404).json({
                    message: 'No existe el subpunto.'
                });
            } else {
                return res.json(response);
            }
        });
    },
    remove: function (req, res) {
        var id = mongoose.Types.ObjectId(req.params.id);
        Subpunto.findByIdAndRemove(id, function (err, response) {
            res.set('Content-Type', 'application/json');
            if (err) { // err != null
                console.log(err);
                return res.status(500).json({
                    message: 'Error al borrar.'
                })
            } else if (isEmpty(response)) {
                return res.status(404).json({
                    message: 'No existe el subpunto'
                });
            } else {
                return res.json({
                    message: 'Subpunto eliminado satisfactoriamente'
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