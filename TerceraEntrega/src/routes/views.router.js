const { Router } = require("express");
//--------------------------------------------------------------------------------
//modificando la importacion del DAO (MOngoDB o FileSystems cambio de Persistecia)
/* const pM = require('../dao/managers/products/Product.db.manager'); */ //Original
/* const pM = require('../dao/managers/products/Product.fs.manager'); */ //Original
//importo mi ManagerFactory
const ManagerFactory = require('../dao/managers/factory.manager');
//Entonces ahora ya puedo comentar las 2 importaciones de Managers de arriba 
const pM = ManagerFactory.getManagerInstance("products"); //llamo la instancia de Factory pasandole 
//el tipo de persistencia que quiero usar
const cM = ManagerFactory.getManagerInstance("carts");
/* const userManager = ManagerFactory.getManagerInstance("users"); */
//---------------------------------------------------------------------------------
/* const cM = require('../dao/managers/carts/cart.db.manager'); */ //Original
const userManager = require('../dao/managers/users/user.manager'); //Original
const isAuth = require('../dao/managers/users/middlewares/auth.middleware');
const isUser = require('../dao/managers/users/middlewares/user.role.middleware');
const { Session } = require("express-session");
const util = require('util');


const router = Router();


router.get('/chat', isUser, (req, res) => {
    const { user } = req;

    res.render('chat', {
        chat: true,
        style: 'style',
        js: 'chat',
        title: 'CHAT',
        user: user ? {
            ...user,
            logged: true,
            role: req.session.role,
            /* (req.session.user.email === 'adminCoder@coder.com' && req.session.user.password === 'Cod3r123') ? 'Administrador' : 'Usuario', */
            isAdmin: (req.session?.role === 'Administrador') ? true : false
        } : null,
    });
});


router.get('/', isAuth, async (req, res) => {
    const { page, limit, query, sort } = req.query;
    const protocol = req.protocol;
    const host = req.get('host');
    try {
        const { docs: products, ...pageInfo } = await pM.getAllPaged(page, limit, query, sort);

        pageInfo.prevLink = pageInfo.hasPrevPage ? `${protocol}://${host}/?page=${pageInfo.prevPage}&limit=${!limit ? 10 : limit}${query ? `&query=${query}` : ''}${sort ? `&sort=${sort}` : ''}` : null;
        pageInfo.nextLink = pageInfo.hasNextPage ? `${protocol}://${host}/?page=${pageInfo.nextPage}&limit=${!limit ? 10 : limit}${query ? `&query=${query}` : ''}${sort ? `&sort=${sort}` : ''}` : null;
        pageInfo.startLink = pageInfo.totalPages >= 2 ? `${protocol}://${host}/?page=1&limit=${!limit ? 10 : limit}${query ? `&query=${query}` : ''}${sort ? `&sort=${sort}` : ''}` : null;
        pageInfo.endLink = pageInfo.totalPages >= 2 ? `${protocol}://${host}/?page=${pageInfo.totalPages}&limit=${!limit ? 10 : limit}${query ? `&query=${query}` : ''}${sort ? `&sort=${sort}` : ''}` : null;

        req.session.homeCount = (req.session.homeCount || 0) + 1;
        const { user } = req;

        if (products) {
            res.render('home', {
                products: products,
                pageInfo,
                title: 'Listado de Productos',
                realtimeProducts: true,
                style: 'style',
                js: 'realtimeproducts',
                user: user ? {
                    ...user,
                    logged: true,
                    role: req.session.role,
                    /* (req.session.user.email === 'adminCoder@coder.com' && req.session.user.password === 'Cod3r123') ? 'Administrador' : 'Usuario', */
                    isAdmin: (req.session?.role === 'Administrador') ? true : false
                } : null,
            });

        };
    } catch (e) {
        res.status(500).send({
            status: 'error',
            statusNumber: 500,
            message: "Ha ocurrido un error en el servidor",
            exception: e.stack
        });
        console.log('Error: ' + e);
    };
});



router.get('/carts/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        if (cid) {
            const cart = await cM.getById(cid);
            if (!cart) {
                res.status(404).send({
                    status: 'error',
                    statusNumber: 404,
                    message: `El Cart con Id:${cid} No Existe...`
                });
                console.log('El Cart no Existe...');
                return;
            }
            let products = [];
            cart.products.forEach(prod => (
                products.push({                 //cargo el array products con las propiedades y formato adecuado para renderizar en la plantilla
                    _id: prod.product._id,
                    title: prod.product.title,
                    description: prod.product.description,
                    code: prod.product.code,
                    price: prod.product.price,
                    status: prod.product.status,
                    stock: prod.product.stock,
                    category: prod.product.category,
                    thumbnails: prod.product.thumbnails,
                    quantity: prod.quantity
                })
            ));
            res.render('cartproducts', {
                products: products,
                title: 'Carrito de Compras',
                realtimeProducts: false,
                style: 'style',
                cartId: cart._id
            });
        };
    } catch (e) {
        res.status(500).send({
            status: 'error',
            statusNumber: 500,
            message: "Ha ocurrido un error en el servidor",
            exception: e.stack
        });
        console.log('Error: ' + e);
    };
});

router.get('/profile', isAuth, (req, res) => {

    const { user } = req;

    res.render('profile', {
        user: user ? {
            ...user,
            logged: true,
            role: req.session.role,
            /* (req.session.user.email === 'adminCoder@coder.com' && req.session.user.password === 'Cod3r123') ? 'Administrador' : 'Usuario', */
            isAdmin: (req.session?.role === 'Administrador') ? true : false
        } : null,
        style: 'style',
    })
})

router.get('/signup', (_, res) => res.render('signup', {
    style: 'style',
    signup: true,
    js: 'signup'
}))


router.get('/login', (req, res) => res.render('login', {
    login: true,
    style: 'style',
    js: 'login'
}))


router.get('/logout', isAuth, (req, res) => {
    const { user } = req;

    req.logOut((err) => {
        if (!err) {
            res.render('logout', {
                user: ` ${user.firstname}`,
                logged: false,
                style: 'style'

            });
        };
    });
});

router.get('/user-data', (req, res) => {
    /*  console.log(util.inspect(req, { showHidden: false, depth: null })); */
    const { user } = req;


    if (user) {
        res.json({ usuario: user.email });
    } else {
        res.redirect('/');
    }
});

router.get('/administracion', (req, res) => {
    const { user } = req;

    res.render('administracion', {
        user: user ? {
            ...user,
            logged: true,
            role: req.session.role,
            isAdmin: (req.session?.role === 'Administrador') ? true : false
        } : null,
        title: 'Pantalla de Administración',
        style: 'style'
    })
})

//admin
router.get('/admin', (req, res, next) => {

    const { email } = req.body
    console.log(req.body)
    res.render('adminUsersList', {
        user: {
            firstname: email,
            logged: true,
        },

        adminView: true,
        style: 'style',
        js: 'adminview',
        title: 'Autenticado con JWT'

    })
})



module.exports = router;