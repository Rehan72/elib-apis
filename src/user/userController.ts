import { NextFunction,Request,Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";

const createUser =async(req:Request, res:Response, next:NextFunction)=>{
 const {name, email, password}=req.body;
 // Validation
  if(!name||!email||!password){
  const error=createHttpError(400,"All fields are required")
   return next(error)
   }
 
   const user =await userModel.findOne({email})

    if(user){
        const error=createHttpError(400,"User already exists with this email.")

        return next(error)
    }
  // Password hash  
 const hashedPassword = await bcrypt.hash(password,10) 
 
    res.json({message:"User created"})
}




export { createUser}