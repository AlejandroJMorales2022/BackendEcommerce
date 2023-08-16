const {Router} = require('express');
const ProductRouter = require('./api/products.router');
const CartRouter = require('./api/carts.router');
const ViewRouter = require('./views.router');


// /api
const router = Router();

// route de products
router.use('/products', ProductRouter);
// route de carts
router.use('/carts', CartRouter);


module.exports = {
    api: router,
    views: ViewRouter
}
