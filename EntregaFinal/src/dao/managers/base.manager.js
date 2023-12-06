class BaseManager {

    //mediante el parametro model (de nobre generico) permite llamar al los métodos desde cualquier modelo
    //products, carts, tickets, etc... usando todos las misma clase conlos mismos métdos que tienen en comun.
    constructor(model) {
        this.model = model;
    }

    async getAll() {
        return this.model.find().lean();
    }

    async getAllPaged(page = 1, limit = 10, query, sort) {
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
            };
            //el formato del string de busqueda esperado es query=propiedad:valor (sin comillas en caso de pasar strings)
        };
        return await this.model.paginate(searchParam, { limit: limit, page: page, sort: { price: sort === 'asc' ? 1 : (sort === 'desc' ? -1 : '') }, lean: true });
    };


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
            const filtered = await model.paginate(searchParam, { limit: limit, page: page, lean: true });
            return filtered;
        } else {
            const filtered = await this.model.paginate(searchParam, { limit: limit, page: page, sort: { price: sort === 'asc' ? 1 : (sort === 'desc' ? -1 : '') }, lean: true });
            return filtered;
        }
    }


    async getById(id) {
        const resultado = await this.model.find({ _id: id }).lean();

        return resultado[0];
    };

    async create(body) {
        const product = await this.model.create(body);

        return product;
    }

    async update(id, entity) {
        
        const result = await this.model.updateOne({ _id: id }, entity);

        return result;
    }

    async delete(id) {
        const result = await this.model.deleteOne({ _id: id });

        return result;
    }


}
module.exports = BaseManager;
