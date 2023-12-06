const { authToken } = require('../utils/create.token')
const tokensEmailManager = require('../dao/managers/tokensemails/tokens.emails.db.manager');

const isValidToken = async (req, res, next) => {

    const { token, email } = req.query; // Reemplaza esto con el token que quieras recuperar



    // Obtener el tiempo de expiración almacenado en localStorage
    const resp = await tokensEmailManager.getByEmail(email)
    const storedToken = resp.token;

    if (storedToken === token) {
        if (authToken(token)) {
            next();
            return;
        } else {
            // El token ha expirado
            // El token es invalido
            res.render('login', {
                login: true,
                style: 'style',
                js: 'login',
                error: 'Token Expirado...el proceso de restauracion de contraseña no se ha completado, ingrese nuevamente'
            })
        }
    } else {
        // El token es invalido
        res.render('login', {
            login: true,
            style: 'style',
            js: 'login',
            error: 'Token Invalido...el proceso de restauracion de contraseña no se ha completado, ingrese nuevamente'
        })
    }
    next();
}
module.exports = isValidToken 
