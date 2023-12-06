const chai = require('chai');
const supertest = require('supertest')

const expect = chai.expect
/* const requestor = supertest('http://localhost:8080'); */
const requestor = supertest.agent('http://localhost:8080')

//USUARIO PREMIUM
/* const user = {
    email: "malejandro2002@yahoo.com.ar",
    password: "1234"
}; */

//USUARIO USUARIO
const user = {
    email: "info@cabanasecosdelvalle.com.ar",
    password: "123"
};

const productToAdd = "64c93e557ba17db5afa18056";
let idCart = '';
const quantitiToAdd = 30;

describe('CartsTest', () => {
    it('CreateCart_Success - POST', async function () {

        this.timeout(5000)
        const userSession = await requestor.post('/api/sessions/login').send(user);

        const { statusCode, _body } = await requestor.post('/api/carts/');

        expect(statusCode).to.be.equal(201) //create Ok
        expect(_body._id).to.be.ok
        /* expect(_body.products).to.be.equal([]) //a la raiz del sitio */
        console.log(_body.products)
        expect(Array.isArray(_body.products)).to.be.true
        idCart = _body._id;
    });

    it('AddProductToCart_Success - POST', async () => {

        const { statusCode, headers, _body } = await requestor.post(`/api/carts/${idCart}/product/${productToAdd}`).send({ quantity: quantitiToAdd });

        expect(statusCode).to.be.equal(202) //add products Ok

    });

    it('GetProductsOfCart_Success - GET', async () => {

        const { statusCode, headers, _body: { status, payload } } = await requestor.get(`/api/carts/${idCart}`);

        expect(status).to.be.equal('success') //get products Ok
        expect(Array.isArray(payload.products)).to.be.true
        expect(payload.products[0].quantity).to.be.equal(30) //verifica que el producto agregado tenga la cantidad afregada conocida
    });

    it('EmptyCart_Success - DELETE', async () => {

        const { statusCode, headers, _body: { status, payload } } = await requestor.delete(`/api/carts/${idCart}`);

        expect(status).to.be.equal('success') //empty cart Ok
        expect(payload.modifiedCount).to.be.equal(1) //verifica haber modificado (eliminado) el producto agregado al carrito
        console.log(JSON.stringify(payload, null, 2))
    });

    it('GetProductsOfCart_Success - GET', async () => {

        const { statusCode, headers, _body } = await requestor.get(`/api/carts/${idCart}`);

        expect(statusCode).to.be.equal(202) //get products Ok
        expect(_body.payload.products.length === 0).to.be.true
        /*  console.log(JSON.stringify(_body.payload.products.length,null,2)) */
        console.log(`El Testing de Carts creo el cart ${idCart}, agrego elproducto ${productToAdd}, leyo el carrito y verificó que el producto este agregado con la cantidad ${quantitiToAdd}, vació el carrito de productos y lo leyo nuevamente. Verificó que la cantidad de productos en el carrito finalmente sea Cero `)

    });

});

