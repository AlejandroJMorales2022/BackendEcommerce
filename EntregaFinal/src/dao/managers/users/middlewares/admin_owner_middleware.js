const pM = require('../../products/Product.db.manager');


async function isAdminOrUserOwner(req, res, next) {

  try {

    const { role } = req.session;
    const { pid } = req.params;
    const { email } = req.user;
    const product = await pM.getById(pid)


    if (role === 'Administrador' || product.owner === email) {
      next();
      return;
    }
    // Si ninguno de los dos es verdadero, responde con un error o redirige según tu lógica
    return res.status(403).json({ status: 403, message: 'Acceso denegado, el Usuario debe ser Administrador o Owner' });
  } catch (error) {
    res.status(403).json({
      status: 403,
      message: 'Acceso denegado, el Usuario debe ser Administrador o Owner'
    });
  }

}

module.exports = isAdminOrUserOwner;
