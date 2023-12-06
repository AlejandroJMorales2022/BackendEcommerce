const { Router } = require('express');
const controller = require('../../controllers/carts.controller');
const isUser = require('../../dao/managers/users/middlewares/user.role.middleware');


const router = Router();

// route api/carts/:cid
router.get('/:cid', controller.getById);

//POST (add new cart) api/carts/  //crea un nuevo carrito
router.post('/', isUser ,controller.create);

//PUT /:cid/product/:pid   //agrega un producto al carrito
router.post('/:cid/product/:pid', isUser ,controller.addProductToCart);

//PUT (add productsss to cart) api/carts/:cid    //Agrega arreglo de products al carrito cid
router.put('/:cid', isUser ,controller.addProductsToCart);


//DELETE api/carts/:cid/products/:pid //Borra el producto pid del carrito cid
router.delete('/:cid/products/:pid', isUser ,controller.deleteProduct);


//DELETE api/carts/:cid //Borra todos los productos del carrito cid
router.delete('/:cid', isUser ,controller.deleteProducts);

//POST api/:cid/purchase
router.post('/:cid/purchase', isUser, controller.createPurchase);



module.exports = router


