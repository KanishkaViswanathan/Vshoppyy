



const mongoose = require('mongoose');
const connect = mongoose.connect("mongodb://localhost:27017/vshoppy_users");

// Check database connected or not
connect.then(() => {
    console.log("Database Connected Successfully");
})
.catch(() => {
    console.log("Database cannot be Connected");
})






const contactSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    }
  });
  
  // Create a Mongoose model based on the schema
  const Contact = mongoose.model("Contact", contactSchema);
  
  module.exports = Contact;