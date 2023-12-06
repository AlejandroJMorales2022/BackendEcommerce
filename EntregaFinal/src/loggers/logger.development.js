

const { createLogger, transports: { Console, File }, format: { combine, colorize,simple } } = require('winston');


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

const devLogger = createLogger({
    transports: [
        new Console({
            level: 'debug',
            format: combine(
                colorize({colors: options.colors}),
                simple()
            )
        })
    ]
});



module.exports = devLogger;