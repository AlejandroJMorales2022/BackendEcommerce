
const handleOnClick = async () => {

    const url = 'http://localhost:8080/api/products';
    const title = document.getElementById('title_product').value;
    const code = document.getElementById('code_product').value;
    const stock = document.getElementById('stock_product').value;
    const price = document.getElementById('price_product').value;
    const description = document.getElementById('description_product').value;
    /* const img = document.getElementById('img_product').files[0].name; */

    const producto = {
        title: title,
        code: code,
        stock: parseInt(stock),
        price: parseFloat(price),
        description: description,
        status: true,
        category: "cuadernos",
        thumbnails: [],
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(producto),
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const data = await response.json();
        console.log(data); // Respuesta del servidor después de agregar el producto
    } catch (error) {
        console.error(error);
    }
}

const handleOnClickDelete = async () => {
    console.log('delete product')

    const nroProd = await mostrarCuadroDeDialogo()
    if (nroProd){
        deleteProduct(nroProd)
    }

}

const mostrarCuadroDeDialogo = async () => {
    const { value: dato } = await Swal.fire({
        title: 'Ingreso el ID del Producto a Borrar',
        input: 'text',
        inputLabel: 'Dato:',
        inputPlaceholder: 'Ingrese aquí su dato',
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) {
                return 'Debe ingresar un dato';
            }
        },
    });
    if (dato) {
        // Aquí puedes realizar alguna acción con el dato ingresado, como enviarlo al servidor o mostrarlo en la consola
        console.log('Dato ingresado:', dato);
        return parseInt(dato)
    }
}

const deleteProduct = async (nroProd) => {
    try {
        const response = await fetch('http://localhost:8080/api/products/' + nroProd, {
            method: 'DELETE',
        });
        const data = await response.json();
        console.log(data); // Respuesta del servidor después de eliminar el producto
    } catch (error) {
        console.error(error);
    }
}
