
const sendEmail = async ()=>{
    
        try {
            const response = await fetch('http://localhost:8080/api/notifications/mail', {
                method: 'GET',
            });
            const data = await response.json();
            console.log(JSON.stringify(data,null,2)); // Respuesta del servidor
            alert(data.msg)
        } catch (error) {
            console.error(error);
        }
    
    
}
