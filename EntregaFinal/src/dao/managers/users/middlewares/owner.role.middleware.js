const pM = require('../../products/Product.db.manager');

async function isUserOwner(req, res, next) {
    const { pid } = req.params;
    const { email } = req.user;   
    const product = await pM.getById(pid)
       
     /* console.log(email)
     console.log(JSON.stringify(product,null,2)) */
        if (product.owner === email) {
          next();
          return
        }
      
       /*  res.redirect('/'); */
       res.status(404).send({status:404, message: 'El Usuario No es Owner. TRansaccion Inhabilitada'});
      }
      
      module.exports = isUserOwner;
      