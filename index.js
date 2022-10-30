const todos = require("./routes/todos");
const signUp = require("./routes/signUp");
const signIn = require("./routes/signin");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/todos", todos);
app.use("/api/signup", signUp);
app.use("/api/signin", signIn);

app.get("/", (req, res) => {
  res.send("Welcome to our todos api");
});

const connection_string = process.env.CONNECTION_STRING;
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});

mongoose
  .connect(connection_string)
  .then(() => console.log("MongDB connection established..."))
  .catch((error) => console.error("MongDB connection failed:", error.message));
