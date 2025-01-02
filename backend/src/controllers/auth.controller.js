import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    //If the above conditions is met, We check if there is a user that already exists with the same email
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    //Hashing the password  using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Create new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      //generate jwt token
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(400).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  //First we check if there is a user already exists using email
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    //If no user is found
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    //If user is found compare the entered password with the stored hashed password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    //If password is not correct
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    //If email and password is correct then generate a token
    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error is login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  //Logout is successful by clearing out the cookies
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error is logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
