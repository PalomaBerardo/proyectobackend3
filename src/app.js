const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const specs = require('./config/swagger');

const usersRouter = require('./routes/users.router');
const companiesRouter = require('./routes/companies.router');
const mockdataRouter = require('./routes/mockdata.router');
const petsRouter = require('./routes/pets.router');
const adoptionRouter = require('./routes/adoption.router');

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use('/apidocs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api/users', usersRouter);
app.use('/api/companies', companiesRouter);
app.use('/api/mockdata', mockdataRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionRouter);

module.exports = app;
