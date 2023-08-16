<a id=volver><a/>

#### **Proyecto Final Backend - ProductManager - 1° Entrega - Alejandro Javier Morales** - com55225

Tecnologías Utilizadas:

- *Node JS*, implementando un servidor con Express, persistencia de datos en archivos utilizado File System de Node, enrutamiento de peticiones http mediante Router y carga de Archivos mediante middleware de tercero Multer.

  

  INDICE

  1. [Estructura de Directorios](#item1)

  2. [Rutas para Administrar Productos](#item2)

  3. [Rutas para Administrar Carritos de Compra](#item3)

  4. [Estructura de Datos](#item4)

  5. [Respuestas del Servidor](#item5)

     

  

  



<a id=item1><a/>
- **Estructura de Directorios:** Desde la carpeta raíz del proyecto se crearon las siguientes subcarpetas :

  **data**: contiene los archivos products.json y carts.json en los que se almacenarán los productos y carts con productos respectivamente. Mediante estos archivos se administra la persistencia de datos de la aplicación .

  **managers**: esta carpeta contiene los archivos ProductManajer.js y CartManager.js que contienen la declaración de las clases del mismo nombre, en las que se programa la lógica de manejo de cruds tanto de products como de carts y el acces y almacenamiento de datos mediante el File System de Node.

  **routes**: en esta carpeta se incluyen la subcarpeta *api* que guarda los archivos products.router.js y carts.router.js en los que se definen las rutas de cada petición http (get, post,put, delete). En la raiz de routes, el archivo index,js importa todas las rutas generadas los archivos de la carpeta api y las exporta para que puedan ser llamadas desde el servidor.

  **public**: esta carpeta contiene, por el momento u a subcarpeta *uploads* en las que se almacenan los archivos de imagen que se asignan mediante *Multer* a la propiedad *thumbnails* de cada product.

  En la Raiz de la aplicación, el archivo server.js es en el que se desarrolla el servidor de Express, el cual pondrá a disposición la funcionalidad de la aplicación.

  

  <u>Nota</u>: A modo de ejemplo y para entender como se genera el enrutamiento podemos decir lo siguiente: Router de Node permite generar las rutas de cada petición http, en este caso, según la estructura de este proyecto, una petición GET se conforma de la siguiente manera:

  **GET:** 
  *router.get('/', async (req, res) => {...}* es la ruta raíz (en product.router.js)
  *router.use('/products', ProductRouter)* es la ruta que indica que peticionamos productos (en index.js)
  *app.use('/api',api)* es la ruta que define la estructura final de la misma según el estandard Rest.
  De esta forma y leyendo de final a principio podemos entender como la ruta con la que estamos ejemplificando la petición Get para leer productos quedaría: "**api/products/**"






<a id=item2><a/>
- **Rutas para Administrar Productos**

  *GET api/products/* para traer el listado de todos los productos almacenados

  *GET api/products/?limit=x* para limitar la lista a "x" productos
  *GET api/products/:pid* para traer los datos del producto seleccionado por su id (pid).
  *POST api/products/* esta petición se envía al servidor con un body conteniendo la estructura e información para crear un nuevo producto.
  *DELETE api/products/:pid* esta ruta le indica al servidor eliminar el producto indicado den el parámetro pid.
  
  *PUT api/products/:pid* esta petición solicita modificar un producto existente según el parámetro pid. Además se envía un body con la información que se pretende modificar del producto.
  
  *POST api/products/:pid/upload* esta petición adicional permite asignar un archivo de imagen al producto indicado por el parámetro pid. La misma se conforma también de un body Multipart en el que se indica la ruta del archivo de imagen. Dicho archivo, a través del middleware Multer se cargara y almacenará en la carpeta public/uploads de la aplicación. 
  
  
  
  

<a id=item3><a/>

-**Rutas para Administrar Carritos de Compra** 

  *GET api/carts/:cid* esta ruta solicita al servidor el listado de productos contenidos en el cart indicado en el parámetro cid.
  *POST api/carts/* crea un nuevo carro de compras con la estructura por defecto, la misma es un objeto con el id del carrito y una propiedad products que contrendrá un array vacío. {id:x , products: [] }. 
  *POST api/carts/:cid/product/:pid* esta petición indica al servidor agregar al carrito seleccionado según el parámetro cid el producto indicado por el parámetro pid.  
  En caso que el producto exista en el carrito se debe incrementar en 1 el valor de qty existente en dich producto.



  <a id=item4><a/>

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

  

  Cada **cart** tendrá la siguiente estructura que reporesenta un objeto con el id del carrito y una propiedad products que en principio será un array vacío y que alojará objetos product cada uno de ellos con su identificacion (id) y cantidad (qty).

  {
  "id": x,
  products: [{ id:x1, qty:x },{ id:x2, qty:x },{ id:xn, qty:x }]

  }

  


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
  "status":201,
  "message": El Producto ha sido Agregado Correctamente...",
  "payload": {
  		"title": "titulo",
  		"description": "detalle",
  		"code": "codigo",
  		"price": 220,
  		"status": true,
  		"stock": 230,
  		"category": "categoria",
  		"thumbnails": "",
  		"id": 1
  	}

  }

  

​		-<u>**PUT api/products/pid** devuelve un objeto con el siguiente formato:</u>

​		{
​			"status": 202,
​			"message": "El Producto ${pid} ha sido Modificado correctamente..."
​		}



​		-<u>**DELETE api/products/:pid**** devuelve un objeto con el siguiente formato:</u>

​		{
​			"status": 200,
​			"message": "El Producto con Id ${pid} ha sido Eliminado correctamente..."
​		}



​		-<u>**POST api/carts** devuelve un objeto con el siguiente formato:</u>

​		{
​			"products": [],
​			"id": 1
​		}

​		-<u>**POST api/carts/:cid/products/:pid** devuelve un objeto con el siguiente formato:</u>

​		{
​			"status": 202,
​			"message": "El Producto ha sido Agregado Correctamente al carrito..."
​		}

​		-<u>**Errores:** Las respuesta del servidor ante mensajes de error tienen el siguiente formato:</u>

​		{
​			"status": 404,
​			"message": "El Producto con Id xx No Existe..."
​		}

​		ó

​		{
​			"status": 500,
​			"message": "Ha ocurrido un error en el servidor",
​			"exception": "Error: ENOENT: no such file or directory, open 'C:\\Users\\...\\products.json'"
​		}







  [Volver](#volver)

  

  

  

  