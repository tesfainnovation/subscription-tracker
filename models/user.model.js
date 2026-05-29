import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User Name is required"],
    trim: true,
    maxlength: [50, "User Name must be less than 50 characters"],
    minlength: [2, "User Name must be at least 2 characters"]
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: [255, "Email must be less than 255 characters"],
    minlength: [5, "Email must be at least 5 characters"],
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address"
    ]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
    // maxlength: [1024, "Password must be less than 1024 characters"]
  }
});

const User = mongoose.model("User", userSchema);

export default User;

// User.create({});
//name: 'John Doe',
//email: 'john.doe@example.com',
//password: 'password123'
