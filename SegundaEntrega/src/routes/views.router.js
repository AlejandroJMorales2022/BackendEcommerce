const { Router } = require("express");
const pM = require('../dao/managers/products/Product.db.manager');
const cM = require('../dao/managers/carts/cart.db.manager');


/* const pM = productManager; */

const router = Router();

router.get('/chat', (req, res) => {
    res.render('chat', {
        chat: true,
        style: 'style',
        js: 'chat',
        title: 'CHAT'
    });
});


router.get('/', async (req, res) => {
    const { page, limit, query, sort } = req.query;
    const protocol = req.protocol;
    const host = req.get('host');
    try {
        const { docs: products, ...pageInfo } = await pM.getAllPaged(page, limit, query, sort);

        pageInfo.prevLink = pageInfo.hasPrevPage ? `${protocol}://${host}/?page=${pageInfo.prevPage}&limit=${!limit ? 10 : limit}${query ? `&query=${query}` : ''}${sort ? `&sort=${sort}` : ''}` : null;
        pageInfo.nextLink = pageInfo.hasNextPage ? `${protocol}://${host}/?page=${pageInfo.nextPage}&limit=${!limit ? 10 : limit}${query ? `&query=${query}` : ''}${sort ? `&sort=${sort}` : ''}` : null;
        pageInfo.startLink = pageInfo.totalPages >= 2 ? `${protocol}://${host}/?page=1&limit=${!limit ? 10 : limit}${query ? `&query=${query}` : ''}${sort ? `&sort=${sort}` : ''}` : null;
        pageInfo.endLink = pageInfo.totalPages >= 2 ? `${protocol}://${host}/?page=${pageInfo.totalPages}&limit=${!limit ? 10 : limit}${query ? `&query=${query}` : ''}${sort ? `&sort=${sort}` : ''}` : null;

        if (products) {
            res.render('home', {
                products: products,
                pageInfo,
                title: 'Listado de Productos',
                realtimeProducts: true,
                style: 'style',
                js: 'realtimeproducts'
            });
            /* res.status(200).send({
                status: 'success',
                statusNumber: 200,
                payload: products
            }); */
        };
    } catch (e) {
        res.status(500).send({
            status: 'error',
            statusNumber: 500,
            message: "Ha ocurrido un error en el servidor",
            exception: e.stack
        });
        console.log('Error: ' + e);
    };
});



router.get('/carts/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        if (cid) {
            const cart = await cM.getById(cid);
            if (!cart) {
                res.status(404).send({
                    status: 'error',
                    statusNumber: 404,
                    message: `El Cart con Id:${cid} No Existe...`
                });
                console.log('El Cart no Existe...');
                return;
            }
            let products = [];
            cart.products.forEach(prod => (
                products.push({                 //cargo el array products con as propiedades y formato adecuado para renderizar en la plantilla
                    _id: prod.product._id,
                    title: prod.product.title,
                    description: prod.product.description,
                    code: prod.product.code,
                    price: prod.product.price,
                    status: prod.product.status,
                    stock: prod.product.stock,
                    category: prod.product.category,
                    thumbnails: prod.product.thumbnails,
                    quantity: prod.quantity
                })
            ));
            res.render('cartproducts', {
                products: products,
                title: 'Carrito de Compras',
                realtimeProducts: false,
                style: 'style',
                cartId: cart._id
            });
            /* res.status(200).send({
                status: 'success',
                statusNumber: 200,
                payload: cart
            }); */
        }
    } catch (e) {
        res.status(500).send({
            status: 'error',
            statusNumber: 500,
            message: "Ha ocurrido un error en el servidor",
            exception: e.stack
        });
        console.log('Error: ' + e);
    };
})

module.exports = router;