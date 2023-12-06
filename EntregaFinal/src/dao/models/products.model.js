const { Schema, model } = require('mongoose');
const paginate = require('mongoose-paginate-v2'); //Importo el plugin de Paginate de Mongoose

const schema = new Schema({
    title: {type: String, index: true},
    description: String,
    code: String,
    price: Number,
    status: Boolean,
    stock: Number,
    category: String,
    owner: String,
    thumbnails: [String]
});
 
schema.plugin(paginate); //activo el plugin en schema para que este adquiera la funcionalidad de paginate  

const productModel = model('products', schema);

module.exports = productModel;