const cartModel = require('../../models/carts.model');
const ticketModel = require('../../models/tickets.model');
const BaseManager = require('../base.manager');


class CartManager extends BaseManager {

    constructor() {
        super(cartModel);
    }

    /* async getById(id) {
        const cart = await cartModel.findOne({ _id: id })
            .populate({ path: "products.product" });

        return cart;
    } */


   /*  async create() {
        const cart = await cartModel.create({ products: [] })

        return cart
    } */

    async update(cid, pid, quantity) {

        //buscar el carrito en el que quiero agregar el producto
        const cart = await cartModel.findOne({ _id: cid });
        //si lo encuentro, buscar el producto
        if (cart._id != '') {
            //buscar si el producto ya existe
            const existing = cart.products.find((prod) => prod.product == pid);
            if (existing) {
                cart.products.forEach((prod, index) => {
                    if (prod.product == pid) {
                        cart.products[index] = { ...prod, product: pid, quantity: quantity/* (prod.quantity + 1) */ };
                    }
                });
            } else {
                cart.products = [...cart.products, { product: pid, quantity: quantity }]
            }
        }
        const cartUpdated = await cartModel.updateOne({ _id: cid }, { $set: { products: cart.products } });


        return cartUpdated
    }


    async addProductsToCart(cid, products) {
        //buscar el carrito en el que quiero agregar productos
        const cart = await cartModel.findOne({ _id: cid });
        //si lo encuentro, buscar el producto
        if (cart._id != '') {
            cart.products = products;
        }
        const cartUpdated = await cartModel.updateOne({ _id: cid }, { $set: { products: cart.products } });

        return cartUpdated;
    }


    async deleteProductOfCart(cid, pid) {
        //buscar el carrito en el que quiero agregar productos
        /* let updatedCart = {}; */
        const cart = await cartModel.findOne({ _id: cid });
        let updatedProducts = [];

        if (cart) {
            updatedProducts = cart.products.filter(prod => prod.product != pid);
            console.log('PRODUCTOS FILTRADOS: *** ' + updatedProducts)
            /*  updatedCart = await cartModel.updateOne({ _id: cid }, { $set: { products: newProductsArray } }) */
        }
        const updatedCart = await cartModel.findOneAndUpdate(
            { _id: cid },
            { $set: { products: updatedProducts } },
            { new: true } // Para obtener el carrito actualizado
        );
        return updatedCart;
    }


    async deleteProductsCart(cid) {
        //buscar el carrito en el que quiero agregar productos
        let emptyCart = {};
        const cart = await cartModel.findOne({ _id: cid });
        if (cart._id != '') {
            emptyCart = await cartModel.updateOne({ _id: cid }, { $set: { products: [] } })
        }

        return emptyCart;
    }


    async getTicket(tid) {
        const resultado = await ticketModel.find({ _id: tid }).lean();

        return resultado[0];
    };
}

module.exports = new CartManager();