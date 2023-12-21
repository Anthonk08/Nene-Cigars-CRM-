const mongoose = require('mongoose');

const ProductoSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    marca: {
        type: String,
        required: true,
        trim: true
    },
    anno: {
        type: String,
        required: true,
        trim: true
    },
    categoria: {
        type: String,
        required: true,
        trim: true
    },
    existencia: {
        type: Number,
        require: true,
        trim: true
    },
    precio: {
        type: Number,
        require: true,
        trim: true
    },
    capa: {
        type: String,
        required: true,
        trim: true
    },
    forma: {
        type: String,
        required: true,
        trim: true
    },
    tamano: {
        type: String,
        required: true,
        trim: true
    },
    sabor: {
        type: String,
        required: true,
        trim: true
    },
    aroma: {
        type: String,
        required: true,
        trim: true
    },
    fortaleza: {
        type: String,
        required: true,
        trim: true
    },
    creado: {
        type: Date,
        default: Date.now()
    },
});

module.exports = mongoose.model('Producto', ProductoSchema);