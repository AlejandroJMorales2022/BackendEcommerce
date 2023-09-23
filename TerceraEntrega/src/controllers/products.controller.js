/* const express = require('express');
const { Router } = require('express'); */
const pM = require('../dao/managers/products/Product.db.manager');
/* const multer = require('multer');
const path = require('path');*/
//importo el modelo de products de mongo db
/* const productModel = require('../dao/models/products.model') */
 



const getAll =async (req, res) => {
    const { search, max, min, limit } = req.query;

    try {
        const products = await pM.getAll();
        /* const products = await productModel.find(); */
        /* console.log(products); */
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
};


const getById = async (req, res) => {
    const { pid } = req.params;
    try {
        if (pid) {
            const product = await pM.getById(pid);
            if (product.title) {
                //emitir evento a todos los clientes conectados por websocket
                res.send({ status: 200, payload: product });
            } else {
                res.status(404).send({
                    status: 404,
                    message: `El Producto con ID: ${req.params.pid} No Existe...`
                });
                return;
            }
        }
    } catch (e) {

        if (e.stack = 'CastError: Cast to ObjectId failed for value') {
            res.status(404).send({
                status: 404,
                message: "El Porducto con el ID indicado No Existe",
                exception: e.stack
            });
        } else {
            res.status(500).send({
                status: 500,
                message: "Ha ocurrido un error en el servidor",
                exception: e.stack
            });
        };
    };
};



const create = async (req, res) => {

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
            if (product.errors) {
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
            //websockets
            const io = req.app.get('socketio');
            // Emitir evento 'update_products' a todos los clientes conectados
            io.emit('update_products', { id: 0, msg: 'Se Agregó un Producto a la basse de datos' });
        }
    } catch (e) {
        res.status(500).send({
            message: "Ha ocurrido un error en el servidor",
            exception: e.stack
        });
    };
};



const deleteById = async (req, res) => {
    const { pid } = req.params;
    try {
        /* const result = await productModel.deleteOne({ _id: pid }) */
        const result = await pM.delete(pid)
        console.log(result)
        if (result.deletedCount == 1) {
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
            res.status(404).send({
                message: "E Producto con el ID indicado No Existe",
                exception: e.stack
            });
        }
    } catch (e) {
        if (e.stack = 'CastError: Cast to ObjectId failed for value') {
            res.status(404).send({
                status: 404,
                message: "El Porducto con el ID indicado No Existe",
                exception: e.stack
            });
        } else {
            res.status(500).send({
                status: 500,
                message: "Ha ocurrido un error en el servidor",
                exception: e.stack
            });
        }
    }
};



const update = async (req, res) => {
    const { pid } = req.params;
    const { body } = req;

    try {
        const responseValidate = validateProduct(body);
        if (responseValidate.error !== 0) {
            res.status(500).send({
                status: 500,
                Message: `La Propiedad < ${responseValidate.field} > es Obligatoria y No puede estar Vacia...`
            });
            return;
        }
        const response = await pM.update(pid, body)
        /* const response = await productModel.updateOne({ _id: pid }, body) */
        console.log(response)

        if (response.matchedCount >= 1) {
            res.status(202).send({
                status: 202,
                message: `El Producto ${pid} ha sido Modificado correctamente...`
            });
            const io = req.app.get('socketio');
            // Emitir evento 'update_products' a todos los clientes conectados
            io.emit('update_products', { id: pid, msg: 'el producto fue modificado' });
        } else {
            res.status(404).send({
                status: 404,
                message: `El Producto con Id:${pid} No Existe...`
            })
            return;
        }
    } catch (e) {
        if (e.stack = 'CastError: Cast to ObjectId failed for value') {
            res.status(404).send({
                status: 404,
                message: "El Porducto con el ID indicado No Existe",
                exception: e.stack
            });
        } else {
            res.status(500).send({
                status: 500,
                message: "Ha ocurrido un error en el servidor",
                exception: e.stack
            });
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


module.exports = {
    getAll,
    getById,
    create,
    deleteById,
    update,
    uploadImg
}