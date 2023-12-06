
const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const username = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const lblError = document.getElementById('lblError');

   

    const requestData = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: username,
            password: password
        })
    };
    try {
        const response = await fetch('api/sessions/login', requestData);
        const responseData = await response.json();
            if (responseData.status==200){
                lblError.textContent = "";
                window.location.href = '/';
            }else {
                lblError.textContent = responseData.message;
            }
    } catch (error) {
        console.error('Error:', error);
    }
});
