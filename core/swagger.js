import swaggerJSDoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'ProMonitorAPI',
            version: '1.0.0',
            description: 'Documentação da API do sistema de gestão de monitoria ProMonitor',
        },
        servers: [
            {
                url: 'http://localhost:3000'
            },
        ],
    },
    apis: ['./routes/*.js'],
};

const specs = swaggerJSDoc(options);

export default specs;