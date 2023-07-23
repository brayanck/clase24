const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  first_name:{
    type:String,
    required:true,
  },
  last_name:{
    type:String,
    required:true,
  },
  email: {
    type: String,
    required: true,
    unique:true
  },
  age:{
    type:Number,
    required:true
  },
  password: {
    type: String,
    required: true
  },
  cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' }
});

const User = mongoose.model('User', emailSchema);
module.exports = User;