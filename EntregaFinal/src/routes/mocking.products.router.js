const express = require('express');
const { Router } = require('express');
const pM = require('../dao/managers/products/Product.db.manager');


const controller = require('../controllers/products.controller');

const app = express();
const router = Router();


//GET /mockingproducts (Trae Productos generados por Faker)
router.get('/mockingProducts/', controller.mockProducts);



module.exports = router