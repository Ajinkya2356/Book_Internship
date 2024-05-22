import mongoose from "mongoose";
const connectDB = async () => {
  try {
    const connection = await mongoose.connect(
      `${process.env.MONGO_URL}/${process.env.DB_NAME}`
    );
    console.log(`DataBase connected with ${connection.connection.host}`);
  } catch (error) {
    console.log(`DB connection error: ${error.message}`);
    process.exit(1);
  }
};
export default connectDB;
