const { Router } = require('express');
const CartManager = require('../../managers/CartManager');
const ProductManager = require('../../managers/ProductManager');


const cM = new CartManager('carts.json');
const router = Router();
const pM = new ProductManager('products.json')


// route api/carts/:cid
router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        let productsInCart = [];
        if (cid) {
            const cart = await cM.getById(parseInt(cid));
            if (!cart) {
                res.status(404).send({
                    status: 404,
                    message: `El Cart con Id:${cid} No Existe...`
                })
                return
            }
            if (cart.products.length > 0) {
                //buscar productos del array del cart en roducts.json
                const promise = cart.products.map(async (prod, index) => {
                    const product = await pM.getById(parseInt(prod.id));

                    return { ...product, quantity: prod.quantity };
                });
                const productsInCart = await Promise.all(promise);
                res.send(productsInCart);
            } else {
                res.status(404).send({
                    status: 404,
                    message: `El Cart con Id:${cid} No Tiene Productos cargados por el momento...`
                });
            }
        }
    } catch (e) {
        res.status(500).send({
            status: 500,
            message: "Ha ocurrido un error en el servidor",
            exception: e.stack
        });
    };
});

//POST (add new cart) api/carts/
router.post('/', async (req, res) => {
    const { body } = req

    try {
        const product = await cM.create(body);
        res.status(201).send(product);
    }catch(e){
        res.status(500).send({
            status: 500,
            message: "Ha ocurrido un error en el servidor",
            exception: e.stack
        });
    };
});

//PUT /:cid/product/:pid 
router.post('/:cid/product/:pid', async (req, res) => {
    const { cid,pid } = req.params

    try {
        if (!await cM.getById(cid)) {
            res.status(404).send({
                status: 404,
                message: `El Cart con Id:${cid} No Existe...`
            });
            return;
        };
        if (!await pM.getById(pid)) {
            res.status(404).send({
                status: 404,
                message: `El Producto con Id:${pid} No Existe...`
            });
            return;
        };
        await cM.save(cid, pid);
        res.status(202).send({
        status:202,
        message: `El Producto ha sido Agregado Correctamente al carrito...`
        });
    } catch (e) {
        res.status(500).send({
            message: "Ha ocurrido un error en el servidor",
            exception: e.stack
        });
    }
});

module.exports = router