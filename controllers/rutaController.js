var mongoose = require('mongoose');
var Ruta = require('../models/Ruta');

module.exports = {
    intervaloFechas: function (req, res) {
        var fin = req.query.fin;
        var inicio = req.query.inicio;
        if (isEmpty(fin) == false && isEmpty(inicio) == false) {
            //.find( {"fecha_hora.creacion": { $lte: ISODate("2018-08-03T05:00:00Z"), $gte: ISODate("2018-06-03T05:00:00Z") } } )
            Ruta.find({ 'fecha_hora.creacion': { $lte: new Date(fin), $gte: new Date(inicio) } }, function (err, response) {
                res.set('Content-Type', 'application/json');
                if (err) { // err != null
                    console.log(err);
                    return res.status(500).json({
                        message: 'Error en la búsqueda.'
                    })
                } else if (isEmpty(response)) {
                    return res.status(404).json({
                        message: 'No existen rutas en ese intervalo de fechas'
                    });
                } else {
                    return res.status(200).json(response);
                }
            });
        } else {
            return res.status(400).json({
                message: 'Intervalo de fechas inválido'
            });
        }
    },
    search: function (req, res) {
        //La sintaxis en la petición debe ser valor=string
        var valor = req.query.valor;
        res.set('Content-Type', 'application/json');
        Ruta.find({
            $text: {
                $search: valor
            }
        }, {
            _id: 1,
            nombre: 1,
            descripcion: 1,
            estado: 1,
            fecha_hora: 1
        }, function (err, rutas) {
            if (err) { // err != null
                console.log(err);
                return res.status(500).json({
                    message: 'Error en la búsqueda.'
                })
            } else if (isEmpty(rutas)) {
                return res.status(404).json({
                    message: 'Rutas no encontradas'
                });
            } else {
                return res.json(rutas);
            }
        });
    },
    getLastNItems: function (req, res) {
        //La sintaxis en la petición debe ser limit=number(string)
        var skip = parseInt(req.query.skip);
        var limit = parseInt(req.query.limit);
        var valor = req.query.valor;
        res.set('Content-Type', 'application/json');
        Ruta.find({
            $text: {
                $search: valor
            }
        }, {
            _id: 1,
            nombre: 1,
            descripcion: 1,
            estado: 1,
            fecha_hora: 1
        },
        {
            skip: skip, // Starting Row
            limit: limit, // Ending Row
            sort:{
                _id: -1 //Sort by Date Added DESC
            }
        }, function(err, rutas) {
            if (err) { // err != null
                console.log(err);
                return res.status(500).json({
                    message: 'Error en la búsqueda.'
                })
            } else if (isEmpty(rutas)) {
                return res.status(404).json({
                    message: 'Rutas no encontradas'
                });
            } else {
                return res.json(rutas);
            }
        })
    },
    getCampo: function (req, res) {
        var id = mongoose.Types.ObjectId(req.params.id);
        var code = parseInt(req.query.code);
        Ruta.findById(id, function (err, response) {
            res.set('Content-Type', 'application/json');
            if (err) { // err != null
                console.log(err);
                return res.status(500).json({
                    message: 'Error en la búsqueda.'
                })
            } else if (isEmpty(response)) {
                return res.status(404).json({
                    message: `No existe una ruta con el ID: ${id}`
                });
            } else {
                switch (code) {
                    case 5:
                        return res.status(200).json(response);
                    case 6:
                        return res.status(200).json(response.referencias);
                    case 7:
                        return res.status(200).json(response.fecha_hora);
                    case 8:
                        return res.status(200).json(response.conductor_id);
                    case 9:
                        return res.status(200).json(response.estado);
                    case 10:
                        return res.status(200).json(response.velocidad_promedio);
                    case 11:
                        return res.status(200).json(response.subpuntos);
                    default:
                        return res.status(200).json({
                            message: 'Codigo no soportado'
                        });
                }
            }
        });
    },
    add: function (req, res) {
        var ruta = new Ruta(req.body);
        ruta.save(function (err, response) {
            res.set('Content-Type', 'application/json');
            res.location('ruta/' + response._id)
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
        Ruta.findByIdAndUpdate(id, req.body, { new: true }, function (err, response) {
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
    updateCampo: function (req, res) {
        var id = mongoose.Types.ObjectId(req.params.id);
        var campo = req.body;
        var code = parseInt(req.query.code);
        Ruta.findOne({ _id: id }, function (err, response) {
            res.set('Content-Type', 'application/json');
            if (err) { // err != null
                console.log(err);
                return res.status(500).json({
                    message: 'Error al buscar.'
                })
            } else if (isEmpty(response)) {
                return res.status(404).json({
                    message: 'No existe la ruta'
                });
            } else {
                switch (code) {
                    case 12:
                        campo.forEach(element => {
                            response.referencias.push(element);
                        });
                        saveUpdate(res, response, 'Error al actualizar referencia');
                        break;
                    case 13:
                        campo.forEach(element => {
                            response.subpuntos.push(element);
                        });
                        saveUpdate(res, response, 'Error al actualizar subpunto');
                        break;
                    default:
                        return res.status(200).json({
                            message: 'Codigo no soportado'
                        });
                }
            }
        });
    },
    remove: function (req, res) {
        var id = mongoose.Types.ObjectId(req.params.id);
        var campo = req.body;
        var code = parseInt(req.query.code);
        switch (code) {
            case 14:
                Ruta.findByIdAndRemove(id, function (err, response) {
                    res.set('Content-Type', 'application/json');
                    if (err) { // err != null
                        console.log(err);
                        return res.status(500).json({
                            message: 'Error al borrar.'
                        })
                    } else if (isEmpty(response)) {
                        return res.status(404).json({
                            message: 'No existe la ruta'
                        });
                    } else {
                        return res.json({
                            message: 'Ruta eliminada satisfactoriamente'
                        });
                    }
                });
                break;
            case 15:
                // MODIFICAR CÓDIGO CON LA NUEVA ESTRUCTURA DEL SCHEMA -> RUTA
                // CÓDIGO NO VÁLIDO.
                Ruta.findOne({ _id: id }, function (err, response) {
                    if (err) { // err != null
                        console.log(err);
                        return res.status(500).json({
                            message: 'Error al buscar.'
                        })
                    } else if (isEmpty(response)) {
                        return res.status(404).json({
                            message: 'No existe la ruta'
                        });
                    } else {
                        var index = response.referencias.indexOf(campo.id);
                        if (index > -1) {
                            response.referencias.splice(index, 1);
                            saveUpdate(res, response, 'Error al eliminar: REFERENCIA');
                        } else {
                            return res.status(404).json({
                                message: 'No existe el ID de la Referencia'
                            })
                        }
                    }
                });
                break;
            case 16:
                console.log(campo.id);
                Ruta.findOne({ _id: id }, function (err, response) {
                    if (err) { // err != null
                        console.log(err);
                        return res.status(500).json({
                            message: 'Error al buscar.'
                        })
                    } else if (isEmpty(response)) {
                        return res.status(404).json({
                            message: 'No existe la ruta'
                        });
                    } else {
                        var index = response.subpuntos.indexOf(campo.id);
                        if (index > -1) {
                            response.subpuntos.splice(index, 1);
                            saveUpdate(res, response, 'Error al eliminar: SUBPUNTO');
                        } else {
                            return res.status(404).json({
                                message: 'No existe el ID del Subpunto'
                            })
                        }
                    }
                });
                break;
            default:
                return res.status(400).json({
                    message: 'Codigo no soportado'
                });
        }
    }
}

function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function saveUpdate(res, elemento, message) {
    elemento.save(function (err, response) {
        if (err) { // err != null
            console.log(err);
            return res.status(500).json({
                message: message,
                error: err
            })
        }
        return res.status(200).json(response)
    })
}