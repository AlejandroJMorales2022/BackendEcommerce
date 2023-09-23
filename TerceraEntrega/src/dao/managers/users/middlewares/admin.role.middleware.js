function isAdmin(req, res, next) {
/* const {role} = req.user; */
const {role} = req.session;

    if (role === 'Administrador') {
      next();
      return;
    }
  
    /* res.redirect('/'); */
    res.status(404).send({status:404, message: 'Transacción válida sólo para el Administrador'});
  }
  
  module.exports = isAdmin;
  