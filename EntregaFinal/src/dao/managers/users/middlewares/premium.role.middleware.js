function isUserPremium(req, res, next) {
    /* const {role} = req.user; */
    const {role} = req.session;
    
        if (role === 'Premium') {
          next();
          return
        }
      
       /*  res.redirect('/'); */
       res.status(404).send({status:404, message: 'Transacción NO Habilitada para Usuarios Administradores'});
      }
      
      module.exports = isUserPremium;
      