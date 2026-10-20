const mongoose = require('mongoose');
const MenuItemSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  category:{
    type:String,
    required:true
  },
  price:{
    type:Number,
    required:true
  },
  isVeg: {
    type: Boolean,
    default: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  imageUrl: String
}, { timestamps: true });

module.exports = mongoose.model('MenuItem',MenuItemSchema);