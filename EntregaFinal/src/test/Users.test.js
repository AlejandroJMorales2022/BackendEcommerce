const chai = require('chai');
const supertest = require('supertest')

const expect = chai.expect
/* const requestor = supertest('http://localhost:8080'); */
const requestor = supertest.agent('http://localhost:8080')




describe('UserTest', () => {

    const userToRegister = {
        firstname: 'User Tester',
        lastname: 'Supertest',
        age: 50,
        gender:'Male',
        email: "testing@testing.com", //Modificar email en cada prueba ya que el user se crea y queda registrado en la base de datos
        password: "321"
    };
   
        it('UserRegister - POST', async function () {

            this.timeout(5000);

            const { statusCode, headers } = await requestor.post('/api/sessions/signup').send(userToRegister);

            expect(statusCode, headers).to.be.equal(302) //redireccion al registrarse
            expect(headers.location).to.be.equal('/login') //a Login

            console.log(headers)
        });

        it('Login_Ok - POST', async function ()  {

            this.timeout(5000);

            const { statusCode, headers } = await requestor.post('/api/sessions/login')
            .send({
                email: userToRegister.email,
                password: userToRegister.password
            });
            /*  userId=payload._id */

            expect(statusCode).to.be.equal(302) //redireccion al loguearse
            expect(headers.location).to.be.equal('/') //a la raiz del sitio

            console.log(headers)


        });

        it('CurrentUser - GET', async function (){

            this.timeout(5000);

            const {  _body:{status, payload} } = await requestor.get('/api/sessions/current')
            /*  userId=payload._id */

            expect(status).to.be.equal(200) //redireccion al loguearse
            expect(payload.email).to.be.equal(userToRegister.email) //compara el email del usuario a regiatrar con el del Current User
            
            console.log('*** Current User: '+ JSON.stringify(payload,null,2))


        });
})

