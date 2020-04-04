const mongoose = require("mongoose");

const jewellerySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

// First argument is the name of the model, second argument is the schema itself
module.exports = mongoose.model("Jewellery", jewellerySchema);
