const productsModel = require('../../models/products.modelX');


class ProductManager {

  async getAll() {
    const products = await productsModel.find().lean();

    return products;
  }

  async getById(id) {
    const resultado = await productsModel.find({ _id: id }).lean();

    return resultado[0];
  };

  async create(body) {
    const product = await productsModel.create(body);

    return product;
  }

  async update(id, product) {
    const result = await productsModel.updateOne({ _id: id }, product);

    return result;
  }

  async delete(id) {
    const result = await productsModel.deleteOne({ _id: id });

    return result;
  }





}
module.exports = new ProductManager(); //exporto un Instancia de la clase, de mode que cuando la llame desde cualquier archivo
//siempre sera la misma instancia con el mismo dato. Esto hace que al no tener multiples instancias, ocupemos enos memoria en runtime
/* module.exports = ProductManager; */
/* export default ProductManager */
