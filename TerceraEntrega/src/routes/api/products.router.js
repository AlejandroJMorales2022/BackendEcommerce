const express = require('express');
const { Router } = require('express');
const pM = require('../../dao/managers/products/Product.db.manager');
const multer = require('multer');
const path = require('path');
const isAdmin = require('../../dao/managers/users/middlewares/admin.role.middleware');
//importo el modelo de products de mongo db
const productModel = require('../../dao/models/products.model');

const controller = require('../../controllers/products.controller');

const app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const router = Router();
const upload = multer({ storage });

//Diseño de las rutas (Endpoints de Products)

//GET api/products/
router.get('/', controller.getAll );

//GET api/products/:pid
router.get('/:pid', controller.deleteById);

//POST (add product) api/products/  //agrega un producto
router.post('/', isAdmin ,controller.create);

//DELETE api/products/:pid //borra un producto
router.delete('/:pid', isAdmin ,controller.deleteById);

//PUT api/products/:pid (modifica un  producto existente)
router.put('/:pid', isAdmin ,controller.update);

//POST api/products/:pid/upload (Ruta para cargar un archivo de imagen a un producto)
router.post('/:pid/upload', isAdmin ,upload.single('img'), controller.uploadImg );



module.exports = router