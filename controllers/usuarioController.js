var mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
var Usuario = require('../models/Usuario');
const service = require('../services');

module.exports = {
    create: function (req, res) {
        //Comprobar que todos los campos del body son correctos o que no sean null
        var usuario = new Usuario(req.body)
        usuario.token = service.createUserToken(usuario.email);
        res.set('Content-Type', 'application/json');
        usuario.save(function (err, user) {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: 'Error al intentar guardar el usuario'
                })
            }
            return res.status(201).json({
                _id: user._id,
                token: user.token
            })
        })
    },
    /**
     * Se debe mejorar, para que no se indexe en la búsqueda el campo password
     */
    search: function (req, res) {
        //La sintaxis en la petición debe ser valor=string
        var valor = req.query.valor;
        res.set('Content-Type', 'application/json');
        Usuario.find({
            $text: {
                $search: valor
            }
        }, {
            password: 0,
            singupDate: 0,
            lastLogin: 0
        }, function (err, usuarios) {
            if (err) { // err != null
                console.log(err);
                return res.status(500).json({
                    message: 'Error en la búsqueda.'
                })
            } else if (isEmpty(usuarios)) {
                return res.status(404).json({
                    message: 'Usuarios no encontrado'
                });
            } else {
                return res.json(usuarios);
            }
        });
    },
    all: function (req, res) {
        res.set('Content-Type', 'application/json');
        Usuario.find({}, {
            password: 0,
            signupDate: 0,
            lastLogin: 0
        }, function (err, usuarios) {
            if (err) { // err != null
                console.log(err);
                return res.status(500).json({
                    message: 'Error en la búsqueda.'
                })
            } else if (isEmpty(usuarios)) {
                return res.status(404).json({
                    message: 'No existen usuarios registrados'
                });
            } else {
                return res.json(usuarios);
            }
        });
    },
    getByRol: function (req, res) {
        var rol = req.query.valor;
        res.set('Content-Type', 'application/json');
        Usuario.find({
            rol: rol
        }, {
            password: 0
        }, function (err, usuarios) {
            if (err) { // err != null
                console.log(err);
                return res.status(500).json({
                    message: 'Error en la búsqueda.'
                })
            } else if (isEmpty(usuarios)) {
                return res.status(404).json({
                    message: 'No existen usuarios con ese rol'
                });
            } else {
                return res.json(usuarios);
            }
        });
    },
    findById: function (req, res) {
        var id = mongoose.Types.ObjectId(req.params.id);
        res.set('Content-Type', 'application/json');
        Usuario.findOne({
            _id: id
        }, {
            password: 0
        }, function (err, usuario) {
            if (err) { // err != null
                console.log(err);
                return res.status(500).json({
                    message: 'Error en la búsqueda.'
                })
            } else if (isEmpty(usuario)) {
                return res.status(404).json({
                    message: 'No existe el usuario'
                });
            } else {
                return res.json(usuario);
            }
        });
    },
    loginAdmin: function (req, res) {
        var campos;
        res.set('Content-Type', 'application/json');
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({
                message: "El cuerpo de la solicitud contiene sintaxis errónea y no debería repetirse."
            })
        } else {
            campos = req.body;
        }
        Usuario.findOne({
            email: campos.email
        }, function (err, response) {
            if (err) { // err != null
                console.log(err);
                return res.status(500).json({
                    message: 'Error al buscar.'
                })
            } else if (isEmpty(response)) {
                return res.status(404).json({
                    message: 'No existe el usuario'
                });
            } else {
                if (response.rol === 'administrador') {
                    bcrypt.compare(campos.password, response.password, function (err, resultado) {
                        if ((resultado) && (response.email.localeCompare(campos.email)) == 0) {
                            response.lastLogin = new Date();
                            response.token = service.createUserToken(response.email)
                            response.save(function (err, user) {
                                if (err) {
                                    console.log(err);
                                    return res.status(500).json({
                                        message: 'Error al guardar el inicio de sesión'
                                    })
                                }
                                return res.status(200).json({
                                    _id: user._id,
                                    token: user.token
                                })
                            })
                        } else if (err) {
                            console.log(`Error al procesar el password: ${err}`)
                            return res.status(500).json({
                                message: 'Error al procesar el password'
                            })
                        } else {
                            return res.status(403).json({
                                message: 'Usuario o contraseña incorrectos'
                            })
                        }
                    });
                } else {
                    return res.status(403).json({
                        message: 'No tienes acceso.'
                    })
                }
                
            }
        });
    },
    loginUser: function (req, res) {
        var campos;
        res.set('Content-Type', 'application/json');
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({
                message: "El cuerpo de la solicitud contiene sintaxis errónea y no debería repetirse."
            })
        } else {
            campos = req.body;
        }
        Usuario.findOne({
            email: campos.email
        }, function (err, response) {
            if (err) { // err != null
                console.log(err);
                return res.status(500).json({
                    message: 'Error al buscar.'
                })
            } else if (isEmpty(response)) {
                return res.status(404).json({
                    message: 'No existe el usuario'
                });
            } else {
                if (response.rol === 'conductor') {
                    bcrypt.compare(campos.password, response.password, function (err, resultado) {
                        if ((resultado) && (response.email.localeCompare(campos.email)) == 0) {
                            response.lastLogin = new Date();
                            response.token = service.createUserToken(response.email)
                            response.save(function (err, user) {
                                if (err) {
                                    console.log(err);
                                    return res.status(500).json({
                                        message: 'Error al guardar el inicio de sesión'
                                    })
                                }
                                return res.status(200).json({
                                    _id: user._id,
                                    token: user.token
                                })
                            })
                        } else if (err) {
                            console.log(`Error al procesar el password: ${err}`)
                            return res.status(500).json({
                                message: 'Error al procesar el password'
                            })
                        } else {
                            return res.status(403).json({
                                message: 'Usuario o contraseña incorrectos'
                            })
                        }
                    });
                } else {
                    return res.status(403).json({
                        message: 'No tienes acceso.'
                    })
                }
                
            }
        });
    },
    update: function (req, res) {
        var id = mongoose.Types.ObjectId(req.params.id);
        res.set('Content-Type', 'application/json');
        Usuario.findByIdAndUpdate(id, req.body, {
            new: true
        }, function (err, response) {
            if (err) { // err != null
                console.log(err);
                return res.status(500).json({
                    message: 'Error en la actualización.'
                })
            } else if (isEmpty(response)) {
                return res.status(404).json({
                    message: 'No existe el usuario'
                });
            } else {
                return res.status(200).json({
                    message: "Actualización correcta"
                })
            }
        });
    },
    updateCampo: function (req, res) {
        var id = mongoose.Types.ObjectId(req.params.id);
        /**
         * el cuerpo de la petición debe ser de la siguiente forma
         * {
         *  "elemento": "valor"
         * }
         * 
         * Para la actualización de las rutas pendientes se debe enviar
         * {
         *  "elemento": [ "ID_1", "ID_2"]
         * }
         */
        var campo;
        res.set('Content-Type', 'application/json');
        if (req.imageName) {
            campo = req.imageName;
        } else {
            if (!req.body.elemento) {
                return res.status(400).json({
                    message: "El cuerpo de la solicitud contiene sintaxis errónea y no debería repetirse."
                })
            } else {
                campo = req.body.elemento;
            }
        }
        var code = parseInt(req.query.code);
        Usuario.findOne({
            _id: id
        }, function (err, response) {
            //res.set('Content-Type', 'application/json');
            if (err) { // err != null
                console.log(err);
                return res.status(500).json({
                    message: 'Error al buscar.'
                })
            } else if (isEmpty(response)) {
                return res.status(404).json({
                    message: 'No existe el usuario'
                });
            } else {
                switch (code) {
                    case 5:
                        response.displayName = campo;
                        saveUpdate(res, response, 'Error al actualizar el nombre');
                        break;
                    case 6:
                        response.avatar = campo;
                        saveUpdate(res, response, 'Error al actualizar avatar');
                        break;
                    case 7:
                        response.vehicle = campo;
                        saveUpdate(res, response, 'Error al actualizar el tipo de vehículo');
                        break;
                    case 8:
                        response.state = campo;
                        saveUpdate(res, response, 'Error al actualizar el estado del usuario');
                        break;
                    case 9:
                        response.token = campo;
                        saveUpdate(res, response, 'Error al actualizar el token del usuario');
                        break;
                    case 10:
                        campo.forEach(element => {
                            response.pending_routes.push(element);
                        });
                        saveUpdate(res, response, 'Error al actualizar las rutas pendientes');
                        break;
                    default:
                        return res.status(200).json({
                            message: 'Codigo no soportado'
                        });
                }
            }
        });
    },
    updatePassword: function (req, res) {
        var id = mongoose.Types.ObjectId(req.params.id);
        /**
         * el cuerpo de la petición debe ser de la siguiente forma
         * {
         *  "password": "valor"
         * }
         */
        var pass;
        res.set('Content-Type', 'application/json');
        if (!req.body.password) {
            return res.status(400).json({
                message: "El cuerpo de la solicitud contiene sintaxis errónea y no debería repetirse."
            })
        } else {
            pass = req.body.password;
        }
        Usuario.findOne({
            _id: id
        }, function (err, response) {
            //res.set('Content-Type', 'application/json');
            if (err) { // err != null
                console.log(err);
                return res.status(500).json({
                    message: 'Error al buscar.'
                })
            } else if (isEmpty(response)) {
                return res.status(404).json({
                    message: 'No existe el usuario'
                });
            } else {
                response.password = pass;
                response.save(function (err, respuesta) {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({
                            message: 'Error al guardar el cambio de contraseña'
                        })
                    }
                    return res.status(200).json({
                        message: "Contraseña actualizada"
                    })
                })
            }
        });
    },
    remove: function (req, res) {
        var id = mongoose.Types.ObjectId(req.params.id);
        /**
         * PARA ELIMINAR RUTAS PENDIENTES
         * el cuerpo de la petición debe ser de la siguiente forma
         * {
         *  "id": "valor"
         * }
         * El id corresponde al ID de la ruta pendiente a eliminar
         */
        var campo;
        var code = parseInt(req.query.code);
        res.set('Content-Type', 'application/json');
        switch (code) {
            case 11:
                Usuario.findByIdAndRemove(id, function (err, response) {
                    //res.set('Content-Type', 'application/json');
                    if (err) { // err != null
                        console.log(err);
                        return res.status(500).json({
                            message: 'Error al borrar.'
                        })
                    } else if (isEmpty(response)) {
                        return res.status(404).json({
                            message: 'No existe el usuario'
                        });
                    } else {
                        return res.status(200).json({
                            message: 'Usuario eliminado satisfactoriamente'
                        });
                    }
                });
                break;
            case 12:
                console.log(req.body);
                console.log(req.body.id);
                if (!req.body || !req.body.id) {
                    return res.status(400).json({
                        message: "El cuerpo de la solicitud contiene sintaxis errónea y no debería repetirse."
                    })
                } else {
                    campo = req.body;
                }
                Usuario.findOne({
                    _id: id
                }, function (err, response) {
                    if (err) { // err != null
                        console.log(err);
                        return res.status(500).json({
                            message: 'Error al buscar.'
                        })
                    } else if (isEmpty(response)) {
                        return res.status(404).json({
                            message: 'No existe el usuario'
                        });
                    } else {
                        var index = response.pending_routes.indexOf(campo.id);
                        if (index > -1) {
                            response.pending_routes.splice(index, 1);
                            saveUpdate(res, response, 'Error al eliminar: RUTA PENDIENTE');
                        } else {
                            return res.status(404).json({
                                message: 'No existe el ID de la Ruta Pendiente'
                            })
                        }
                    }
                });
                break;
            default:
                return res.status(200).json({
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
                message: message
            })
        }
        return res.status(200).json({
            message: "Satisfactorio"
        })
    })
}