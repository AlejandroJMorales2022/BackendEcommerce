const { Schema, model } = require('mongoose');

const schema = new Schema({
    code: {type: String, index: true},
    purchase_datetime: { type: Number, default: Date.now() },
    amount: Number,
    purcharser: String    
});


const tickectsModel = model('tickets', schema)

module.exports = tickectsModel;