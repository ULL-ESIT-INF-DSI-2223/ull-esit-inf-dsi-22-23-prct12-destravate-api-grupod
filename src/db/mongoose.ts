import { connect } from "mongoose";

try {
  await connect(process.env.MONGODB_URL!);
  console.log("Connected to MongoDB");
} catch (error) {
  console.log("Error connecting to MongoDB");
  console.log(error);
}
