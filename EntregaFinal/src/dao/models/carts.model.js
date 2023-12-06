const { Schema, model } = require('mongoose');

const schema = new Schema({
    /* user: { type: Schema.Types.ObjectId, ref: 'users' }, */
    products: {
        type: [{
            product: { type: Schema.Types.ObjectId, ref: 'products' },
            quantity: { type: Number, default: 0 }
        }],
        default: []
    },
    createdDate: { type: Number, default: Date.now() }
});


const cartModel = model('carts', schema)

module.exports = cartModel;