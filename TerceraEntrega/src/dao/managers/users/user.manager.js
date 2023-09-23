const userModel = require('../../models/user.model')

class UserManager {

  async getAll() {
    return userModel.find({}).lean()
  }

  getById(id) {
    const user = userModel.findOne({ _id: id })
      .populate({ path: 'cart', populate: { path: 'products.product', select: 'title description price' } })
      .lean()
    return user;
  }

  getByEmail(email) {
    const user = userModel.findOne({ email }).lean()
    return user
  }

  create(user) {
    return userModel.create(user)
  }

  async save(id, user) {
    const existing = await this.getById(id)

    if (!existing) {
      return
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

    await existing.updateOne({ _id, existing: _id }, existing)
  }

  async delete(id) {
    const existing = await this.getById(id)

    if (!existing) {
      return
    }

    /// operadores

    await userModel.deleteOne({ _id: id })
  }
}

module.exports = new UserManager()
