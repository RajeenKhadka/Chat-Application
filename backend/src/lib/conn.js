import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

//Global configuration
const mongoURI = process.env.MONGO_URI;
const db = mongoose.connection;

//connect to mongo
mongoose.connect(mongoURI);
mongoose.connection.once("open", () => {
  console.log("connceted to mongo");
});

export default db;
