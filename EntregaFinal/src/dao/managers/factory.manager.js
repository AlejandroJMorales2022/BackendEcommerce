//Importo los managers de Persistencia que tengo
//en este caso el de Base de Datos y el de File System
const cartManager = require('../managers/carts/cart.db.manager');
const chatManager = require('../managers/chats/Chat.db.message.manager');
const productManager = require('../managers/products/Product.db.manager');
const ticketManager = require('../managers/tickets/ticket.db.manager');
const userManager = require('../managers/users/user.manager');

const productManagerFS = require('../managers/products/Product.fs.manager');
const cartManagerFS = require('../managers/carts/Cart.fs.manager');

const { PERSISTANCE } = require('../../config/config');

class ManagerFactory {

    static getManagerInstance(name) {
        console.log('Persistencia: ' + PERSISTANCE)
        if (PERSISTANCE == "mongo") {
            //Regreso alguno de los Managers de Mongo BD

            switch (name) {
                case "products":
                    return productManager;
                case "carts":
                    return cartManager;
                case "chatMessages":
                    return chatManager;
                case "tickets":
                    return ticketManager;
                case "users":
                    return userManager;
            }
        } else {
            //Regreso alguno del los managers de FileSystem
            switch (name) {
                case "products":
                    return productManagerFS;
                case "carts":
                    return cartManagerFS;
            }
        }
    }
}
module.exports = ManagerFactory;
//debo ir a importar mi ManagerFactory en mi views.router para poder visualizar
//mis productos segun la modificacion dinamica de la persistencia