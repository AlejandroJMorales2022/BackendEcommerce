const userManager = require('../../users/user.manager');


async function isAdminOrUserPremium(req, res, next) {
  const {role} = req.session;
    /* const currentUser= await userManager.getByEmail(email);
    console.log(JSON.stringify(currentUser,null,2));
    const role=currentUser.role; */
   /*  const { pid } = req.params;
    const { email } = req.user;   
    const product = await pM.getById(pid) */
       console.log('role ****** '+role)

    if (role === 'Administrador' || role === 'Premium') {
      next();
      return;
    }
    // Si ninguno de los dos es verdadero, responde con un error.
    return res.status(403).json({ status: 403, message: 'Acceso denegado, el Usuario debe ser Administrador o Premium' });
  }
  
module.exports = isAdminOrUserPremium;