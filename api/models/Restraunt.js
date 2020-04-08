var mongoose = require("mongoose");
var RestrauntSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  min_order: {
    type: Number,
    required: true
  },
  delivery_fee: {
    type: Number,
    required: true
  }
});
RestrauntSchema.methods.toAuthJSON = function() {
  return {
    _id: this._id,
    name: this.name,
    min_order: this.min_order,
    delivery_fee: this.delivery_fee
  };
};
var Restraunt = mongoose.model("Restraunt", RestrauntSchema);
module.exports = Restraunt;
