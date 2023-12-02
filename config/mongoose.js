const mongoose = require("mongoose");

exports.connectMongoose = () => {
  mongoose
    .connect(
      "mongodb+srv://Admin:Qr6STdVTxR5WHqse@cluster0.9x6ipjm.mongodb.net/"
    )
    .then(() => console.log("Connected to Mongodb"))
    .catch((e) => console.log("Not connected to DB", e));
};
