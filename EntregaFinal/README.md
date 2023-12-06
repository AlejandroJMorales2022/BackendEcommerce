<a id=volver><a/>

#### **Proyecto Final Backend - ProductManager - 3° Entrega - Alejandro Javier Morales** - com55225

Tecnologías Utilizadas:

- *Node JS*, implementando un servidor con Express, MongoDB para persistencia de datos en File System y MongoDB, enrutamiento de peticiones http mediante Router, carga de Archivos mediante middleware de tercero Multer, comunicación Servidor <-> Clientes con Websockets y Handlebars como template engine. 
Se incorporo la funcionalidad de Login, utilizando Passport y LocalStrategy, ademas del modelo de Usuarios en MongoDB

ARQUITECTURA DEL SERVIDOR EN CAPAS: Se implemento la separacion en capas del Servidor (capa de Routing, DAO - Managers/Repositories y Models, Controllers) implementando el patron de diseño MVC (Modelo Vista Controlador).

DTO: Se implemento un DTO en DAO/Models/DTO/user.dto.js para extraer la propiedad password del usuario al ser llamado desde la ruta api/sessions/current

FACTORY: Se implemento el patrón de Diseño FACTORY, facilitando el cambio de persistencia pudiendo seleccionar entre FileSystem y Mongo DB a traves de la variable de entorno MANAGER_PERSISTANCE. 
En el archivo package.json, en el objeto scripts se agregaron 2 propiedades start_pf y start_pM.

