const userModel = require('../../models/user.model');
const BaseManager = require('../base.manager');


class UserManager extends BaseManager {

  constructor() {
    super(userModel);
  }
  
//GetAll, Delete y Create se heredan de clase base.
//GetById tambien pero se sobreecribe porque en necesario popular y el metodo de la case base no lo hace
  getById(id) {
    const user = userModel.findOne({ _id: id })
      .populate({ path: 'cart', populate: { path: 'products.product', select: 'title description price' } })
      .lean();
    return user;
  }

  getByEmail(email) {
    const user = userModel.findOne({ email }).lean();
    return user;
  }


  async save(id, user) {
    const existing = await this.getById(id);

    if (!existing) {
      return;
    }

    const {
      email,
      firstname,
      lastname,
      username,
      gender,
      age
    } = user

    existing.email = email
    existing.firstname = firstname
    existing.lastname = lastname
    existing.username = username
    existing.gender = gender
    existing.age = age

    await existing.updateOne({ _id, existing: _id }, existing);
  }

  
}

module.exports = new UserManager();