
const socket = io(); //levantamos socket del lado del cliente


/* console.log('Hola desde realtime Products'); */
socket.emit('msg_realtime', 'Hola Me estoy comunicando desde el websocket de realtimePoducts');

socket.on('update_products', data => {
    console.log(`Producto ${data.id} - ${data.msg}`);
    //actualizar listado de productos
    location.reload();
});