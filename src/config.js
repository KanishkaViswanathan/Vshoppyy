
const mongoose = require('mongoose');
const connect = mongoose.connect("mongodb://localhost:27017/vshoppy_users");

// Check database connected or not
connect.then(() => {
    console.log("Database Connected Successfully");
})
.catch(() => {
    console.log("Database cannot be Connected");
})

// Define Schema for User
const userSchema = new mongoose.Schema({
    registrationNumber: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirm_password: {
        type: String,
        required: true
    }
   
});



const collection = new mongoose.model("users", userSchema);

module.exports = collection;