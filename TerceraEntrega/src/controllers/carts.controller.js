const cM = require('../dao/managers/carts/cart.db.manager');
const pM = require('../dao/managers/products/Product.db.manager');
const tM = require('../dao/managers/tickets/ticket.db.manager');


const getById = async (req, res) => {
    const { cid } = req.params;
    try {
        let productsInCart = [];
        if (cid) {
            const cart = await cM.getById(cid);
            if (!cart) {
                res.status(404).send({
                    status: 404,
                    message: `El Cart con Id:${cid} No Existe...`
                })
                return
            }
            res.status(202).send({
                status: 'success',
                statusNumber: 202,
                message: `Cart Solicitado...`,
                payload: cart,
            });
        }
    } catch (e) {
        res.status(500).send({
            status: 500,
            message: "Ha ocurrido un error en el servidor",
            exception: e.stack
        });
    };
};


const create = async (req, res) => {
    const { body } = req

    try {
        const product = await cM.create(body);
        res.status(201).send(product);
    } catch (e) {
        res.status(500).send({
            status: 500,
            message: "Ha ocurrido un error en el servidor",
            exception: e.stack
        });
    };
};


const addProductToCart = async (req, res) => {
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
};

const addProductsToCart = async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;
    try {
        const cartProducts = await cM.addProductsToCart(cid, products);
        res.status(201).send({
            status: 'success',
            statusNumber: 201,
            payload: cartProducts
        }
        );
    } catch (e) {
        res.status(500).send({
            status: 'error',
            statusNumber: 500,
            message: "Ha ocurrido un error en el servidor",
            exception: e.stack
        });
    };
};

const deleteProduct = async (req, res) => {
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
    };
};

const deleteProducts = async (req, res) => {
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
};

const createPurchase = async (req, res) => {
    const { cid } = req.params;
    const { email } = req.user;

    //traigo e carrito y sus productos
    const resp = await cM.getById(cid);

    let arrayPurchase = [];
    if (resp.products.length > 0) {
        for (const elem of resp.products) {
            const prod = await pM.getById(elem.product._id)
            if (prod.stock >= elem.quantity) {
                //si el stock existente del producto es mayor al cargado en el carrito
                //cargo el producto al array de compra
                arrayPurchase.push({ _id: elem.product._id, price: prod.price, quantity: elem.quantity });
                //borrar el producto comprado del carrito
                const resp = await cM.deleteProductOfCart(cid, prod._id.toString());
            };
        };
    };
    try {
        let purchase = {};
        if (arrayPurchase.length > 0) {
            //Calculo el total de Ticket (amount)
            let amount = 0;
            for (const prod of arrayPurchase) {
                amount += (parseInt(prod.quantity) * parseInt(prod.price));
            }
            //traer el ultimo Ticket para tomar su codigo e incrementarlo 
            //si no hay tickets su codigo sera 'TK-1'
            const resp = await tM.getAll();
            let codeTicket = '';

            if (resp.length > 0) { //si hay tickets
                codeTicket = 'TK-' + (parseInt((resp[resp.length - 1].code).match(/(\d+)$/)) + 1).toString();
            } else {
                codeTicket = 'TK-1';
            }
            purchase = {
                purchase_datetime: Date.now(),
                code: codeTicket,
                amount: amount,
                purcharser: email,
            };

            const purchaseOrder = await tM.create(purchase); //Genera el Ticket
            const pendingInCart = await cM.getById(cid)
            if (pendingInCart.products.length > 0) {
                return res.status(206).send({ status: 206, message: 'Ticket Generado pero Quedan Productos Pendientes en el Carrito de Compras por Falta de Stock', ticket: purchaseOrder, productsInTicket: arrayPurchase, productsInCart: pendingInCart.products });
            } else {
                return res.status(201).send({ status: 201, message: 'Ticket Generado Ok', ticket: purchaseOrder, productsInTicket: arrayPurchase, productsInCart: pendingInCart.products });
            };

        } else {
            res.status(400).send({
                status: 400,
                message: "Ticket No Generado"
            });
        }

    } catch (e) {
        res.status(500).send({
            status: 500,
            message: "Ha ocurrido un error en el servidor",
            exception: e.stack
        });
    };
};


module.exports = {
    getById,
    create,
    addProductToCart,
    addProductsToCart,
    deleteProduct,
    deleteProducts,
    createPurchase
}