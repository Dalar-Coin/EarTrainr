const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "Please enter product name"],
    },
    password: {
      type: String,
      required: [true, "Please enter product name"],
    },
    //Still have to make the frontend get this data
    rank: {
      type: Number,
      required: true,
      default: 0,
    },
    //Refer to monkeytype Avg wpm and accuracy
    LastTenPercent: {
      type: Number,
      required: true,
      default: 0,
    },
    //Maybe
    allTimeAccuracy: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const userData = mongoose.model("Product", userSchema);

module.exports = userData;
