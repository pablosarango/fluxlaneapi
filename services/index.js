'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const config = require('../config');


function createUserToken(email) {
    const payload = {
        sub: email,
        iat: moment().unix(),
        exp: moment().add(14, 'days').unix()
    }

    return jwt.encode(payload, config.SECRET_TOKEN);
}

function decodeUserToken(token) {
    const decoded = new Promise((resolve, reject) => {
        try {
            const payload = jwt.decode(token, config.SECRET_TOKEN)

            if (payload.exp <= moment().unix()) {
                reject({
                    status: 401,
                    message: "El token ha expirado"
                })
            }
            resolve(payload.sub)
        } catch (error) {
            reject({
                status: 403,
                message: "Token no válido"
            })
        }
    })
    return decoded;
}

function createClientToken(email) {
    const payload = {
        sub: email,
        iat: moment().unix(),
        exp: moment().add(3, 'months').unix()
    }

    return jwt.encode(payload, config.PUBLIC_TOKEN);
}

function decodeClientToken(token) {
    const decoded = new Promise((resolve, reject) => {
        try {
            const payload = jwt.decode(token, config.PUBLIC_TOKEN)

            if (payload.exp <= moment().unix()) {
                reject({
                    status: 401,
                    message: "El token ha expirado"
                })
            }

            resolve(payload.sub)

        } catch (error) {
            reject({
                status: 403,
                message: "Token no válido"
            })
        }
    })

    return decoded;
}

module.exports = {
    createClientToken,
    decodeClientToken,
    createUserToken,
    decodeUserToken
}