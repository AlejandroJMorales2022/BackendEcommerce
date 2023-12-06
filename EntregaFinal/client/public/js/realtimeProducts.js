//js usado por las plantilla sde handlebars


const socket = io(); //levantamos socket del lado del cliente


/* console.log('Hola desde realtime Products'); */
socket.emit('msg_realtime', 'Hola Me estoy comunicando desde el websocket de realtimePoducts');

socket.on('update_products', data => {
    console.log(`Producto ${data.id} - ${data.msg}`);
    //actualizar listado de productos
    location.reload();
});


const addProduct = async (cart, id_product, quantity) => {
    /* console.log(cart, id_product, quantity) */
    try {

        //verificar si el rpoducto exsite,
        //si existe, modificar la cantidad,
        //si no existe agregarlo tal cual viene
        const response = await fetch(`http://localhost:8080/api/carts/${cart}/product/${id_product}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ quantity: quantity }),
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        const data = await response.json();
        console.log("Producto agregado" + JSON.stringify(data, null, 2));
        return data;  // Retornar el objeto data, o podrías retornar solo data.cart_id si es lo que necesitas

    } catch (error) {
        console.error('Error al agregar el producto al carrito de compras:', error.message);
        throw error;
    }
}


const createCart = async (user_id) => {
    try {
        const response = await fetch('http://localhost:8080/api/carts/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        const data = await response.json();
        console.log("Cart Creado " + JSON.stringify(data, null, 2));
        return data;  // Retornar el objeto data, o podrías retornar solo data.cart_id si es lo que necesitas
    } catch (error) {
        console.error('Error al crear carrito de compras:', error.message);
        throw error;
    }
}


const addProductToCart = (user, product_id, quantity) => {
    fetch('http://localhost:8080/api/sessions/current', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // Agrega cualquier otra cabecera que puedas necesitar, como token de autenticación, etc.
        },
    })
        .then(response => {
            // Verifica si la respuesta es exitosa (código de estado 200-299)
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status}`);
            }

            // Parsea la respuesta JSON
            return response.json();
        })
        .then(async data => {
            let cart = {}
            // Maneja los datos obtenidos en la respuesta
            /* console.log('DATA '+ JSON.stringify(data,null,2))
            console.log(data.payload._id) */
            if (!data.payload.cart?._id) {
                console.log("el usuario no tiene Cart asociado")

                //agregar un Cart asociado al User (primero dar de alta un cart, y luego guardar en el user el id del nuevo cart)
                const resp = await createCart(data.payload._id)
                cart = resp.payload;
                //si el carrito se creo Ok,  agregar el producto
                console.log('Respuesta de createCart:' + JSON.stringify(resp, null, 2))
            } else {
                //cargar en el carrito asociado el producto y la cantidad (buscar en Cart si el producto ya esta cargado)
                console.log('Cart Asociado ' + JSON.stringify(data.payload.cart, null, 2))
                cart = data.payload.cart
            }
            console.log('Datos de la sesión actual:', data);
            // Agregar el producto al carrito
            await addProduct(cart._id, product_id, quantity);
            window.location.href = `/`;
        })
        .catch(error => {
            // Maneja los errores de la solicitud
            console.error('Error al realizar la solicitud:', error);
        });


    /*  alert(user + ' - ' + product_id + ' - ' + quantity) */
    //AGREGAR Fetch a la api http://localhost:8080/api/carts/654ad55c345a116c6dc7d30b/product/64c93e557ba17db5afa18056

}

