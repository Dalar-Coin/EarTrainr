const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/userData.js");
const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/users", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

mongoose
  .connect(
    "mongodb+srv://DalarCoin:Dennis625@eartrainrdb.o8i2rop.mongodb.net/EarTrainr?retryWrites=true&w=majority&appName=EarTrainrDB"
  )
  .then(() => {
    console.log("Connected to database!");
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch(() => {
    console.log("Connection failed!");
  });
