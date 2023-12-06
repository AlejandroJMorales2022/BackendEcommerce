
const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const username = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('firstname').value;
    const surname = document.getElementById('lastname').value;
    const age = document.getElementById('age').value;
    const gender = document.getElementById('gender').value;
    const lblError = document.getElementById('lblError');


    const requestData = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: username,
            password: password,
            firstname: name,
            lastname: surname,
            age: age,
            gender:gender 
        })
    };
    try {
        const response = await fetch('api/sessions/signup', requestData);
        const responseData = await response.json();
            if (responseData.status==200){
                lblError.textContent ="";
                window.location.href = '/login';
            }else {
                lblError.textContent = responseData.message;
            };
    } catch (error) {
        console.error('An error occurred:', error);
    }
});
