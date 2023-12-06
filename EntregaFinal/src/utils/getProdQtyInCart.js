const userManager = require('../dao/managers/users/user.manager');
const cartManager = require('../dao/managers/carts/cart.db.manager');

const getProdQty = async (user_id)=>{
    let prodQty=0;
    const resp = await userManager.getById(user_id)
    if (resp?.cart){
        const cart = await cartManager.getById(resp?.cart)
        console.log('productos del cart: '+ JSON.stringify(cart,null,2))
        if (cart){
            for (const item of cart.products){
                    prodQty+= item.quantity;
            }
        }
    }
    console.log('TENEMOS EN EL CART :'+ prodQty)
    return prodQty;

};
module.exports = getProdQty;