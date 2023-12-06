/* const express = require('express');
const { Router } = require('express'); */
const pM = require('../dao/managers/products/Product.db.manager');
const { CustomError, ErrorType } = require('../errors/custom.error');
/* const multer = require('multer');
const path = require('path');*/
//importo el modelo de products de mongo db
/* const productModel = require('../dao/models/products.model') */
const uM = require('../dao/managers/users/user.manager');
const {notifyPremium} = require('../controllers/mail.controller');

const getAll = async (req, res, next) => {
    const { search, max, min, limit } = req.query;

    try {
        const products = await pM.getAll();
        /* const products = await productModel.find(); */
        /* console.log(products); */
        let filtrados = products;
        if (products.length == 0) {
            /* res.status(404).send({
                stauts: 404,
                message: `No se encontraron Productos registrados...`
            }) */
            //Error Personalizado
            next(new CustomError('NoProductsInDB'))
            return;
        }
        if (limit) {
            filtrados = filtrados.splice(0, limit);
        }

        res.send({ status: 200, payload: filtrados });
    } catch (e) {
        /* res.status(500).send({
            message: "Ha ocurrido un error en el servidor",
            exception: e.stack
        }); */
        next(new CustomError('ServerError'))
    }
};


const getById = async (req, res, next) => {
    const { pid } = req.params;
    try {
        if (pid) {
            const product = await pM.getById(pid);
            if (product) {
                //emitir evento a todos los clientes conectados por websocket
                res.send({ status: 200, payload: product });
            } else {
                /* res.status(404).send({
                    status: 404,
                    message: `El Producto con ID: ${req.params.pid} No Existe...`
                }); */
                //Error Personalizado
                next(new CustomError('ProductIdNotFound'))
                return;
            }
        }
    } catch (e) {
        if (e.stack = 'CastError: Cast to ObjectId failed for value') {
            /* res.status(404).send({
                status: 404,
                message: "El Porducto con el ID indicado No Existe",
                exception: e.stack
            }); */
            next(new CustomError('CastErrorProduct'));
        } else {
            /* res.status(500).send({
                status: 500,
                message: "Ha ocurrido un error en el servidor",
                exception: e.stack
            }); */
            next(new CustomError('ServerError'));
        };
    };
};



const create = async (req, res, next) => {

    const { body, headers } = req;
    let bodyProduct = body;

    //si el producto se creo sin owner => POR DEFECTO como owner se pone 'Administrador'
    if (!body?.owner || body?.owner === '') {
        bodyProduct = { ...body, owner: 'Administrador' };
    }
    let error = 0;
    try {
        const responseValidate = validateProduct(bodyProduct);
        if (responseValidate.error !== 0) {
            /* res.status(500).send({
                status: 500,
                Message: `La Propiedad < ${responseValidate.field} > es Obligatoria y No puede estar Vacia...`
            }); */
            next(new CustomError('MissingProductProperty'))
            return;
        } else {
            const product = await pM.create(bodyProduct);
            if (product.errors) {
                /* res.status(500).send({
                    status: 500,
                    Message: `Ya Existe un Producto con el código ${product.code}...`
                }); */
                next(new CustomError('ProductAlreadyExist'))
                return;
            }
            res.status(201).send({
                status: 201,
                message: `El Producto ha sido Agregado Correctamente...`,
                payload: product
            });
            //websockets
            const io = req.app.get('socketio');
            // Emitir evento 'update_products' a todos los clientes conectados
            io.emit('update_products', { id: 0, msg: 'Se Agregó un Producto a la basse de datos' });
        }
    } catch (e) {
        /* res.status(500).send({
            message: "Ha ocurrido un error en el servidor",
            exception: e.stack
        }); */
        next(new CustomError('ServerError'));
    };
};



