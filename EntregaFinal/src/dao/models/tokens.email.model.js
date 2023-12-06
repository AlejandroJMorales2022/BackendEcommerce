const { Schema, model } = require('mongoose');

const schema = new Schema({
    email: {type: String, index: true},
    token: { type: String }    
});


const tokensEmailModel = model('tokensEmail', schema)

module.exports = tokensEmailModel;