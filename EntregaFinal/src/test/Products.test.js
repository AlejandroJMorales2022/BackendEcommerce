const chai = require('chai');
const supertest = require('supertest')

const expect = chai.expect
/* const requestor = supertest('http://localhost:8080'); */
const requestor = supertest.agent('http://localhost:8080')

//USUARIO PREMIUM
const user = {
            email: "malejandro2002@yahoo.com.ar",
            password: "1234"
        };
//USUARIO USUARIO
/* const user = {
    email: "info@cabanasecosdelvalle.com.ar",
    password: "123"
};*/


describe('ProductTest', () => {

    let id_product = '';
    let price=0;

    it('AddProduct_Success - POST', async function() {

        this.timeout(5000)
        const userSession = await requestor.post('/api/sessions/login').send(user);
        
        const product = {
            title: "Producto Creado en Teting",
            description: "Testing...",
            code: "TE6557",
            price: 999,
            status: true,
            stock: 1,
            category: "Test",
            owner: "malejandro2002@yahoo.com.ar",
            thumbnails: [],
        }
        const { _body: { status, payload } } = await requestor.post('/api/products').send(product);

        
        expect(status).to.be.equal(201)
        expect((typeof payload === 'object')).to.be.true
        id_product = payload._id
        price=payload.price
        /* console.log(JSON.stringify(payload, null, 2)) */
    });


    it('GetProductBy - GET', async () => {

        const { _body: { status, payload } } = await requestor.get(`/api/products/${id_product}`);

        /* idProduct=payload._id */
        expect(status).to.be.equal(200)
        expect((typeof payload === 'object')).to.be.true
        expect(payload.price).to.be.equal(price)
        console.log(JSON.stringify(payload,null,2))
    });

    it('ProductModified - PUT', async () => {

        const product2 = {
            title: "Producto Creado en Teting Modificado",
            description: "Testing...M",
            code: "TEM6557",
            price: 1000,
            status: true,
            stock: 10,
            category: "TestMod",
            owner: "malejandro2002@yahoo.com.ar",
            thumbnails: [],
        }
        const { body: { status, payload } } = await requestor.put(`/api/products/${id_product}`).send(product2);
        expect(status).to.be.equal(202)
        /* expect(payload._id).to.be.deep.equal(id_product) */
        expect(payload.modifiedCount).to.be.equal(1)
        console.log(JSON.stringify(payload,null,2)) 
    });
    it('ProductDeleted - DELETE', async () => {

        const { body: { status, message } } = await requestor.delete(`/api/products/${id_product}`);
        expect(status).to.be.equal(200)
        expect(message).to.be.deep.equal(`El Producto con Id ${id_product} ha sido Eliminado correctamente...`)
        console.log('El Producto: ' + id_product + 'ha sido Creado, Modificado y Eliminado durante el Testing Funcional')
    });

});
