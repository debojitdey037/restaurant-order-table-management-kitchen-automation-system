const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    table:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Table'
    },

    items:[
        {
        menuItem:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'MenuItem'
      },
      name:String,
      price:Number,
      quantity:Number
      }
    ],

    subtotal:Number,
    gst:Number,
    grandTotal:Number,

    status:{
    type:String,
    default:'Placed'
    }
}, { timestamps: true })

module.exports = mongoose.model('Order',orderSchema);