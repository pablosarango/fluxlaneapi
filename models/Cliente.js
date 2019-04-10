'use strict'

var mongoose = require('mongoose');
const crypto = require('crypto');
const moment = require('moment');

var ClienteSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true
    },
    avatar: {
        type: String,
        default: 'user.png'
    },
    signupDate: {
        type: Date,
        default: Date.now
    },
    token: {
        valor: String,
        exp: {
            type: String,
            default: moment().add(3, 'months').unix()
        }
    },
    organizacion: {
        nombre: String,
        tipo: {
            type: String,
            enum: ['universidad', 'emprendimiento', 'freelancer', 'empresa']
        },
        rol: {
            type: String,
            enum: ['estudiante', 'profesor', 'administrativo', 'gerente', 'director', 'ejecutivo', 'desarrollador', 'director de proyecto']
        }
    },
    estado: {
        type: String,
        default: 'activo',
        enum: ['activo', 'no activo']
    }
});

ClienteSchema.methods.gravatar = function () {
    if (!this.email) return `https://gravatar.com/avatar/?s=200&d=retro`;

    const md5 = crypto.createHash('md5').update(this.email).digest('hex')
    return `https://gravatar.com/avatar/${md5}?s=200&d=retro`
}

ClienteSchema.index({'$**': 'text'});

var Cliente = mongoose.model('Cliente', ClienteSchema)

module.exports = Cliente