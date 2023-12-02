const mongoose = require("mongoose");

exports.connectMongoose = () => {
  mongoose
    .connect(
      "mongodb+srv://Admin:admin%40123@cluster1.wnetfup.mongodb.net/Habit_tracker"
    )
    .then(() => console.log("Connected to MongoDB"))
    .catch((e) => console.log("Not connected to DB", e));
};
