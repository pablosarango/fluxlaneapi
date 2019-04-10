var mongoose = require('mongoose');

var SubpuntoSchema = new mongoose.Schema({
    ruta_id: String,
    velocidad: String,
    fecha_hora: Date,
    coordenadas: {
        latitud: String,
        longitud: String
    }
});

SubpuntoSchema.index({'$**':'text'});

var Subpunto = mongoose.model('Subpunto', SubpuntoSchema);

module.exports = Subpunto;