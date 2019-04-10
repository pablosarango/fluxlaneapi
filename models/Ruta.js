var mongoose = require('mongoose');

var RutaSchema = new mongoose.Schema({
    nombre: String,
    descripcion: String,
    estado: {
        type: String,
        default: 'asignada',
        enum: [ 'asignada', 'pendiente', 'revisada', 'rechazada', 'aprobada']
    },
    conductor_id: String,
    velocidad_promedio: String,
    fecha_hora: {
        creacion: Date,
        fecha_captura: Date,
        inicio_captura: String,
        fin_captura: String
    },
    clima: String,
    int_captura: Number,
    referencias:{
        type: Array
    },
    subpuntos: {
        type: Array
    }
});

RutaSchema.index({'$**': 'text'});

var Ruta = mongoose.model('Ruta', RutaSchema);

module.exports = Ruta;