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
const getProdQty = require('../utils/getProdQtyInCart');
const isValidToken = require('../middlewares/validation_token.middleware');


const router = Router();

router.get('/restartpass', isValidToken, (req, res) => {
    const { user } = req;

    res.render('pass_restart', {
        style: 'style',
        title: 'Restablecer Contraseña',
        user: user ? {
            ...user,
            logged: true,
            role: req.session.role,
            /* (req.session.user.email === 'adminCoder@coder.com' && req.session.user.password === 'Cod3r123') ? 'Administrador' : 'Usuario', */
            isAdmin: (req.session?.role === 'Administrador') ? true : false
        } : null,
    });
});

router.get('/chat', isUser, async (req, res) => {
    const { user } = req;
    let prodQty = 0;
    prodQty = await getProdQty(user._id);
    res.render('chat', {
        chat: true,
        style: 'style',
        js: 'chat',
        title: 'CHAT',
        prodQty: prodQty,
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
        let prodQty = 0;
        prodQty = await getProdQty(user._id);
        /* console.log(prodQty) */
        if (products) {
            res.render('home', {
                products: products,
                pageInfo,
                title: 'Listado de Productos',
                realtimeProducts: true,
                style: 'style',
                js: 'realtimeproducts',
                prodQty: prodQty,
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
    const { user } = req;
    try {
        let prodQty = 0;
        prodQty = await getProdQty(user._id);
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
            let totalCart = 0;
            let totalProducts = 0;
            for (const prod of cart.products) {
                // get product by id
                let getedProduct = await pM.getById(prod.product);
                /* console.log(getedProduct) */
                totalCart += getedProduct.price * prod.quantity;
                totalProducts += prod.quantity;
                products.push({
                    _id: prod.product._id,
                    title: getedProduct.title,
                    description: getedProduct.description,
                    code: getedProduct.code,
                    price: getedProduct.price,
                    status: getedProduct.status,
                    stock: getedProduct.stock,
                    category: getedProduct.category,
                    thumbnails: getedProduct.thumbnails,
                    quantity: prod.quantity
                });
            }
            res.render('cartproducts', {
                products: products,
                title: 'Carrito de Compras',
                realtimeProducts: true,
                style: 'style',
                js: 'realtimeproducts',
                prodQty: prodQty,
                cartId: cart._id,
                totalAmount: totalCart,
                totalProducts: totalProducts,
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


router.get('/ticket/:tid', async (req, res) => {
    const { tid } = req.params;
    const { user } = req;
    try {
        let prodQty = 0;
        prodQty = await getProdQty(user._id);
        if (tid) {
            const ticket = await cM.getTicket(tid);
            if (!ticket) {
                res.status(404).send({
                    status: 'error',
                    statusNumber: 404,
                    message: `El Ticket con Id:${tid} No Existe...`
                });
                console.log('El Ticket no Existe...');
                return;
            }
            const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
            const purchaseDate = new Date(Number(ticket.purchase_datetime));
            res.render('ticket', {
                thumbnails: "../../uploads/online-shop.png",
                title: 'Compra realizada con éxito!',
                realtimeProducts: true,
                style: 'style',
                js: 'realtimeproducts',
                prodQty: prodQty,
                ticketDate: purchaseDate.toLocaleDateString('es-ES', dateOptions),
                ticketId: ticket._id,
                ticketCode: ticket.code,
                ticketPurcharser: ticket.purcharser,
                ticketAmount: ticket.amount,
                /* totalProducts: totalProducts, */
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


router.get('/profile', isAuth, async (req, res) => {
    const { user } = req;
    let prodQty = 0;
    prodQty = await getProdQty(user._id);

    res.render('profile', {
        prodQty: prodQty,
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
    /* console.log(req.body) */
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

//istado de usuarios
router.get('/users', async (req, res, next) => {
    const { user } = req;
    let dtoUsers = [];
    try {
        const users = await userManager.getUsers();
        /* let dayDiff = 0; */
        /* console.log(users) */
        for (const user of users) {
            const options = {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false, // Si prefieres formato de 24 horas
            };
        
            const formattedDate = new Date(user.last_connection).toLocaleDateString('es-ES', options);

            dtoUsers.push({
                _id: user._id,
                firstName: user.firstname,
                lastname: user.lastname,
                email: user.email,
                role: user.role,
                lastConnection: formattedDate,
            });
        }
        /* res.send({ usersToDelete: dtoUsers }); */
    } catch (err) {
        res.send({
            status: 500,
            message: err
        })
    }
    res.render('users', {
        users: dtoUsers,
        realtimeProducts: true,
        adminView: false,
        style: 'style',
        js: 'realtimeProducts',
        title: 'Usuarios Registrados',
        user: user ? {
            ...user,
            logged: true,
            role: req.session.role,
            /* (req.session.user.email === 'adminCoder@coder.com' && req.session.user.password === 'Cod3r123') ? 'Administrador' : 'Usuario', */
            isAdmin: (req.session?.role === 'Administrador') ? true : false
        } : null,

    })
})



module.exports = router;