const express = require('express');
const { api } = require('./routes/index')
const path = require('path');



const app = express();

app.use(express.urlencoded({ extended: true })); //middleware que parsea url
app.use(express.json()); //middleware que parsea el body (JSON)

//router
app.use('/api',api);



const port = 8080;

app.listen(port, () => {
    console.log(`Express Server waiting on port ${port}...`);
})

