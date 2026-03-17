require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/proyectobackend3';

mongoose.connect(MONGO_URI)
    .then(() => {
    console.log('MongoDB conectado');
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en puerto ${PORT}`);
    });
    })
    .catch((error) => {
    console.error('Error conectando a MongoDB:', error);
    process.exit(1);
    });