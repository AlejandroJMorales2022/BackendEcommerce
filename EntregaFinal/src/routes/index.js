const {Router} = require('express');

const ProductRouter = require('./api/products.router');
const CartRouter = require('./api/carts.router');
const ViewRouter = require('./views.router');
const SessionRouter = require('./api/sessions.router');
const AuthRouter = require('./api/auth.router');
const MockingProductsRouter = require('./mocking.products.router');
const LoggersTestRouter = require('./loggerstest.router');
const EmailRouter = require('./api/notifications.router');
const UserRouter = require('./api/users.router');
const APIDocsRouter = require('./apidocs.router');

// /api
const router = Router();


// route de products
router.use('/products' , ProductRouter);
// route de carts
router.use('/carts', CartRouter);
// route de Sessions
router.use('/sessions', SessionRouter);
//route de Auth
router.use('/auth', AuthRouter);
/* //route de MockingPorducts
router.use('/mockingproducts', MockingProductsRouter); */
/* router.use('/loggerstest', LoggersTestRouter ); */
router.use('/notifications', EmailRouter);
router.use('/users', UserRouter)



module.exports = {
    api: router,
    views: ViewRouter,
    mockingProducts : MockingProductsRouter,
    loggersTest: LoggersTestRouter,
    emailSender: EmailRouter,
    APIDocs: APIDocsRouter
    
}
