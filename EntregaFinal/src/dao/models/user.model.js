const { Schema, model } = require('mongoose')

const schema = new Schema({
  firstname: String,
  lastname: { type: String, index: true },
  email: { type: String, index: true },
  password: String,
  gender: String,
  age: { type: Number },
  createdDate: { type: Number, default: Date.now() },
  address: { type: Schema.Types.ObjectId, ref: 'addresses' },
  role: { type: String, default: 'Usuario' },
  cart: { type: Schema.Types.ObjectId, ref: 'carts' },
  documents: [
    {
      name: { type: String },
      reference: { type: String }
    }
  ],
  last_connection: { type: Number, default: Date.now() }

})

const userModel = model('users', schema)

module.exports = userModel