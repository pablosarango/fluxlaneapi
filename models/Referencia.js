var mongoose = require('mongoose');

var ReferenciaSchema = new mongoose.Schema({
    identificador: String,
    ruta_id: String,
    velocidad_promedio: String,
    fecha_hora: Date,
    coordenadas: {
        latitud: String,
        longitud: String
    }
});

ReferenciaSchema.index({'$**':'text'});

var Referencia = mongoose.model('Referencia', ReferenciaSchema);

module.exports = Referencia;