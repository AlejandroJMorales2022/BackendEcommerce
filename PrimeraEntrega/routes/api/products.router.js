const { Router } = require('express');
const ProductManager = require('../../managers/ProductManager');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../public/uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const pM = new ProductManager('products.json');
const router = Router();
const upload = multer({ storage });

//Diseño de las rutas (Endpoints de Products)

//GET api/products/
router.get('/', async (req, res) => {

    const { search, max, min, limit } = req.query;

    try {
        const products = (await pM.getAll());
        let filtrados = products;
        if (products.length == 0) {
            res.status(404).send({
                stauts: 404,
                message: `No se encontraron Productos registrados...`
            })
            return;
        }
        if (limit) {
            filtrados = filtrados.splice(0, limit);
        }
        res.send({ status: 200, payload: filtrados });
    } catch (e) {
        res.status(500).send({
            message: "Ha ocurrido un error en el servidor",
            exception: e.stack
        });
    }
});

//GET api/products/:pid
router.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        if (pid) {
            const products = (await pM.getById(pid));
            if (products) {
                res.send({ status: 200, payload: products });
            } else {
                res.status(404).send({
                    status: 404,
                    message: `El Producto con ID: ${req.params.pid} No Existe...`
                });
                return;
            }
        }
    } catch (e) {
        res.status(500).send({
            status: 500,
            message: "Ha ocurrido un error en el servidor",
            exception: e.stack
        });
    }
});

//POST (add product) api/products/
router.post('/', async (req, res) => {
    const { body, headers } = req;
    let error = 0;
    try {
        const responseValidate = validateProduct(body);
        if (responseValidate.error !== 0) {
            res.status(500).send({
                status: 500,
                Message: `La Propiedad < ${responseValidate.field} > es Obligatoria y No puede estar Vacia...`
            });
        } else {
            const product = await pM.create(body);
            if(product.error){
                res.status(500).send({
                    status: 500,
                    Message: `Ya Existe un Producto con el código ${product.code}...`
                });
                return;
            }
            
            res.status(201).send({
                status: 201,
                message: `El Producto ha sido Agregado Correctamente...`,
                payload: product
            });
        }

    } catch (e) {
        res.status(500).send({
            message: "Ha ocurrido un error en el servidor",
            exception: e.stack
        });
    }

})

//DELETE api/products/:pid
router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        if (!await pM.getById(pid)) {
            res.status(404).send({
                status: 404,
                message: `El Producto con Id:${pid} No Existe...`
            });
            return;
        }
        await pM.delete(pid);
        res.status(200).send({
            status: 200,
            message: `El Producto con Id ${pid} ha sido Eliminado correctamente...`
        });
    } catch (e) {
        res.status(500).send({
            message: "Ha ocurrido un error en el servidor",
            exception: e.stack
        });
    }
});

//PUT api/products/:pid (modifica un  elemento existente)
router.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const { body } = req;
    try {

        const responseValidate = validateProduct(body);

        if (!await pM.getById(pid)) {
            res.status(404).send({
                status: 404,
                message: `El Producto con Id:${pid} No Existe...`
            })
            return;
        } else {
            if (responseValidate.error !== 0) {
                res.status(500).send({
                    status: 500,
                    Message: `La Propiedad < ${responseValidate.field} > es Obligatoria y No puede estar Vacia...`
                });
                return;
            }
        }
        await pM.save(pid, body);
        res.status(202).send({
            status: 202,
            message: `El Producto ${pid} ha sido Modificado correctamente...`
        });
    } catch (e) {
        res.status(500).send({
            status: 500,
            message: "Ha ocurrido un error en el servidor",
            exception: e.stack
        });
    }
});

//POST api/products/:pid/upload (Ruta para cargar un archivo de imagen a un producto)
router.post('/:pid/upload', upload.single('img'), async (req, res) => {
    const { originalname, path } = req.file;
    const fileName = originalname;
    try {
        if (!req.file) {
            res.status(404).send({
                status: 404,
                message: "El Archivo no Existe..."
            })
            return;
        }
        const { pid } = req.params;

        let product = await pM.getById(pid);
        if (!product) {
            res.status(404).send({
                status: 404,
                message: `El Producto con id ${pid} NO Existe...`
            })
            return;
        }
        let imgsProduct = product.thumbnails;

        imgsProduct.push('/public/uploads/' + fileName);

        if (product) {
            product = { ...product, thumbnails: imgsProduct };
            await pM.save(pid, product);
            res.status(202).send({
                status: 202,
                message: `archivo ${fileName} se asigno al producto ${pid}`
            })
        } else {
            res.status(404).send({
                status: 404,
                message: "El Producto No Existe..."
            })
            return;
        }
    } catch (e) {
        res.status(500).send({
            status: 500,
            message: "Ha ocurrido un error en el servidor",
            exception: e.stack
        });
    }
});

const validateProduct = (body) => {

    let response = { error: 0, field: '' }

    Object.keys(body).forEach((key, index) => {
        if (key !== 'thumbnails') {
            if (!Object.values(body)[index]) {
                response.error = 1;
                response.field = key;
            }
        }
    });
    return response;
}

module.exports = router