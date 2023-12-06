const { Router } = require("express");
 //Importo as librerias para Documentacion de API
 const swaggerJsDoc = require('swagger-jsdoc');
 const swaggerUiExpress = require('swagger-ui-express');


 //Definiciones para la Documentacion de la API
 const specs= swaggerJsDoc({
    definition:{
        openapi: '3.0.1',
        info: {
            title: 'API Backend Ecommerce',
            description: 'Documentación de API del Backend para administrar un Ecommerce'
        }
    },
    apis: ['../docs/carts.yaml']
});


const router = Router();


//le decimos a expres que ejecute el middleware para Documentacion de API
router.get('/apidocs',swaggerUiExpress.serve, swaggerUiExpress.setup(specs), (req, res)=>{
    res.send({
        status: 200,
        message: 'ruta apidocs encontrada'
    })
});

module.exports=router;