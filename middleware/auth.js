'use strict'

const services = require('../services');

function isUserAuth(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).json({
            message: "No tienes autorización"
        })
    }
    const token = req.headers.authorization.split(" ")[1]
    services.decodeUserToken(token)
        .then(response => {
            //req.user = response
            next()
        })
        .catch(response => {
            return res.status(response.status).json({
                message: response.message
            })
        })
}

function isClientAuth(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).json({
            message: "No tienes autorización"
        })
    }
    const token = req.headers.authorization.split(" ")[1]
    services.decodeClientToken(token)
        .then(response => {
            //req.user = response
            next()
        })
        .catch(response => {
            return res.status(response.status).json({
                message: response.message
            })
        })
}

module.exports = {
    isUserAuth,
    isClientAuth
}