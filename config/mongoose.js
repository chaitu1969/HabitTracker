const mongoose = require("mongoose");
exports.connectMongoose = () => {
  mongoose.set("strictQuery", false);
  mongoose
    .connect("mongodb://localhost:27017/HabitTrackerDataBase", {
      useNewUrlParser: true,
    })
    .then((e) => console.log("Connected to Mongodb"))
    .catch((e) => console.log("Not connected to DB", e));
};
