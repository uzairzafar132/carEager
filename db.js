const mongoose = require("mongoose");

const Connection = async () => {
 
  try {
    await mongoose.connect(process.env.DB, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("DB Connected");
  } catch (error) {
    console.log("Error while connecting to the database ", error);
  }
};

module.exports = Connection;
