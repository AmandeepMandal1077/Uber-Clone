import mongoose from "mongoose";

const connectDB = () => {
  mongoose
    .connect(process.env.DATABASE_URI)
    .then(() => {
      console.log("Database connected");
    })
    .catch((err) => {
      console.log(err);
    });
};

export { connectDB };
