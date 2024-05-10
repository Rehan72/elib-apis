import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import path from "node:path"
import cloudinary from "../config/cloudinary";
import bookModel from "./bookModel";
import  fs  from "node:fs";
import { AuthRequest } from "../middlewares/authenticate";


const createBook=async (req: Request, res: Response, next: NextFunction)=>{
 console.log("files", req.files)
 const {title,genre}=req.body
 const files=req.files as{[filename:string]:Express.Multer.File[]};
 const coverImageMineType=files.coverImage[0].mimetype.split("/").at(-1);
 const fileName=files.coverImage[0].filename
 const filePath=path.resolve(__dirname,'../../public/uploads', fileName);

 try{
    const  uploadResult = await cloudinary.uploader.upload(filePath,{
        filename_override:fileName,
        folder:"book-covers",
        format:coverImageMineType
     })
    //  console.log(uploadResult,"uploadResult");
//  } catch (err){
//     return next(createHttpError(500,"Upload failed"))
//  }

 const bookFileName= files.file[0].filename;
 const bookFilePath=path.resolve(__dirname,'../../public/uploads', bookFileName)
// try{
    const  bookFileUploadResult = await cloudinary.uploader.upload(bookFilePath,{
        resource_type: 'raw',
      
        filename_override:bookFileName,
        folder:"book-pdfs",
        format:"pdf"
     });

    //  console.log(bookFileUploadResult,"bookFileUploadResult");
     
// }catch (err){
//     console.log(err);
    
// }
 
// try{
//@ts-ignore
console.log("userId",req.userId);
const _req=req as AuthRequest;
    const newBook=await bookModel.create({
        title,
        genre,
        author:_req.userId,
        coverImage:uploadResult.secure_url,
        file:bookFileUploadResult.secure_url,
    });

    // Delete temp files
    try{
        // await fs.unlinkSync(filePath);
        await fs.promises.unlink(filePath);
    }catch(err){
        return next(createHttpError(500,"Error in file"))
    }
    try{
        // await fs.unlinkSync(bookFilePath);
        await fs.promises.unlink(bookFilePath);
    }catch(err){
        console.log(err,"Error deleting++");
        
        return next(createHttpError(500,"Error"));
    }
   
    // if (fs.existsSync(filePath)) {
    //     // File exists, proceed with deletion
    //     fs.unlinkSync(filePath);
    //     console.log("File deleted successfully");
    // } else {
    //     console.log("File does not exist");
    // }
    res.status(201).json({id:newBook._id,message:"files uploaded successfully"})
}catch (err){
    console.log(err,"error");
    
    return next(createHttpError(500, "Error creating book file"))
}
   
};


export{createBook}