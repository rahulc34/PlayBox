import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import dotenv from "dotenv";

dotenv.config();
const connectDB = async () => {
  try {
    const uri = `${process.env.MONGODB_URI}/${DB_NAME}`;
    const connectionInstance = await mongoose.connect(uri);

    console.log(
      `/n Database is connected successfully !! DB Host ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log(`DB connection failed, ERROR : ${error}`);
    process.exit(1);
  }
};

export default connectDB;
