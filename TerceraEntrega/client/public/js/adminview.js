


fetch('api/auth/login',{
    method: 'POST',
    body: JSON.stringify({
        /* email: 'malejandro2002@yahoo.com.ar',
        password: '123' */
        email: 'adminCoder@coder.com',
        password: 'Cod3r123'
    }),
    headers: {
        "content-type" : "application/json"
    }
})
.then(resp => resp.json())
.then(({ message }) => {
    localStorage.setItem('token', message)
})
.catch(err => {console.log(err)})