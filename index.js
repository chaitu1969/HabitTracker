const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 9000;
const router = require("./routes/routes");

// Setting up view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Connect Mongoose
const { connectMongoose } = require("./config/mongoose");
connectMongoose();

// Making a static connection
app.use("/assets", express.static("./assets"));

// Using built-in express middleware for body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(router);

// Running server on port
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
