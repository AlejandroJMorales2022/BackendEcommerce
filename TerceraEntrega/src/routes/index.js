const {Router} = require('express');
const ProductRouter = require('./api/products.router');
const CartRouter = require('./api/carts.router');
const ViewRouter = require('./views.router');
const SessionRouter = require('./api/sessions.router');
const AuthRouter = require('./api/auth.router');


// /api
const router = Router();

// route de products
router.use('/products', ProductRouter);
// route de carts
router.use('/carts', CartRouter);
// route de Sessions
router.use('/sessions', SessionRouter);
//route de Auth
router.use('/auth', AuthRouter);



module.exports = {
    api: router,
    views: ViewRouter
}