const deleteById = async (req, res, next) => {
    const { pid } = req.params;

    try {

        //traer el producto para luego tomar el email del owner, si lo tiene
        const product = await pM.getById(pid);

        const result = await pM.delete(pid)
        console.log(result)
        if (result.deletedCount == 1) {

            //Verificar si el Usuario owner del producto es Premium para notificarlo
            console.log('PRODUCTO A BORRAR ' + JSON.stringify(product, null, 2))
            if (product?.owner) {
                const userResp = await uM.getByEmail(product?.owner)
                console.log('USUARIO OWNER ' + JSON.stringify(userResp, null, 2))
                if (userResp.role === 'Premium') {
                    //si es Premium enviar un email avisandoque su producto está siendo borrado
                    notifyPremium(userResp.email, pid) //envio email
                    console.log(`Enviando Email al Usuario ${userResp?.email}, notificando que su producto ${pid} se ha eliminado`)
                }
            }

            res.status(200).send({
                status: 200,
                message: `El Producto con Id ${pid} ha sido Eliminado correctamente...`
            });
            //websockets
            const io = req.app.get('socketio');
            // Emitir evento 'update_products' a todos los clientes conectados
            io.emit('update_products', { id: pid, msg: 'el producto fue modificado' });
            return;
        } else {
            /* res.status(404).send({
                message: "E Producto con el ID indicado No Existe",
                exception: e.stack
            }); */
            next(new CustomError('ProductIdNotFound'));
            return;
        }

    } catch (e) {
        if (e.stack = 'CastError: Cast to ObjectId failed for value') {
            /* res.status(404).send({
                status: 404,
                message: "El Porducto con el ID indicado No Existe",
                exception: e.stack
            }); */
            next(new CustomError('CastErrorProduct'));
        } else {
            /* res.status(500).send({
                status: 500,
                message: "Ha ocurrido un error en el servidor",
                exception: e.stack
            }); */
            next(new CustomError('ServerError'));
        }
    }
};



const update = async (req, res, next) => {
    const { pid } = req.params;
    const { body } = req;

    try {
        const responseValidate = validateProduct(body);
        if (responseValidate.error !== 0) {
            /* res.status(500).send({
                status: 500,
                Message: `La Propiedad < ${responseValidate.field} > es Obligatoria y No puede estar Vacia...`
            }); */
            next(new CustomError('MissingProductProperty'))
            return;
        }
        const response = await pM.update(pid, body)
        /* const response = await productModel.updateOne({ _id: pid }, body) */
        /* console.log(response) */

        if (response.matchedCount >= 1) {
            res.status(202).send({
                status: 202,
                message: `El Producto ${pid} ha sido Modificado correctamente...`,
                payload: response
            });
            const io = req.app.get('socketio');
            // Emitir evento 'update_products' a todos los clientes conectados
            io.emit('update_products', { id: pid, msg: 'el producto fue modificado' });
        } else {
            /* res.status(404).send({
                status: 404,
                message: `El Producto con Id:${pid} No Existe...`
            }); */
            next(new CustomError('ProductIdNotFound'));
            return;
        }
    } catch (e) {
        if (e.stack = 'CastError: Cast to ObjectId failed for value') {
            /* res.status(404).send({
                status: 404,
                message: "El Porducto con el ID indicado No Existe",
                exception: e.stack
            }); */
            next(new CustomError('CastErrorProduct'));
        } else {
            /* res.status(500).send({
                status: 500,
                message: "Ha ocurrido un error en el servidor",
                exception: e.stack
            }); */
            next(new CustomError('ServerError'));
        };
    };
};



const uploadImg = async (req, res) => {
    const { originalname, path } = req.file;
    const fileName = originalname;
    /* console.log(path)
    console.log(fileName) */
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

        imgsProduct.push(fileName);

        if (product) {
            product = { ...product, thumbnails: imgsProduct };
            await pM.update(pid, product);
            res.status(202).send({
                status: 202,
                message: `archivo ${fileName} se asigno al producto ${pid}`
            })
            //websockets
            const io = req.app.get('socketio');
            // Emitir evento 'update_products' a todos los clientes conectados
            io.emit('update_products', { id: pid, msg: 'el producto fue modificado' });
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
    };
};



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
};


const mockProducts = async (req, res) => {
    const products = pM.getMockProducts();
    res.status(200).send({
        status: 200,
        message: `Listado de Productos Generados por Faker`,
        products
    })
}


module.exports = {
    getAll,
    getById,
    create,
    deleteById,
    update,
    uploadImg,
    mockProducts
}