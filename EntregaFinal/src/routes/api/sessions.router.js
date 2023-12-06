const { Router } = require("express");
const isAuth = require('../../dao/managers/users/middlewares/auth.middleware');
const controller = require('../../controllers/sessions.controller');


const router = Router()


//Restablecer contraseña de Usuario
router.post('/restartpass', controller.restartpass);

//Reistro de Usuario
router.post('/signup', controller.signUp);


//Login de Usuario
router.post('/login', controller.login);

//LogOut
router.get('/logout', isAuth, controller.logout); 

//GET Current User - Trae el Usuario Logueado y el carrito populado con los productas cargados
router.get('/current', isAuth, controller.getCurrentUser );




module.exports = router;
