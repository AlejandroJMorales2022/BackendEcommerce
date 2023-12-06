const { error } = require('winston');
const devLogger = require('../loggers/logger.development');
const prodLogger = require('../loggers/logger.production');


const fn = ( req, _res, next )=>{
    
    /* console.log('ENTORNO '+ process.env.ENVIRONMENT) */
   
    if(process.env.ENVIRONMENT ==='development'){
        /* console.log("por desarrollo") */
        devLogger.http(` DEVELOPMENT LOG ACTION [${req.method}] - ${req.url} at ${ (new Date()).toISOString()}`) //genero el string a mostrar en el Log
    } else if(process.env.ENVIRONMENT ==='production') {
        /* console.log("por produccion") */
        prodLogger.http(` PRODUCTION LOG ACTION [${req.method}] - ${req.url} at ${ (new Date()).toISOString()}`)
    }
    
    next();
}
module.exports = fn;