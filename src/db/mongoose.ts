import { connect } from "mongoose";

try {
  await connect("mongodb://localhost:27017/destravate");
  console.log("Connected to MongoDB");
} catch (error) {
  console.log("Error connecting to MongoDB");
  console.log(error);
}
