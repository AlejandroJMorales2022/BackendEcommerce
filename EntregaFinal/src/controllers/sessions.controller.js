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
        req.logIn(user, async (err) => {
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
            const loggedUser = await userManager.getByEmail(email);
            console.log('USUARIO LOGUEADO ***: ' + loggedUser.role);
            req.session.role = loggedUser.role/* (email === 'adminCoder@coder.com') ? 'Administrador' : loggedUser?.role; */
            //Actualiza el flag last_connection del usuario
            const now = Date.now();
            const updatedUser = await userManager.update(user._id, { ...user, last_connection: now });
            // Redirección después de un inicio de sesión exitoso
            /* res.send({
                status: 'success',
                massage: 'Usuario Logueado con Exito',
            }) */
            res.redirect('/');
        });

    })(req, res, next);
};

//logout
const logout = async (req, res) => {
    const { user } = req
    //Actualiza el flag last_connection del usuario
    const now = Date.now();
    const updatedUser = await userManager.update(user._id, { ...user, last_connection: now });
    console.log('El Usuario Cerro la Sesión...')
    /*  console.log(JSON.stringify(user,null,2)) */
    req.logout(function (err) {
        if (err) {
            console.error(err);
        }
        res.redirect('/login');
    });
}


//trae el usuario logueado, si existiera uno
const getCurrentUser = (req, res) => {
    if (isAuth) {
        const userData = new UserDTO(req.user);
        /* console.log('USER DTO: ' + userData) */
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

//Login de Usuario
const restartpass = async (req, res, next) => {

    const { newpass } = req.body
    try {
        const usuario = await userManager.getByEmail(req.user.email)
        /* console.log(JSON.stringify(usuario, null, 2)) */

        if (isAuth) {
            console.log('Nuevo Password enviado por Formulario' + newpass)
            if (isValidPassword(newpass, usuario.password)) {
                //avisar que el new passwor debe ser diferente al anterior
                return res.render('pass_restart', {
                    status: '400',
                    error: 'Ya tiene este password en uso...debe ingresar un nuevo',
                });

            } else {
                //actualizar el password y hacer logout para que vuelva a loguearse
                await userManager.updatePass(req.user._id, newpass)
                res.render('logout', {
                    status: '400',
                    error: 'Se ha Restablecido su contraseña...por favor vualva a ingresar con la nueva clave',
                    login: false,
                    style: 'style',
                });

            }

        }
        (req, res, next);
    } catch (error) {
        console.log('RestartPass ' + error)
        res.status(500).send({
            status: 500,
            message: error,
        });
    }

};


module.exports = {
    signUp,
    login,
    logout,
    getCurrentUser,
    restartpass
}