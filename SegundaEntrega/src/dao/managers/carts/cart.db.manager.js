const cartModel = require('../../models/carts.model');


class CartManager {

    async getById(id) {
        const cart = await cartModel.findOne({ _id: id })
            .populate({ path: "products.product" });

        return cart;
    }


    async create() {
        const cart = await cartModel.create({ products: [] })

        return cart
    }

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
        let updatedCart = {};
        const cart = await cartModel.findOne({ _id: cid });

        if (cart._id != '') {
            const newProductsArray = cart.products.filter(prod => prod.product != pid);
            console.log(newProductsArray)

            updatedCart = await cartModel.updateOne({ _id: cid }, { $set: { products: newProductsArray } })
        }

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
}

module.exports = new CartManager();