"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon ./src/server.js",
    "start_pf": "cross-env MANAGER_PERSISTANCE=file nodemon ./src/server.js",
    "start_pm": "cross-env MANAGER_PERSISTANCE=mongo nodemon ./src/server.js",
    "seed:products": "node ./scripts/seed.products.js"
  },

  De este modo, desde la consola podemos iniciar el servidor con persistencia en el FileSystem tipeando: npm run start_pf o en Mongo DB tipeando: npm run start_pm.
  Para incorporar esta funcionalidad se instalo previamente la libreria cross-env.

  TICKETS: se agrego en carts.router.js la ruta api/carts/:cid/purchase que genera un ticket a partir de los productos cargados en el cart :cid.
  Devuelve un objeto con los datos del ticket, los productos comprados, y un array con los productos que, por falta de stock, quedaron pendientes de compra en el cart.
  

  INDICE

  1. [Estructura de Directorios](#item1)

  2. [Rutas para Administrar Productos](#item2)

  3. [Rutas para Administrar Carritos de Compra](#item3)

  4. [Rutas de Vistas (views)](#item4)

  5. [Estructura de Datos](#item5)

  6. [Respuestas del Servidor](#item6)

     

  

  



<a id=item1><a/>

La estructura de directorios fue adaptada a la nueva funcionalidad del proyecto, organizado el contenido de una manera mas ordenada y mantenible:

- **Estructura de Directorios:** Desde la carpeta raíz del proyecto se crearon las siguientes subcarpetas :

  **src**: contiene todo el código y funcionalidad de la aplicación del lado del servidor. Su estructura es la siguiente:

  **dao**: Hace referencia a la capa de acceso a datos (**d**ata **a**ccess **o**bject). Esta carpeta contiene, a su vez, la carpeta **managers** con los archivos que administran el acceso a la base de datos de MongoDB, y la carpeta **model** con los archivos en los que se definen todos los modelos de datos de las colecciones de MondoDB.

  **routes**: en esta carpeta se incluyen la subcarpeta *api* que guarda los archivos products.router.js y carts.router.js en los que se definen las rutas de cada petición http según el estandar apiRest (get, post, put, delete). En la raiz de *routes* el archivo views.router.js es quien define las rutas a las vistas generadas por las plantillas de Handlebars.
  El archivo index,js importa todas las rutas generadas los archivos de la carpeta api y las exporta para que puedan ser llamadas desde el servidor.
  
  **uploads**: en esta carpeta se almacenan los archivos de imagen que se asignan mediante *Multer* a la propiedad *thumbnails* de cada product.
  
  En la Raiz la carpeta *src*, el archivo server.js es en el que se desarrolla el servidor de Express, el cual pondrá a disposición la funcionalidad de la aplicación.
  
  **views**: esta carpeta contiene las plantillas de Handlebars, en las que se visualizarán los resultados de las peticiones http que llegan a routes/views.router.js .
  
  
  






<a id=item2><a/>
- **Rutas para Administrar Productos**

  *GET api/products/* para traer el listado de todos los productos almacenados

  *GET api/products/?page=x&limit=x&query=clave:valor&sort=asc/desc* 
  	
  Todos estos parámetros de "query" condicionan la petición de productos según los siguientes criterios:
  
  *page=x* : indicar qué página de productos mostrar en caso que sean mas de 1.
  *limit=x* : limitar la cantidad de productos a mostrar por página. Si no se especifica se mostrarán 10 productos.
  *query=clave:valor* : mediante este parámetro se podrán realizar búsquedas en la base de datos de productos por las distintas propiedades de dicha colección. En caso de que clave sea stock, se buscarán los productos cuyo stock sea igual o mayor al especificado (stock:5). Para buscar por cualquier otra propiedad, el valor deberá coincidir estrictamente con el almacenado en la base de datos (category:libros o title:cuaderno rayado).
  *sort=asc/desc* : este parámetro permito ordenar en forma ascendente o descendente por price.
  
  *GET api/products/:pid* para traer los datos del producto seleccionado por su id (pid).
  *POST api/products/* esta petición se envía al servidor con un body conteniendo la estructura e información para crear un nuevo producto.
  *DELETE api/products/:pid* esta ruta le indica al servidor eliminar el producto indicado den el parámetro pid.
  
  *PUT api/products/:pid* esta petición solicita modificar un producto existente según el parámetro pid. Además se envía un body con la información que se pretende modificar del producto.
  
  *POST api/products/:pid/upload* esta petición adicional permite asignar un archivo de imagen al producto indicado por el parámetro pid. La misma se conforma también de un body Multipart en el que se indica la ruta del archivo de imagen. Dicho archivo, a través del middleware Multer se cargara y almacenará en la carpeta *src/uploads* de la aplicación. 
  
  
  
  

<a id=item3><a/>

-**Rutas para Administrar Carritos de Compra** 

  *GET api/carts/:cid* esta ruta solicita al servidor el listado de productos contenidos en el cart indicado en el parámetro cid.
  *POST api/carts/* crea un nuevo carro de compras con la estructura por defecto, la misma es un objeto con el id del carrito y una propiedad products que contrendrá un array vacío. {id:x , products: [] }. 
  *PUT api/carts/:cid/product/:pid* esta petición indica al servidor agregar al carrito seleccionado según el parámetro cid el producto indicado por el parámetro pid.  
  En caso que el producto exista en el carrito se debe reemplazar el valor de quantity existente en dich producto por el nuevo.
  *PUT api/carts/:cid* esta petición indica al servidor agregar al carrito seleccionado según el parámetro cid un array de productos products : [{id1:prod1, quantity:10},{id2:prod2, quantity:5}...].
  *DELETE api/carts/:cid/product/:pid* esta petición indica al servidor Eliminar del carrito seleccionado según el parámetro cid el producto indicado por el parámetro pid. 
  *DELETE api/carts/:cid* esta petición indica al servidor Eliminar Todos los productos existentes en el carrito seleccionado según el parámetro cid.  
  *POST api/carts/:cid/purchase* esta petición genera un ticket a partir de los productos cargados en el cart :cid.
  Devuelve un objeto con los datos del ticket, los productos comprados, y un array con los productos que, por falta de stock, quedaron pendientes de compra en el cart. 






<a id=item4><a/>

-**Rutas de Vistas (views)**  Gracias al motor de plantillas de Handlebars, por cada una de las siguientes peticiones se genera una vista en el browser de cada cliente con la información devuelta por el servidor.

*GET /?page=x&limit=x&query=clave:valor&sort=asc/desc*  esta ruta solicita al servidor el listado de productos. Los parámetros configuran la búsqueda de los mismos con idénticos criterios que con la misma petición del formato API-REST mencionado más arriba. Esta vista trabaja con websockets, por lo que, en caso de que varios clientes estén accediendo a la misma simultáneamente, las modificaciones que se realicen a cualquiera de las propiedades de los productos, se verán reflejadas en tiempo real.

 *GET /carts/:cid* esta ruta solicita al servidor el listado de productos contenidos en el cart indicado en el parámetro cid.






  <a id=item5><a/>

-**Estructura de Datos**

  Los **products** tendrán la siguiente estructura
  {
  		 "title": string,
          "description": string,
          "code": string,
          "price": number,
          "status": boolean (true por defecto),
          "stock": number,
          "category": string ,
          "thumbnails": [array de string]
  }

  <u>Nota:</u> Todas las propiedades de product son obligatorias, salvo thumbnails.

  

  Cada **cart** tendrá la siguiente estructura que reporesenta un objeto con el id del carrito y una propiedad products que en principio será un array vacío y que alojará objetos product cada uno de ellos con su identificacion (id) y cantidad (quantity).

  {
  "id": x,
  products: [{ id:x1, quantity:x },{ id:x2, quantity:x },{ id:xn, quantity:x }]

  }

  


<a id=item6><a/>

-**Respuestas del Servidor**

  <u>**GET /api/products/** devuelve el listado de productos</u>
  [
  {
    ...product 1
  },
  {
  ...product n
  }
  ]

  

  <u>**POST api/products** devuelve un objeto con el siguiente formato:</u>

  {
  "status":"success",
  "statusNumber": 200
  "message": El Producto ha sido Agregado Correctamente...",
  "payload":[ {
  		"title": "titulo",
  		"description": "detalle",
  		"code": "codigo",
  		"price": 220,
  		"status": true,
  		"stock": 230,
  		"category": "categoria",
  		"thumbnails": "",
  		"id": 1
  	},
		{
		...product n

		}],
  "totalPages": 1,
  "prevPage": null,
  "nextPage": null,
  "page": 1,
  "hasNextPage": false,
  "prevLink": null,
  "nextLink": null,
  "startLink": null,
  "endLink": null
	 }


​		-<u>**PUT api/products/pid** devuelve un objeto con el siguiente formato:</u>

​		{
​			"status": "success",
​			"statusNumber": 200,
​			"message": "El Producto ${pid} ha sido Modificado correctamente..."
​		}



​		-<u>**DELETE api/products/:pid**** devuelve un objeto con el siguiente formato:</u>

		{
​			"status": "success",
​			"statusNumber": 200,
​			"message": "El Producto con Id ${pid} ha sido Eliminado correctamente..."
​		}



​		-<u>**POST api/carts** devuelve un objeto con el siguiente formato:</u>

​		{
​			"products": [],
​			"id": 1
​		}

​		-<u>**POST api/carts/:cid/products/:pid** devuelve un objeto con el siguiente formato:</u>

		{
​			"status": "success",
​			"statusNumber": 200,
​			"message": "El Producto ha sido Agregado Correctamente al carrito..."


-<u>**POST api/carts/:cid/purchase** devuelve un objeto con el siguiente formato:</u>
    {
      "status": 206,
      "message": "Ticket Generado pero Quedan Productos Pendientes en el Carrito de Compras por Falta de Stock",
      "ticket": {
        "code": "TK-51",
        "purchase_datetime": 1695941845749,
        "amount": 27150,
        "purcharser": "malejandro2002@yahoo.com.ar",
        "_id": "651604d551c11e3b77790272",
        "__v": 0
      },
      "productsInTicket": [
        {
          "_id": "64c93e557ba17db5afa18057",
          "price": 690,
          "quantity": 15
        },
        {
          "_id": "64c93e557ba17db5afa18058",
          "price": 700,
          "quantity": 24
        }
      ],
      "productsInCart": [
        {
          "product": "64cffadd0103524fde1d7639",
          "quantity": 10000,
          "_id": "651604ca51c11e3b7779024b"
        },
        {
          "product": "64c93e557ba17db5afa18056",
          "quantity": 3200,
          "_id": "651604ca51c11e3b7779024e"
        }
      ]
    }
    ​		}

​		-<u>**Errores:** Las respuesta del servidor ante mensajes de error tienen el siguiente formato:</u>

		{
​			"status": "error", 
​			"statusNumber": 404, 
​			"message": "El Producto con Id xx No Existe..."
​		}

​		ó

		{
​			"status": "error", 
​			"statusNumber": 500,
​			"message": "Ha ocurrido un error en el servidor",
​			"exception": "Error: ENOENT: no such file or directory, open 'C:\\Users\\...\\products.json'"
​		}







  [Volver](#volver)

  

  

  

  