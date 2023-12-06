const tokensEmailModel = require('../../models/tokens.email.model');
const BaseManager = require('../base.manager');


class tokensEmailManager extends BaseManager{

    constructor() {
        super(tokensEmailModel);
      }


      async getByEmail(email) {
        const resultado = await this.model.find({ email: email }).lean();

        return resultado[0];
    };
};
module.exports = new tokensEmailManager(); //singleton

