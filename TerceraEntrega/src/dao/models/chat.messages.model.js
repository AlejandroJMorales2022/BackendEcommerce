const { Schema, model } = require('mongoose');

const schema = new Schema({
    userId: String,
    message: String,
    datetime:{type:String, default: Date.now()}
});

const messageModel = model('messages', schema)

module.exports = messageModel;