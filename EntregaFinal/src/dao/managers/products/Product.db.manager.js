//Products Repository
const productsModel = require('../../models/products.model');
const BaseManager = require('../base.manager');
const {generateProducts} = require('../../../utils/mock.utils');

class ProductManager extends BaseManager { //Hereda todos los metodos de la clase Base

  constructor() {
    super(productsModel);
  }

  //Hereddo de Clase Base async getAll() {

  getMockProducts(){
    return generateProducts();
}
    
}
module.exports = new ProductManager(); //exporto un Instancia de la clase, de modo que cuando la llame desde cualquier archivo
//siempre sera la misma instancia con el mismo dato. Esto hace que al no tener multiples instancias, ocupemos menos memoria en runtime
/* module.exports = ProductManager; */
/* export default ProductManager */
