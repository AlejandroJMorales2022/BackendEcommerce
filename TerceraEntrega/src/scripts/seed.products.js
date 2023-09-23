//Este archivo se usa en conjunto con un Script solo para cargar los productos del Json 
//a la Base de Datos de Mongo

const fs = require('fs/promises');
const path = require('path');

const mongoose = require('mongoose');
const productModel = require('../models/products.model');


const seed = async () => {
    await mongoose.connect("mongodb+srv://ecommerce:Cd8G9fga1N6MD3hK@cluster0.ewuqtys.mongodb.net/ecommerce?retryWrites=true&w=majority")
    
    const filepath = path.join(__dirname, '../', 'data/products.json');
    const data = await fs.readFile(filepath, 'utf-8');
    const products = JSON.parse(data).map(p => {
        const { id, ...product } = p; //esto saca del objeto product la propiedad id
        return product;
    })
    console.log(products)
    result = await productModel.insertMany(products);

    await mongoose.disconnect();
};

seed();
