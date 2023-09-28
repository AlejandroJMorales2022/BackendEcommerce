const ticketsModel = require('../../models/tickets.model');
const BaseManager = require('../base.manager');


class ticketsManager extends BaseManager{

    constructor() {
        super(ticketsModel);
      }

    /* async getAll() {
        const products = await ticketsModel.find().lean();
        return products;
    }; */

    /* async getById(id) {
        const resultado = await ticketsModel.find({ _id: id }).lean();

        return resultado[0];
    }; */

    /* async create(body) {
        const ticket = await ticketsModel.create(body);

        return ticket;
    }; */

    /* async update(id, ticket) {
        const result = await ticketsModel.updateOne({ _id: id }, ticket);

        return result;
    }; */

    /* async delete(id) {
        const result = await ticketsModel.deleteOne({ _id: id });

        return result;
    }; */
};
module.exports = new ticketsManager(); //singleton

