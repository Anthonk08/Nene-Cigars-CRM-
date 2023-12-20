const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });

const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.DB_MONGO, {});
        console.log("DataBase Conectada...");
    } catch (error) {
        console.log(`Error al conectar a la BD: ${error}`);
        process.exit(1);
    }
}

module.exports = conectarDB;