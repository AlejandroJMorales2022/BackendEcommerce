const cluster = require('cluster');
const { cpus } = require('os');
const express = require('express');


console.log(cluster.isPrimary);
const processors = cpus().length;
/* console.log(JSON.stringify(cpus(), null, 2)) */
console.log(`Mi Maquina tiene ${processors} procesadorres.`)

if (cluster.isPrimary) { //verifico si el proceso es primario para Forkearlo y generar uno secundario "worker"
    //fork
    console.log(`Hola soy el Proceso Primario y mi Id es ${process.pid}`)
    for (let i = 0; i < cpus().length; i++) {
        cluster.fork();
    }
    //suscribir el cluster a mensajes para ejecutar acciones sobre procesos
    cluster.on('exit', (worker, code, signal) => {
        console.log(JSON.stringify(worker, null, 2));
        console.log(`el Worker con id: ${worker.process.pid} ha sido Detenido.`);
        //luego de matar un proceso forkeo uno nuevo para siempre tener unopor cada nuclueo de mi procesador
        cluster.fork();
    })
} else {
    //worker
    console.log(`Hola soy un Worker y mi Id es ${process.pid}`);
    const app = express();

    app.get('/simple', (req, res) => {
        let sum = 0;
        for (let i = 0; i < 10000; i++) {
            sum += 1;
        }
        res.send({sum});
    });
    app.get('/compleja', (req, res) => {
        let sum = 0;
        for (let i = 0; i < 5e8; i++) {
            sum += 1;
        }
        res.send({sum});
    });



    app.listen(8080, () => console.log('servidor escuchando en puerto 8080: ...'))
}