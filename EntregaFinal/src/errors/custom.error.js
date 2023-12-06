
const ErrorType = [
    {
        code: 'NoProductsInDB',
        type: 'No hay Productos en la Colleccion Products de la Base de Datos'
    },
    {
        code: 'ProductIdNotFound',
        type: 'El Producto con el ID solicitado No se Encuentra en La Base de Datos'
    },
    {
        code: 'CastErrorProduct',
        type: 'El Valor o Formato del ObjectId del Documento Product es Inválido, verifique el formato del mismo y que exista dentro de la colección de la base de datos'
    },
    {
        code: 'MissingProductProperty',
        type: 'Una o Más Propiedades del Producto No se han Especificado, verifique el formato del mismo y que existan todas las propiedades obligatorias del producto'
    },
    {
        code: 'ProductAlreadyExist',
        type: 'No se puede Crear Este Producto porque Ya Existe uno con el Código Especificado...'
    },
    {
        code: 'CartIdNotFound',
        type: 'El Carrito de Compras con el ID solicitado No se Encuentra Generado en La Base de Datos'
    },
    {
        code: 'CastErrorCart',
        type: 'El Valor o Formato del ObjectId del Documento Cart es Inválido, verifique el formato del mismo y que exista dentro de la colección de la base de datos'
    },
    {
        code: 'CartAlreadyExist',
        type: 'No se puede Crear Este Producto porque Ya Existe uno con el Código Especificado...'
    },
    {
        code: 'TicketNoGenerated',
        type: 'No se Ha Generado el Ticket, verifique que el haber cargado productos a su Carrito de Compras y que los mismos tengas Stock suficiente.'
    },
    {
        code: 'ServerError',
        type: 'Error Interno de Servidor'
    }
]
class CustomError extends Error {
    constructor(code) {
        super(code)
     this.code = code
    }
}
module.exports = {
    CustomError,
    ErrorType
}