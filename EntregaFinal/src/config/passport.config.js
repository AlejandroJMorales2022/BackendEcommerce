// generar nuestra estrategia de passport
const passport = require('passport');
const local = require('passport-local');
const userManager = require('../dao/managers/users/user.manager');
const { hashPassword, isValidPassword } = require('../utils/password.utils');



const LocalStrategy = local.Strategy;

const signup = async (req, email, password, done) => {
    const { password: _password, password2: _password2, ...user } = req.body;

    const _user = await userManager.getByEmail(email);

    if (_user) {
        console.log('usuario ya existe');
        return done(null, false);
    };
    const passHashed = hashPassword(password);

    try {
        const newUser = await userManager.create({
            ...user,
            password: passHashed,
            email: email
        });

        //Borrar el password
        const { password, ...userLogged } = newUser;

        return done(null, {
            name: userLogged.firstname,
            id: userLogged._id,
            ...userLogged._doc
        });

    } catch (e) {
        console.log('ha ocurrido un error');
        done(e, false);
    };
};



const login = async (email, _password, done) => {
    try {
        const _user = await userManager.getByEmail(email);

        if (!_user) {
            console.log('usuario no existe');
            return done(null, false);
        }

        if (!_password) {
            return done(null, false);
        }

        if (!isValidPassword(_password, _user.password)) {
            console.log('credenciales no coinciden');
            return done(null, false);
        }

        //agrego el flag de Logged=true
        // TODO: borrar password
        console.log('_user: ' + JSON.stringify(_user, null, 2))
        const { /* password, */ __v, ...user_ } = _user;
        const userLogged = { ...user_, logged: true }

        done(null, userLogged);

    } catch (error) {
        console.log('ha ocurrido un error');
        done(error, false);
    };
};



const initializePassport = () => {

    //Inicializamos la Estategia Local
    //*** username sera en este caso el email
    // done sera el call back de resolucion de passport, el 1er argumento es para el error y el segundo para el usuario
    /// { usernamField: 'username', passwordField: 'password' }
    passport.use('local-signup', new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, signup));
    passport.use('local-login', new LocalStrategy({ usernameField: 'email' }, login));

    passport.serializeUser((user, done) => {

        done(null, user._id);
    });
    passport.deserializeUser(async (id, done) => {
        const user = await userManager.getById(id);

        // TODO: borrar el password
        const { password, ...userLogged } = user;
        done(null, userLogged);
    });
};

module.exports = initializePassport;