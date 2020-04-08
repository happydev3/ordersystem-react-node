var mongoose = require("mongoose");

var OrderSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true
  },
  restaurantID: {
    type: Number
  },
  restaurantName : {
    type: String
  },
  subtotal : {
    type: Number
  },
  total : {
    type: Number
  },
  fee : {
    type: Number
  },
  tax : {
    type: Number
  },
  orders : [{ 
    quantity : { type : Number},
    name: { type : String},
    price : { type : Number}
  }]
}, {timestamps: true});
OrderSchema.methods.toAuthJSON = function() {
  return {
    _id : this._id,
    userID: this.userID,
    restaurantID : this.restaurantID,
    restaurantName : this.restaurantName,
    subtotal : this.subtotal,
    total : this.total,
    fee : this.fee,
    tax : this.tax,
    orders : this.orders
  };
};

// OrderSchema.methods.

var Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
