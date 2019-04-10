'use strict'

var mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');

var UsuarioSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true
    },
    displayName: String,
    password: String,
    avatar: String,
    signupDate: {
        type: Date,
        default: Date.now
    },
    lastLogin: Date,
    token: String,
    rol: {
        type: String,
        enum: ['conductor', 'administrador']
    },
    vehicle: String,
    state: {
        type: String,
        default: "Activo",
        enum: ['Activo', 'No activo']
    },
    pending_routes: {
        type: Array
    }
});

UsuarioSchema.pre('save', function (next) {
    let user = this
    if (!user.isModified('password')) return next()

    bcrypt.genSalt(10, (err, salt) => {

        if (err) return next()

        bcrypt.hash(user.password, salt, null, (err, hash) => {

            if (err) return next()

            user.password = hash;
            next();
        })
    })
});

UsuarioSchema.methods.gravatar = function () {
    if (!this.email) return `https://gravatar.com/avatar/?s=200&d=retro`;

    const md5 = crypto.createHash('md5').update(this.email).digest('hex')
    return `https://gravatar.com/avatar/${md5}?s=200&d=retro`
}

UsuarioSchema.index({'$**': 'text'});

var Usuario = mongoose.model('Usuario', UsuarioSchema)

module.exports = Usuario

