//usando Comander para trabajar con argumentos
const { Command } = require('commander')

const program = new Command()

program
  .option('-p <port>', 'Puerto de escucha', 8080)
  .option('--mode <mode>', 'Modo de ejecuccion', 'production')
  .requiredOption('-u <user>', 'Usuario del proceso', null)
  .option('-d', 'Debug habilitado', false)


program.parse()

console.log(program.opts())
console.log(program.args)

process.on('exit', (code) => {
  console.log('el proceso ha terminado', code)
})

process.on('uncaughtException', (err) => {
  console.log('ocurrio una exception', err.stack)
})

//Imprimiendo por consola el objeto precess de Node
/* console.log(process.pid)
console.log(process.memoryUsage())
console.log(process.env)
console.log(process.argv) */