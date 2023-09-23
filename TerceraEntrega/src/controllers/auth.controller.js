


const gitHubCallBack = async (req, res) => {
    // se guarda la session del usuario
    const { email } = req.user;

    req.session.save((err) => {
        if (!err) {
            // Almacenar la propiedad role en la sesión
            req.session.role = (email === 'adminCoder@coder.com') ? 'Administrador' : 'Usuario';
            return res.redirect('/');
        }
        console.log(err)
        res.redirect('/login');
    });
}

module.exports = {
    gitHubCallBack
  }