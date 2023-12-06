const { devLogger, prodLogger } = require('../loggers/index') //importo logger desde el index de loggers


const dataLogger = (req, res) => {
    const { logtype } = req.params;
    let noLog = 0;
    if (logtype === 'debug') {
        if (process.env.ENVIRONMENT === 'development') {
            devLogger.debug(` DEVELOPMENT LOGGER ACTION: DEBUG [${req.method}] - ${req.url} at ${(new Date()).toISOString()}`) //genero el string a mostrar en el Log
        } else if (process.env.ENVIRONMENT === 'production') {
            noLog = 1;
            prodLogger.debug(` PRODUCTION LOGGER ACTION: DEBUG [${req.method}] - ${req.url} at ${(new Date()).toISOString()}`)
            
        }
    } else if (logtype === 'info') {
        if (process.env.ENVIRONMENT === 'development') {
            devLogger.info(` DEVELOPMENT LOGGER ACTION: INFO [${req.method}] - ${req.url} at ${(new Date()).toISOString()}`) //genero el string a mostrar en el Log
        } else if (process.env.ENVIRONMENT === 'production') {
            /* console.log("por produccion") */
            prodLogger.info(` PRODUCTION LOGGER ACTION: INFO [${req.method}] - ${req.url} at ${(new Date()).toISOString()}`)
        }
    } else if (logtype === 'warning') {
        if (process.env.ENVIRONMENT === 'development') {
            devLogger.warning(` DEVELOPMENT LOGGER ACTION: WARNING [${req.method}] - ${req.url} at ${(new Date()).toISOString()}`) //genero el string a mostrar en el Log
        } else if (process.env.ENVIRONMENT === 'production') {
            /* console.log("por produccion") */
            prodLogger.warning(` PRODUCTION LOGGER ACTION: WARNING [${req.method}] - ${req.url} at ${(new Date()).toISOString()}`)
        }
    } else if (logtype === 'error') {
        if (process.env.ENVIRONMENT === 'development') {
            devLogger.error(` DEVELOPMENT LOGGER ACTION: ERROR [${req.method}] - ${req.url} at ${(new Date()).toISOString()}`) //genero el string a mostrar en el Log
        } else if (process.env.ENVIRONMENT === 'production') {
            /* console.log("por produccion") */
            prodLogger.error(` PRODUCTION LOGGER ACTION: ERROR [${req.method}] - ${req.url} at ${(new Date()).toISOString()}`)
        }
    }
    if (noLog === 0) {
        res.status(200).send({
            status: 200,
            message: `Logger Ok, Env: ${process.env.ENVIRONMENT} - LogType: ${logtype}`,
        });
    } else {
        res.status(200).send({
            status: 200,
            message: `Logger Unauthorized..., Env: ${process.env.ENVIRONMENT} - LogType: ${logtype}`,
        });
    }
}




module.exports = { dataLogger };