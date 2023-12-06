const userModel = require('../../models/user.model');
const BaseManager = require('../base.manager');
const utilpass = require('../../../utils/password.utils');

class UserManager extends BaseManager {

  constructor() {
    super(userModel);
  }

  //GetAll, Delete y Create se heredan de clase base.
  //GetById tambien pero se sobreecribe porque en necesario popular y el metodo de la case base no lo hace
 
  getUsers() {
    let dtoUsers={};
    const users = userModel.find()
      .lean();
      
    return users;
  }


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
 
/*  async deleteById (id) {
    try {
        const result = await userModel.deleteOne({ _id: id });
        if (result.deletedCount === 1) {
            console.log(`Usuario con ID ${id} eliminado exitosamente.`);
            return true;
        } else {
            console.log(`No se encontró ningún usuario con ID ${id}.`);
            return false;
        }
    } catch (error) {
        console.error(`Error al intentar eliminar el usuario: ${error}`);
        throw error;
    }
} */

  async saveCart(id_cart, id_user) {
    try {
      console.log('USUARIO: ' + id_user);
      const existing = await this.getById(id_user);

      if (!existing) {
        return;
      }

      const updatedUser = { ...existing, cart: id_cart };

      await userModel.updateOne({ _id: id_user }, updatedUser);
    } catch (error) {
      console.error('Error al guardar carrito:', error);
      // Aquí podrías enviar una respuesta de error si es necesario.
      throw error;
    }
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

  async updatePass(id, pass) {
    try {
      const userExisting = await this.getById(id);

      if (!userExisting) {
        return;
      }
      const newPass = utilpass.hashPassword(pass);
      await userModel.updateOne({ _id: id }, { $set: { password: newPass } });
    } catch (error) {
      console.log('Manager ' + error)
      res.status(500).send({
        status: 500,
        message: error,
      });
    }
  }

}

module.exports = new UserManager();