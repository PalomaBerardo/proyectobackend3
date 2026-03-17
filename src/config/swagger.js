const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
    definition: {
    openapi: '3.0.1',
    info: {
        title: 'API de Adopciones',
        version: '1.0.0',
        description: 'Documentación del módulo Users'
    }
    },
    apis: ['./src/docs/*.yaml']
};

const specs = swaggerJSDoc(swaggerOptions);

module.exports = specs;