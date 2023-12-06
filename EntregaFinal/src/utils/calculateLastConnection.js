
const calculateLastConnection = (userLastConnection) => {
    // Obtén la marca de tiempo actual en milisegundos
    const currentTimeStamp = new Date().getTime();

    // Supongamos que userLastConnection es la marca de tiempo de la última conexión del usuario
    /* const userLastConnection = 1701637524450; */ // Timestamp de ejemplo

    // Calcula la diferencia en milisegundos
    const timeDifference = currentTimeStamp - userLastConnection;

    // Calcula la diferencia en días
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

 return daysDifference;

}
module.exports = calculateLastConnection;

