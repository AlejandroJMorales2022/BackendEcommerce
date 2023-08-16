const { Router } = require('express');
const cM = require('../../dao/managers/carts/cart.db.manager');
const pM = require('../../dao/managers/products/Product.db.manager');


const router = Router();

// route api/carts/:cid  //Trae del carrito cid todos los productos
router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        let productsInCart = [];
        if (cid) {
            const cart = await cM.getById(cid);
            if (!cart) {
                res.status(404).send({
                    status: 'error',
                    statusNumber: 404,
                    message: `El Cart con Id:${cid} No Existe...`
                })
                return
            }
            res.status(200).send({
                status: 'success',
                statusNumber: 200,
                payload: cart
            });
        }
    } catch (e) {
        res.status(500).send({
            status: 'error',
            statusNumber: 500,
            message: "Ha ocurrido un error en el servidor",
            exception: e.stack
        });
    };
});


//POST (add new cart) api/carts/    //Agrega un nuevo carrito con products=[]
router.post('/', async (req, res) => {
    const { body } = req
    try {
        const product = await cM.create(body);
        res.status(201).send({
            status: 'success',
            statusNumber: 201,
            payload: product
        });
    } catch (e) {
        res.status(500).send({
            status: 'error',
            statusNumber: 500,
            message: "Ha ocurrido un error en el servidor",
            exception: e.stack
        });
    };
});


//PUT /:cid/product/:pid            //Carga un producto pid al carrito cid. Si ya existe reemplaza la cantidad.
router.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params
    const { quantity } = req.body
    try {
        if (!await cM.getById(cid)) {
            res.status(404).send({
                status: 'error',
                statusNumber: 404,
                message: `El Cart con Id:${cid} No Existe...`
            });
            return;
        };
        if (!await pM.getById(pid)) {
            res.status(404).send({
                status: 'error',
                statusNumber: 404,
                message: `El Producto con Id:${pid} No Existe...`
            });
            return;
        };
        await cM.update(cid, pid, quantity);
        res.status(202).send({
            status: 'success',
            statusNumber: 202,
            message: `El Producto ha sido Agregado Correctamente al carrito...`
        });
    } catch (e) {
        res.status(500).send({
            status: 'error',
            statusNumber: 500,
            message: "Ha ocurrido un error en el servidor",
            exception: e.stack
        });
    }
});


//PUT (add productsss to cart) api/carts/:cid    //Agrega arreglo de products al carrito cid
router.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;
    try {
        const cartProducts = await cM.addProductsToCart(cid, products);
        res.status(201).send({
                status: 'success',
                statusNumber: 201,
                payload: cartProducts}
            );
    } catch (e) {
        res.status(500).send({
            status: 'error',
            statusNumber: 500,
            message: "Ha ocurrido un error en el servidor",
            exception: e.stack
        });
    };
});


//DELETE api/carts/:cid/products/:pid (Borra el producto pid del carrito cid)
router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const updatedCart = await cM.deleteProductOfCart(cid, pid);
        res.status(201).send({
            status: 'success',
            statusNumber: 201,    
            payload: updatedCart
        });
    } catch (e) {
        res.status(500).send({
            status: 'error',
            statusNumber: 500,
            message: "Ha ocurrido un error en el servidor",
            exception: e.stack
        });
    }
});


//DELETE api/carts/:cid (Borra todos los productos del carrito cid)
router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const emptyCart = await cM.deleteProductsCart(cid);
        res.status(201).send({
            status: 'success',
            statusNumber: 201,    
            payload: emptyCart
        });
    } catch (e) {
        res.status(500).send({
            status: 'error',
            statusNumber: 500,
            message: "Ha ocurrido un error en el servidor",
            exception: e.stack
        });
    };
});


module.exports = router