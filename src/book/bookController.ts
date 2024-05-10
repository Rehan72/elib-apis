import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import path from "node:path"
import cloudinary from "../config/cloudinary";


const createBook=async (req: Request, res: Response, next: NextFunction)=>{
 console.log("files", req.files)
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
     console.log(uploadResult,"uploadResult");
 } catch (err){
    return next(createHttpError(500,"Upload failed"))
 }

 const bookFileName= files.file[0].filename;
 const bookFilePath=path.resolve(__dirname,'../../public/uploads', fileName)
try{
    const  bookFileUploadResult = await cloudinary.uploader.upload(bookFilePath,{
        resource_type: 'raw',
      
        filename_override:bookFileName,
        folder:"book-pdfs",
        format:"pdf"
     });

     console.log(bookFileUploadResult,"bookFileUploadResult");
     
}catch (err){
    console.log(err);
    
}
 


 
    res.json({message:"create"})
}


export{createBook}