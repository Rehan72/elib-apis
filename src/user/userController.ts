import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "./userTypes";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  // Validation
  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }

  try {
    const user = await userModel.findOne({ email });

    if (user) {
      const error = createHttpError(
        400,
        "User already exists with this email."
      );

      return next(error);
    }
  } catch (err) {
    return next(createHttpError(500, "Error while getting user"));
  }

  // Password hash
//   const hashedPassword = await bcrypt.hash(password, 10);

//   let newUser: User;
 
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document
    const newUser = new userModel({
        name,
        email,
        password: hashedPassword // Save the hashed password
    });
    try {
    // Save the new user document to the database
    await newUser.save();

    console.log("User created successfully");
} catch (error) {
    console.error("Error creating user:", error);
}
  try {
    // Token generation JWT

    const token = sign({ sub: newUser._id }, config.jwtSecret as string, {
      expiresIn: "7d",
    });

    res.status(201).json({ accessToken: token });
  } catch (err) {
    return next(createHttpError(500, "Error while signing the jwt token"));
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    console.log(req.body,"req.body");
    
    if (!email || !password) {
        return next(createHttpError(400, "Email and password are required"));
    }

    try {
        const user = await userModel.findOne({ email });
        console.log(user,"user");
        
        if (!user) {
            return next(createHttpError(404, "User not found"));
        }

        //Check if the user document contains the password field
        if (!user.password) {
            return next(createHttpError(400, "Password field missing in user document"));
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return next(createHttpError(400, "Invalid password"));
        }

        // Create access token
        const token = sign({ sub: user._id }, config.jwtSecret as string, {
            expiresIn: "7d",
        });
        res.json({ accessToken: token });
    } catch (error) {
        console.error("Error during login:", error);
        return next(createHttpError(500, "Internal server error"));
    }
};

export { createUser,loginUser };
