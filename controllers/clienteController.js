'use strict'

var mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
var Cliente = require('../models/Cliente');
const service = require('../services');


function info(req, res, next) {
    return res.status(200).json({
        name: 'FluxLane API',
        version: 'v0.01',
        author: {
            name: 'Pablo Sarango',
            email: 'pablosarangouchuari@gmail.com'
        },
        description: 'Proyecto final de carrera',
        message: 'El objetivo del proyecto es ofrecer datos sobre flujo vehicular a personas o entidades interesadas en mejorar la calidad de vida de las personas de su comunidad. El código ha sido subido a GITHUB para su fortalecimiento y mejora. Los datos que ofrece la API han sido suministrados por fuentes desinteresadas. El uso de la API es gratuito'
    })
}

function create(req, res, next) {
    //Comprobar que todos los campos del body son correctos o que no sean null
    var cliente
    if (!req.body) {
        return res.status(400).json({
            message: "El cuerpo de la solicitud contiene sintaxis errónea y no debería repetirse."
        })
    } else {
        cliente = new Cliente(req.body);
    }
    cliente.token.valor = service.createClientToken(cliente.email);
    res.set('Content-Type', 'application/json');
    cliente.save(function (err, client) {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: 'Error al intentar guardar el cliente'
            })
        }
        return res.status(201).json(client)
    })
}

function getByEmail(req, res, next) {
    var email;
    res.set('Content-Type', 'application/json');
    if (!req.params.email) {
        return res.status(400).json({
            message: "La solicitud contiene sintaxis errónea y no debería repetirse."
        })
    } else {
        email = req.params.email;
    }
    Cliente.findOne({
        email: email
    }, function (err, cliente) {
        if (err) { // err != null
            console.log(err);
            return res.status(500).json({
                message: 'Error en la búsqueda.'
            })
        } else if (isEmpty(cliente)) {
            return res.status(404).json({
                message: 'No existe el usuario'
            });
        } else {
            return res.status(200).json(cliente);
        }
    });
}

function getNewToken(req, res, next) {
    var email;
    res.set('Content-Type', 'application/json');
    if (!req.params.email) {
        return res.status(400).json({
            message: "La solicitud contiene sintaxis errónea y no debería repetirse."
        })
    } else {
        email = req.params.email;
    }
    Cliente.findOne({
        email: email
    }, function (err, cliente) {
        if (err) { // err != null
            console.log(err);
            return res.status(500).json({
                message: 'Error en la búsqueda.'
            })
        } else if (isEmpty(cliente)) {
            return res.status(404).json({
                message: 'Usuario no registrado. Registrate para obtener un TOKEN válido.'
            });
        } else {
            var token = service.createClientToken(email);
            cliente.token.valor = token;
            cliente.save(function (err, client) {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: 'Error al guardar el token'
                    })
                }
                return res.status(200).json(client)
            })
        }
    });
}


function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

module.exports = {
    info,
    create,
    getByEmail,
    getNewToken
}