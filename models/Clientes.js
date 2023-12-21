const mongoose = require('mongoose');

const ClientesSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    apellido: {
        type: String,
        required: true,
        trim: true
    },
    cedula: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    direccion: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    telefono: {
        type: String,
        trim: true,
    },
    vendedor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Vendedor',
    },
    creado: {
        type: Date,
        default: Date.now()
    },
});

module.exports = mongoose.model('Cliente', ClientesSchema);