<a id=volver><a/>

#### **Curso Backend - Entrega Desafío Nro4 -  Alejandro Javier Morales** - com55225

Pare este entrega se modifico la persistencia de datos, de modo que ahora trabajamos con Mongo DB, más precisamente con Mongo Atlas.
La base de datos ecommerce posee las siguientes colecciones:
-products: contiene los productos segun la estructura de propiedades que venimos trabajando.
-carts: carritos de compra con los productos correspondientes (pueden o no contener productos )
-messages: contiene los mensajes del chat de la aplicacion 

Se agregó la vista chat.handlebars a traves de la cual se implementa una aplicación de Chat.
Se implementó, también, una barra de navegación en todas las vistas, la cual permite navegar hacia el Home, RealTimeProducts y Chat.

Para la actuaización y visualización en tiempo real de productos, la aplicación realiza las peticiones via Insomnia o Postman trabajando del lado del servidor.
De modo que en cada una de las rutas POST, PUT y DELETE del products.router.js se ejecuta un emit via websocket que da aviso desde el servidor a cada cliente conectado, actualizando los resultados en tiempo real en cada uno de ellos

********
//websockets
const io = req.app.get('socketio');
// Emitir evento 'update_products' a todos los clientes conectados
io.emit('update_products', {id:0, msg:'Se Agregó un Producto a la base de datos'});
********

Rutas:

http://localhost:8080/
Esta ruta apunta a la peticion GET http que trae la lista de productos existente.

http://localhost:8080/realtimeproducts
Esta ruta apunta a la petición via websocket que trae la lista de productos y que se actualiza en tiempo real


Algunas propiedades como 'status' y 'category' están hardcodeadas y 'thumbnails' se crea como un array vacio ([]).
Luego para poder asignar una imagen al producto se hace a través de la petición POST http://localhost:8080/api/products/:pid/upload la cual debe tener un body Multipart con el archivo a cargar (desde Insomnia o Postman).
Las imágenes se cargan en la carpeta 'uploads' del servidor.

http://localhost:8080/chat
En esta ruta se accede al chat. En pricipio se solicita el ingreso de una direccion de correo electronico para ingresar.
Habiendo varios clientes conectados, via websockets todos serán notificados de cada acceso al chat o salida del mismo, como asi también de cada mesaje enviado por cualquiera de tales clientes.