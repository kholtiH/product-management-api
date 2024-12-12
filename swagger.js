const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const PORT = process.env.PORT || 3000

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Product Management API',
      version: '1.0.0',
      description: 'API for managing products with JWT authentication',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
    components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [
        {
          BearerAuth: [],
        },
      ],
    },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerDocs };
