const userManager = require('../dao/managers/users/user.manager')


const createUser = async (req, res) => {
    const { body } =  req;
  
    const created = await userManager.create(body);
  
    res.send(created);
  };


  module.exports = {
    createUser
  }