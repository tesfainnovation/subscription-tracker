import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Api/v1/auth/sign-up POST BODY { name, email, password } CREATES A NEW USER
export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      const error = new Error('Email already in use');
      error.statusCode = 400;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create(
      [{ name, email, password: hashedPassword }],
      { session }
    );

    const token = jwt.sign(
      { userId: newUser[0]._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: 'User created successfully',
      user: newUser[0]
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// Sign in controller
export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error('Invalid email or password or User not found');
      error.statusCode = 401;
      // success = false;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      success: true,
      message: 'Signin successful',
      data: {
        token,
        user: {
          id: user._id,
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

// Sign out controller
export const signout = async (req, res, next) => {
  try {
    res.status(200).json({ message: 'signout' });
  } catch (error) {
    next(error);
  }
};









// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import User from "../models/user.model.js";

// export const signup = async (req, res, next) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { name, email, password } = req.body;

//     const existingUser = await User.findOne({ email }).session(session);
//     if (existingUser) {
//       const error = new Error('Email already in use');
//       error.statusCode = 400;
//       throw error;
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);
//     const newUser = await User.create(
//       [{ name, email, password: hashedPassword }],
//       { session }
//     );

//     const token = jwt.sign(
//       { userId: newUser[0]._id },
//       process.env.JWT_SECRET,
//       { expiresIn: process.env.JWT_EXPIRES_IN }
//     );

//     res.cookie('token', token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production'
//     });

//     await session.commitTransaction();
//     session.endSession();

//     res.status(201).json({
//       message: 'User created successfully',
//       user: newUser[0]
//     });

//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     next(error);
//   }
// }; // ← closing brace added!

// export const signin = async (req, res, next) => { };
// export const signout = async (req, res, next) => { };




























































