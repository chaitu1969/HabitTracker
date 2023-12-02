const mongoose = require("mongoose");
exports.connectMongoose = () => {
  mongoose.set("strictQuery", false);
  mongoose
    .connect("mongodb+srv://Admin:<password>@cluster0.9x6ipjm.mongodb.net/", {
      useNewUrlParser: true,
    })
    .then((e) => console.log("Connected to Mongodb"))
    .catch((e) => console.log("Not connected to DB", e));
};
