const { faker } = require('@faker-js/faker');

const generateProducts = (count = 100) => {

    const products = [];

    for (let i=0; i < count; i++) {
        products.push({
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            code: faker.commerce.isbn(),
            price: faker.commerce.price(),
            stock: faker.number.int(),
            category: faker.commerce.productMaterial(),
            thumbnails: faker.image.url()
        })
    }
    return products;
}


module.exports = {
    generateProducts
}