const { createLogger, transports: { Console, File }, format: { combine, colorize, simple } } = require('winston');

const options = {
    levels: {
        error: 0,
        warning: 1,
        info: 2,
        debug: 3
    },
    colors: {
        error: 'red',
        warning: 'yellow',
        info: 'green',
        debug: 'blue'
    }
}

const prodLogger = createLogger({
    transports: [
        new Console({
            level: 'info',
            format: combine(
                colorize({ colors: options.colors }),
                simple()
            )
        }),
        new File({
            filename: './src/loggers/logs/error.log',
            level: 'error',
            format: combine(
                simple()
            )
        })
    ]
});



module.exports = prodLogger;