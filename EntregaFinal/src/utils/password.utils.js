const bcrypt = require('bcrypt');

//Genera el hasshing del password (encriptacion Irreversible) 
const hashPassword = (password)=>{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

//Compara el password gusrdado con el ingresado por el usuario
const isValidPassword = (pw1, pw2)=>{//pw1 es el passwor ingesado por el usuario en el login, pw2 es el password hassheado ya guardado en la BD
    return bcrypt.compareSync(pw1,pw2);
};

module.exports = { hashPassword, isValidPassword };