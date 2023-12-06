const { Router } = require('express');
const passport = require('passport');
const gitHubHandler = require('../../config/passport.github');
const { gitHubCallBack } = require('../../controllers/auth.controller')

const router = Router()

// este manejador es ejecutado cuando el user le da click a iniciar session con github
// passport ejecutara el login con la app de github y esta se abrira para que el usuario
// pueda meter sus datos y loguearse
router.get('/github', passport.authenticate(gitHubHandler, { scope: ['user:email'] }), (req, res) => { });


// una vez que el usuario se logueo en github
// es redirigido a nuestro callback para poder guardar la session
router.get('/githubcallback',
    passport.authenticate(gitHubHandler, { failureRedirect: '/login' }),
    gitHubCallBack
);

module.exports = router;