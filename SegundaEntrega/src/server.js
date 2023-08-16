
//IIFE Inmediate Funtion Expression// para poder trabajar con el await ya que mongoDB devuelve una promesa y
//poder poner el async
//se hace una funcion IIFE y se coloca todo el codigo del servidor dentro de la misma.
//las importacones antes del await y todas las declaraciones luego del await 
//Primero conectar la Base de Datos y Luego levantar e Servidor
//**** (async funtion main(){})() **** o arrow function)
(async () => {
    const path = require('path');
    const http = require('http');

    const express = require('express');
    const handlebars = require('express-handlebars');
    const { Server } = require('socket.io');
    const mongoose = require('mongoose');
    const chatMessageManager = require('../src/dao/managers/chats/Chat.db.message.manager');

    const { api, views } = require('../src/routes/index')
    let userOnline = [];

    try {
        await mongoose.connect("mongodb+srv://ecommerce:Cd8G9fga1N6MD3hK@cluster0.ewuqtys.mongodb.net/ecommerce?retryWrites=true&w=majority")
        //connection strings CartCoder data base:   mongodb+srv://javier:<password>@cluster0.ewuqtys.mongodb.net/?retryWrites=true&w=majority
        console.log('Conectado a la Base de Datos de MongoDB')

        const app = express();
        app.use(express.urlencoded({ extended: true })); //middleware que parsea body y query params
        app.use(express.json()); //middleware que parsea el body (JSON)

        /* app.use(express.static(path.join(__dirname,'public'))); */
        app.use('/client', express.static(path.join(__dirname, '../client/public')));
        app.use('/uploads', express.static(path.join(__dirname, '../src/uploads')));//Ruta que indica donde se guardan las imagenes de los productos en en lado del servidor

        //routers
        app.use('/api', api);
        app.use('/', views);

        //Uploading Server
        const port = 8080;
        const httpServer = app.listen(port, () => {
            console.log(`Express Server Listening on Port ${port}...`);
        });


        //configuraciones de Template Engine
        app.engine('handlebars', handlebars.engine());
        app.set('views', path.join(__dirname + '/views'));
        app.set('view engine', 'handlebars');

        //SocketServer
        const socketServer = new Server(httpServer); //servidor para trabajar con socket (io)
        // Asignar la instancia de Socket.IO a una propiedad personalizada en el objeto 'app'
        app.set('socketio', socketServer);//esta me permite llamarla desde las rutas POST y PUT para que
        //al  modificar algun producto pueda avisar al Servidor y este a todos los clientes conectados (y actualizar todas las vistas en "tiempo real")

        const chat = [];

        socketServer.on('connection', async socket => { //listening "connection" event from a client
            console.log(`Nuevo Cliente Conectado - Socket -> ${socket.id}`);

            socket.on('msg_realtime', data => { //listening "msg_realtime" event from a client
                console.log('Detalle de Productos en Tiempo Real: ' + data)
            })

            //chat
            /// logica de mensajes
            // obtener todos los mensajes de la base de datos
            let messages = ''
            messages = await chatMessageManager.getAll()
            socket.emit('chat-messages', messages)

            socket.on('chat-message', async (msg) => {
                // guardar el mensaje en la DB
                console.log(msg);
                await chatMessageManager.create(msg);
                socket.broadcast.emit('chat-message', msg);
            })
            socket.on('user', ({ user, action }) => {
                    userOnline[socket.id] = user;
                        socket.broadcast.emit('user', { user, action });
                //interactuar con el modelo de usuario
            })
            socket.on('disconnect', () => {
                socket.broadcast.emit('user', {
                    user: userOnline[socket.id],
                    action: false
                    // interactuar con el modelo de usuario
                })

                delete userOnline[socket.id] // como borrar la propiedad del objeto
            })

        })

    } catch (error) {
        console.log('ERROR: ' + error)
    }
})()








