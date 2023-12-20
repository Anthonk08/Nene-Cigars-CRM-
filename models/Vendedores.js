const mongoose = require('mongoose');

const VendedoresSchema = mongoose.Schema({
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
    cargo: {
        type: String,
        trim: true
    },
    cedula: {
        type: String,
        required: true,
        trim: true
    },
    telefono: {
        type: Number,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    creado: {
        type: String,
        trim: true
    },
});

module.exports = mongoosemodel('Vendedores', VendedoresSchema);