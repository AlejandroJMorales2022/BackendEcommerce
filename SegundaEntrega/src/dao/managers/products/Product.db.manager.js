const productsModel = require('../../models/products.model');


class ProductManager {

  async getAll() {
    const products = await productsModel.find().lean();
    console.log(products);
    return products;
  }

  async getAllPaged(page = 1, limit = 10, query, sort) {

    console.log('QUERY: ' + query)
    let searchParam = {};
    if (query) { //si solicia algun filtro
      const key = query?.split(':')[0]?.trim()
      const value = query?.split(':')[1]?.trim()
      if (key === 'stock') { //si solicita filtrar por Existencia (stock)
        searchParam = {
          [key]: { $gte: value } //buscara todos los productos con stock >= al valor solicitado
        }
      } else {
        searchParam = { //en al caso que se busque filtrar por otra propiedad (como category)
          [key]: value
        }
      }
      console.log('SEARCH_PARAM:' + searchParam )
      //el formato del string de busqueda esperado es query=propiedad:valor (sin comillas en caso de pasar strings)
    }

      return  await productsModel.paginate(searchParam, { limit: limit, page: page, sort: { price: sort === 'asc' ? 1 : (sort === 'desc' ? -1 : '') }, lean: true });
   
  }



  async getAllPaged2(page = 1, limit = 5, query, sort) {

    let searchParam = {};
    if (query) { //si solicia algun filtro
      const key = query?.split(':')[0]?.trim()
      const value = query?.split(':')[1]?.trim()
      if (key === 'stock') { //si solicita filtrar por Existencia (stock)
        searchParam = {
          [key]: { $gte: value } //buscara todos los productos con stock >= al valor solicitado
        }
      } else {
        searchParam = { //en al caso que se busque filtrar por otra propiedad (como category)
          [key]: value
        }
      }
      //el formato del string de busqueda esperado es query=propiedad:valor (sin comillas en caso de pasar strings)
    }

    if (!sort || sort === '' || sort === undefined) {

      const products = await productsModel.paginate(searchParam, { limit: limit, page: page, lean: true });
      return products
    } else {
      const products = await productsModel.paginate(searchParam, { limit: limit, page: page, sort: { price: sort === 'asc' ? 1 : (sort === 'desc' ? -1 : '') }, lean: true });
      return products
    }
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