const createTicket = (cartId) => {
    //Generar Ticket con los Productos del Carrito de Compras
    fetch(`http://localhost:8080/api/carts/${cartId}/purchase`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Agrega cualquier otra cabecera que puedas necesitar, como token de autenticación, etc.
        },
    })
        .then(response => {
            // Verifica si la respuesta es exitosa (código de estado 200-299)
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status}`);
            }

            // Parsea la respuesta JSON
            return response.json();
        })
        .then(data => {
            console.log(JSON.stringify(data, null, 2))
            window.location.href = `/ticket/${data.ticket._id}`;
            /*  if (!data.status==206) {
                 console.log("El Ticket se ha Generado Correctamente")
                 
             }  */

        })
        .catch(error => {
            // Maneja los errores de la solicitud
            console.error('Error al realizar la solicitud:', error);
        });
}

const deleteUser = (user_id) => {
    Swal.fire({
        title: '¿Deseas Eliminar Este Usuario?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarlo'
    }).then((result) => {
        if (result.isConfirmed) {
            //Borrando el Usuario
            fetch(`http://localhost:8080/api/users/${user_id}`, {
                method: 'DELETE',
                headers: {
                    /* 'Content-Type': 'application/json', */
                    // Agrega cualquier otra cabecera que puedas necesitar, como token de autenticación, etc.
                },
            })
                .then(response => {
                    // Verifica si la respuesta es exitosa (código de estado 200-299)
                    if (!response.ok) {
                        throw new Error(`Error en la solicitud: ${response.status}`);
                    }

                    // Parsea la respuesta JSON
                    return response.json();
                })
                .then(data => {
                    console.log(JSON.stringify(data, null, 2))
                    window.location.href = `/users`;
                    /*  if (!data.status==206) {
                         console.log("El Ticket se ha Generado Correctamente")
                         
                     }  */

                })
                .catch(error => {
                    // Maneja los errores de la solicitud
                    console.error('Error al realizar la solicitud:', error);
                });
            Swal.fire('Eliminado', 'Tu archivo ha sido eliminado.', 'success');
        }
    });



}


const deleteUsersWithoutActivity = () => {
    Swal.fire({
        title: '¿Deseas eliminar todos los usuarios inactivos?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarlo'
    }).then((result) => {
        if (result.isConfirmed) {
            // Borrando el Usuario
            fetch(`http://localhost:8080/api/users`, {
                method: 'DELETE',
                headers: {
                    // Agrega cualquier otra cabecera que puedas necesitar, como token de autenticación, etc.
                },
            })
                .then(response => {
                    // Verifica si la respuesta es exitosa (código de estado 200-299)
                    if (!response.ok) {
                        throw new Error(`Error en la solicitud: ${response.status}`);
                    }

                    // Parsea la respuesta JSON
                    return response.json();
                })
                .then(data => {
                    const emailsBorrados = data.usersToDelete.map(user => user.email).join('\n');
                    const mensaje = `Los Usuarios eliminados son:\n${emailsBorrados}`;
                    Swal.fire({
                        title: 'Eliminado',
                        text: mensaje,
                        icon: 'success',
                        timer: 5000,  // Tiempo en milisegundos (5 segundos en este caso)
                        timerProgressBar: true,
                    }).then(() => {
                        window.location.href = `/users`;
                    });
                    console.log(JSON.stringify(data, null, 2));
                })
                .catch(error => {
                    // Maneja los errores de la solicitud
                    console.error('Error al realizar la solicitud:', error);
                });
        }
    });
}


const changeRoleUser = (user_id) => {
    //Generar Ticket con los Productos del Carrito de Compras
    fetch(`http://localhost:8080/api/users/premium/${user_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            // Agrega cualquier otra cabecera que puedas necesitar, como token de autenticación, etc.
        },
    })
        .then(response => {
            // Verifica si la respuesta es exitosa (código de estado 200-299)
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status}`);
            }

            // Parsea la respuesta JSON
            return response.json();
        })
        .then(data => {
            console.log(JSON.stringify(data, null, 2))
            window.location.href = `/users`;
            /*  if (!data.status==206) {
                 console.log("El Ticket se ha Generado Correctamente")
                 
             }  */

        })
        .catch(error => {
            // Maneja los errores de la solicitud
            console.error('Error al realizar la solicitud:', error);
        });
}