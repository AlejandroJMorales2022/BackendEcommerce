const { devLogger, prodLogger } = require('../loggers/index');
//Importo los Tipos de Errores
const { ErrorType } = require('../errors/custom.error')

const errorsList = (err, _req, res, next) => {

    const newError = ErrorType.find(e => e.code === err.code)
    switch (err.code) {
        case 'NoProductsInDB':
            res.status(404).send({
                stauts: 'Error',
                message: newError.type
            });
            process.env.ENVIRONMENT === 'development' ? devLogger.error(`status: 404 - ${newError.type}`)
                : prodLogger.error(`status: 404 - ${newError.type} - ${(new Date()).toISOString()}`);
            break;
        case 'ProductIdNotFound':
            res.status(404).send({
                stauts: 'Error',
                message: newError.type
            });
            process.env.ENVIRONMENT === 'development' ? devLogger.error(`status: 404 - ${newError.type}`)
                : prodLogger.error(`status: 404 - ${newError.type} - ${(new Date()).toISOString()}`);
            break;
        case 'CastErrorProduct':
            res.status(404).send({
                stauts: 'Error',
                message: newError.type
            });
            process.env.ENVIRONMENT === 'development' ? devLogger.error(`status: 404 - ${newError.type}  - ${(new Date()).toISOString()}`)
                : prodLogger.error(`status: 404 - ${newError.type} - ${(new Date()).toISOString()}`);
            break;
        case 'MissingProductProperty':
            res.status(404).send({
                stauts: 'Error',
                message: newError.type
            });
            process.env.ENVIRONMENT === 'development' ? devLogger.error(`status: 404 - ${newError.type}  - ${(new Date()).toISOString()}`)
                : prodLogger.error(`status: 404 - ${newError.type} - ${(new Date()).toISOString()}`);
            break;
        case 'ProductAlreadyExist':
            res.status(404).send({
                stauts: 'Error',
                message: newError.type
            });
            process.env.ENVIRONMENT === 'development' ? devLogger.error(`status: 404 - ${newError.type} - ${(new Date()).toISOString()}`)
                : prodLogger.error(`status: 404 - ${newError.type} - ${(new Date()).toISOString()}`);
            break;
        case 'CartIdNotFound':
            res.status(404).send({
                stauts: 'Error',
                message: newError.type
            });
            process.env.ENVIRONMENT === 'development' ? devLogger.error(`status: 404 - ${newError.type} - ${(new Date()).toISOString()}`)
                : prodLogger.error(`status: 404 - ${newError.type} - ${(new Date()).toISOString()}`);
            break;
        case 'CastErrorCart':
            res.status(404).send({
                stauts: 'Error',
                message: newError.type
            });
            process.env.ENVIRONMENT === 'development' ? devLogger.error(`status: 404 - ${newError.type} - ${(new Date()).toISOString()}`)
                : prodLogger.error(`status: 404 - ${newError.type} - ${(new Date()).toISOString()}`);
            break;
        case 'CartAlreadyExist':
            res.status(404).send({
                stauts: 'Error',
                message: newError.type
            });
            process.env.ENVIRONMENT === 'development' ? devLogger.error(`status: 404 - ${newError.type} - ${(new Date()).toISOString()}`)
                : prodLogger.error(`status: 404 - ${newError.type} - ${(new Date()).toISOString()}`);
            break;
        case 'TicketNoGenerated':
            res.status(404).send({
                stauts: 'Error',
                message: newError.type
            });
            process.env.ENVIRONMENT === 'development' ? devLogger.error(`status: 404 - ${newError.type} - ${(new Date()).toISOString()}`)
                : prodLogger.error(`status: 500 - ${newError.type} - ${(new Date()).toISOString()}`);
            break;
        case 'ServerError':
            res.status(500).send({
                stauts: 'Error',
                message: newError.type + ' *** ' + err.stack
            });
            process.env.ENVIRONMENT === 'development' ? devLogger.error(`status: 404 - ${newError.type} - ${(new Date()).toISOString()}`)
                : prodLogger.error(`status: 500 - ${newError.type} - ${(new Date()).toISOString()}`);
            break;

        default: prodLogger.info('Error No Identificado')
    }

    next();
}
module.exports = errorsList;