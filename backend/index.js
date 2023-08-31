const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const register = require("./Routes/register");
const login = require("./Routes/login");
const stripe = require("./Routes/stripe");
const productsRoute = require("./Routes/products");
const users = require("./Routes/users");
const orders = require("./Routes/orders");

const products = require("./products");

const App = express();

require("dotenv").config();

App.use(express.json());
App.use(cors());

App.use("/api/register", register);
App.use("/api/login", login);
App.use("/api/stripe", stripe);
App.use("/api/products", productsRoute);
App.use("/api/users", users);
App.use("/api/orders", orders);

App.get("/", (req, res) => {
  res.send("Welcome to our E-Commerce API...");
});

App.get("/products", (req, res) => {
  res.send(products);
});

const port = process.env.PORT || 5000;

App.listen(port, console.log(`Your server running on port ${port}...`));

const uri = process.env.DB_URI;

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connection Established"))
  .catch((error) => console.log("MongoDB Connection Failed: ", error.message));
