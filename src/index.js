
const express = require("express");
const pasth=require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const collection = require("./config");
const cookieParser = require("cookie-parser"); 
const Contact = require("./contactModel"); 
const Item = require("./itemModel");


const app = express();

// convert data into json format
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static("public"));

app.use(cookieParser()); 

app.get("/", (req, res) => {
    
    const { email, password } = req.cookies || {};
    res.render("login", { email, password });
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.post("/signup", async (req, res) => {
  const { uname, email, reg, password, cpassword } = req.body;

  try {

    const existingUser = await collection.findOne({ email });

    if (existingUser) {
      return res.send('User already exists.');
    }

    // Check if password and confirm password match
    if (password !== cpassword) {
      return res.send('Passwords do not match.');
    }

    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user document
    const newUser = new collection({
      name: uname, // Ensure to include 'name' field
      email,
      registrationNumber: reg, // Ensure to include 'registrationNumber' field
      password: hashedPassword, // Store the hashed password
      confirm_password: cpassword // Ensure to include 'confirm_password' field
    });

    // Save the user document to the database
    await newUser.save();

    return res.render("home");
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
});




app.post("/login", async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    const { email, password, rememberMe } = req.body; // Destructure rememberMe from req.body
    const check = await collection.findOne({ email });
    console.log("User found:", check);
    if (!check) {
      console.log("User not found");
      return res.send("User not found");
    }
    const isPasswordMatch = await bcrypt.compare(password, check.password);
    console.log("Password Match:", isPasswordMatch);
    if (!isPasswordMatch) {
      console.log("Wrong password");
      return res.send("<script>alert('wrong password')</script>");
        } else {
      if (rememberMe === 'on') { // Check if rememberMe is 'on' (value sent by the checkbox if it's checked)
        res.cookie("email", email, { maxAge: 30 * 24 * 60 * 60 * 1000 }); // Expires in 30 days
        res.cookie("password", password, { maxAge: 30 * 24 * 60 * 60 * 1000 }); // Expires in 30 days
      }
      return res.render("home");
    }
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).send("Internal Server Error");
  }
});





  app.get("/list-item", (req, res) => {
    return res.render("list-item");
  });





  app.post("/contact", async (req, res) => {
    const { contactName, contactEmail, contactMessage } = req.body;
  
    try {
      // Create a new contact form submission instance
      const newContact = new Contact({
        name: contactName,
        email: contactEmail,
        message: contactMessage
      });
  
      // Save the contact form submission to the database
      await newContact.save();
  
      res.send('<h1 align="center">Contact form submitted successfully.<h1>');
    } catch (error) {
      console.error("Error submitting contact form:", error);
      res.status(500).send("Internal Server Error");
    }
  });


  app.post("/add", async (req, res) => {
    try {
        const { itemName, itemPrice, itemImage } = req.body;
        
        // Create a new item document using the Item model
        const newItem = new Item({
            name: itemName,
            price: itemPrice,
            image: itemImage
        });
        
        // Save the new item to the database
        await newItem.save();
        
        res.send("Item added successfully");
    } catch (error) {
        console.error("Error adding item:", error);
        res.status(500).send("Internal Server Error");
    }
});


app.get("/home", async (req, res) => {
    try {
        // Retrieve all items from the database
        const items = await Item.find();
        res.render("home", { items });
    } catch (error) {
        console.error("Error retrieving items:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.get('/checkout', (req, res) => {
  // Redirect to the checkout page
  res.render("checkout");
});

app.get('/login1', function(req, res) {
  res.render('login'); 
});

  // Start Server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

