require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const mocksRouter = require('./routes/mockdata.router');
const usersRouter = require('./routes/users.router');
const companiesRouter = require('./routes/companies.router');

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Routers
app.use('/api/mockdata', mocksRouter);
app.use('/api/users', usersRouter);
app.use('/api/companies', companiesRouter);

// Conexión a Mongo y arranque del servidor
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/proyectobackend3';

mongoose.connect(MONGO_URI)
.then(() => {
    console.log('MongoDB conectado');
    app.listen(PORT, () => console.log(`Server en puerto ${PORT}`));
})
.catch(err => {
    console.error('Error conectando a MongoDB', err);
    process.exit(1);
});

module.exports = app;
