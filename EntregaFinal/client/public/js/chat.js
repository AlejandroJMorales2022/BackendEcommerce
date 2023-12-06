
const socket = io(); //levantamos socket del lado del cliente
const messagesEl = document.querySelector('#messages')
const inputElement = document.querySelector('.inputBox input')



messagesEl.innerHTML = ""
// messagesEl.appendChild(NUEVO ELEMENTO) 

const appendMessageElement = (user, time, msg) => {
    const div = document.createElement('div')
    div.classList.add('col-12')
    div.classList.add('mensaje')
    time === '' && div.classList.add('joined')
    div.innerHTML = ` 
                    <div class='row d-flex justify-content-start w-100'>
                        <div class='col-3'>
                            <span>${user}</span>
                        </div>
                        <div class='col-md-2 col-3'>
                            <span><b>[</b>${time}<b>]</b></span>
                        </div>
                        <div class='col-md-7 col-6'>
                            <span>${msg}</span>
                        </div>
                    </div>`

    messagesEl.appendChild(div)

    // encierro en un set timeout
    // para que la altura del contenedor se actualice
    // con el nuevo nodo
    setTimeout(() => {
        console.log(messagesEl.scrollHeight)
        messagesEl.scrollTo(0, messagesEl.scrollHeight + 50);
    }, 500)
}

const appendUserActionElement = (user, timedate, joined) => {
    const div = document.createElement('div');
    div.classList.add('mensaje');

    joined ? div.classList.add('joined') : div.classList.add('notJoined');

    const action = joined ? 'se unio al chat' : 'salio del chat';

    div.innerHTML = `   <div class='row d-flex justify-content-start'>
                            <div class='col-3'>
                                <span>${user}</span>
                            </div>
                            <div class='col-md-2 col-3'>
                                <span><b>[</b>${timedate}<b>]</b></span>
                            </div>
                            <div class='col-md-7 col-6'>
                                <span>${action}</span>
                            </div>
                        </div>`;
    /* `<span class="uk-label uk-label-${type}">${user} se ${action}</span>` */

    messagesEl.appendChild(div);

    // encierro en un set timeout
    // para que la altura del contenedor se actualice
    // con el nuevo nodo
    setTimeout(() => {
        messagesEl.scrollTo(0, messagesEl.scrollHeight);
    }, 500)
}

const validateEmailFormat = (value) => {
    if (/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(value)) {
        return (true);
    } else {
        return (false);
    }
}

let username = '';

let currentMessages = [];

socket.on('chat-messages', (messagesList) => {
    currentMessages = messagesList;
})

//Obtener datos de la session de user
//usando fetch para obtener datos de sesión desde el servidor
fetch('/user-data')
    .then(response => response.json())
    .then(data => {
       
        if (data.usuario) {
            console.log('entro al if data.usuario.email')
            username = data.usuario;

            // logica Socket

            const labelUser = document.getElementById('userName');
            labelUser.textContent = `Usuario: ${username}`;
            socket.emit('user', { user: username, action: true });

            //Renderizo los mensajes actuales del server, al momento de la conexion (ingreso al chat)
            for (const { userId, datetime, message } of currentMessages) {
                appendMessageElement(userId, datetime, message);
            };
            //saludo de bienvenida
            appendMessageElement(username, '', 'Bienvenido al Chat de Nuestro Ecommerce');
            appendMessageElement('---------', '---------', '----------')

            socket.on('chat-message', ({ userId, datetime, message }) => {
                // renderizar el mensaje
                appendMessageElement(userId, datetime, message);
            });

            socket.on('user', ({ user, action }) => {
                if (user != undefined) {//para evitar que se imprima un evento disconnect al entrar y salir de realtimeproducts
                    const fecha = new Date();
                    appendUserActionElement(user, fecha.toLocaleTimeString('en-US'), action);
                }

            });

            //Al presionar Enter en el input...(siempre que haya escrito un mensaje)
            inputElement.addEventListener('keyup', ({ key, target }) => {
                if (key !== 'Enter') {
                    return;
                }
                const { value } = target;
                if (!value) {
                    return;
                }
                //...Enviar el mensaje al socket
                const fecha = new Date()

                const msg = { userId: username, datetime: fecha.toLocaleTimeString('en-US'), message: value }

                socket.emit('chat-message', msg)
                target.value = ""
                appendMessageElement(username, fecha.toLocaleTimeString('en-US'), value)
            })

        }
    })
    .catch(error => console.error('Error al obtener datos de sesión:', error));



const chatAccess = (userEmail) => {

}


/*  }) */
/* } */

