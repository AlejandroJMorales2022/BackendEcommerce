const express = require('express');
const { Router } = require('express');
const pM = require('../../dao/managers/products/Product.db.manager');
const multer = require('multer');
const path = require('path');
const isAdmin = require('../../dao/managers/users/middlewares/admin.role.middleware');
const isAdminOrUserPremium = require('../../dao/managers/users/middlewares/admin_premium.middleware')
const isAdminOrUserOwner = require('../../dao/managers/users/middlewares/admin_owner_middleware');
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
router.get('/', controller.getAll);

//GET api/products/:pid
router.get('/:pid', controller.getById);

//POST (add product) api/products/  //agrega un producto
router.post('/', isAdminOrUserPremium,  controller.create);

//DELETE api/products/:pid //borra un producto
router.delete('/:pid', isAdminOrUserOwner,controller.deleteById);

//PUT api/products/:pid (modifica un  producto existente)
router.put('/:pid',  isAdminOrUserOwner, controller.update);

//POST api/products/:pid/upload (Ruta para cargar un archivo de imagen a un producto)
router.post('/:pid/upload', isAdminOrUserOwner, upload.single('img'), controller.uploadImg);





module.exports = router