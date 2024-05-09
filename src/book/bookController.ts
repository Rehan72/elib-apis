import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";



const createBook=async (req: Request, res: Response, next: NextFunction)=>{
 console.log("files", req.files)
 
    res.json({message:"create"})
}


export{createBook}