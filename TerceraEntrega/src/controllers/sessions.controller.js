const userManager = require('../dao/managers/users/user.manager');
const { hashPassword, isValidPassword } = require("../utils/password.utils");
const passport = require('passport');
const isAuth = require('../dao/managers/users/middlewares/auth.middleware');
const UserDTO = require('../dao/models/dto/user.dto');


//Reistro de Usuario
const signUp = (req, res, next) => {
    passport.authenticate('local-signup', (err, user, info) => {
        if (err) {
            // Manejo de error
            return res.render('signup', {
                status: '500',
                error: 'Error en el Servidor...',
                style: 'style',
            });
        }
        if (!user) {
            // Manejo de fallo de registro
            return res.render('signup', {
                status: '401',
                error: 'El Usuario ya Existe...',
                style: 'style',
            });
        }
        res.redirect('/login');
    })(req, res, next);
};


//Login de Usuario
const login = (req, res, next) => {

    passport.authenticate('local-login', (err, user, info) => {
        console.log('PASSPORT.AUTHENTICATED USER: ' + JSON.stringify(user, null, 2))
        if (err) {
            // Manejo de error
            res.render('login', {
                status: '500',
                error: 'Error en el Servidor...',
                login: false,
                style: 'style',
            });
        };
        if (!user) {
            return res.render('login', {
                status: '401',
                error: 'Usuario o Contraseña Invalidos...',
                login: false,
                style: 'style',
            });
        };
        // Verificar el password para asignar el rol
        const { password, email } = req.body;
        // Autenticación exitosa
        req.logIn(user, (err) => {
            if (err) {
                // Manejo de error de inicio de sesión
                return res.render('login', {
                    status: '500',
                    error: 'Error en el Servidor...',
                    login: false,
                    style: 'style',
                });
            }
            // Almacenar la propiedad role en la sesión
            req.session.role = (email === 'adminCoder@coder.com') ? 'Administrador' : 'Usuario';
            // Redirección después de un inicio de sesión exitoso
            res.redirect('/');
        });

    })(req, res, next);
};


//trae el usuario logueado, si existiera uno
const getCurrentUser = (req, res) => {
    if (isAuth) {
        const userData = new UserDTO(req.user);
        console.log('USER DTO: ' + userData)
        // El usuario está autenticado, por lo que puedes acceder a él a través de req.user.
        res.status(200).send({
            status: 200,
            message: `Usuario Logueado`,
            payload: userData.getUserData()
           /*  payload: req.user */ //agregar pra la entrega 3 PF que no devuelva password
        });
    } else {
        // El usuario no está autenticado.
        res.status(401).send({
            status: 401,
            message: `No se Encontró un Usuario Logueado en el Sistema...`
        });
    };
};



module.exports = {
    signUp,
    login,
    getCurrentUser
}