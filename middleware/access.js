'use strict'

function comprobarCodigo(req, res, next) {
    var code = parseInt(req.query.code);
    if (code == 5) {
        next();
    } else {
        return res.status(400).json({
            message: "La solicitud contiene sintaxis errónea y no debería repetirse. Solo puedes usar el código 5."
        })
    }
}

module.exports = comprobarCodigo;