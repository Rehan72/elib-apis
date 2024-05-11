import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import path from "node:path";
import cloudinary from "../config/cloudinary";
import bookModel from "./bookModel";
import fs from "node:fs";
import { AuthRequest } from "../middlewares/authenticate";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  console.log("files", req.files);
  const { title, genre } = req.body;
  const files = req.files as { [filename: string]: Express.Multer.File[] };
  const coverImageMineType = files.coverImage[0].mimetype.split("/").at(-1);
  const fileName = files.coverImage[0].filename;
  const filePath = path.resolve(__dirname, "../../public/uploads", fileName);

  try {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: "book-covers",
      format: coverImageMineType,
    });

    const bookFileName = files.file[0].filename;
    const bookFilePath = path.resolve(
      __dirname,
      "../../public/uploads",
      bookFileName
    );

    const bookFileUploadResult = await cloudinary.uploader.upload(
      bookFilePath,
      {
        resource_type: "raw",

        filename_override: bookFileName,
        folder: "book-pdfs",
        format: "pdf",
      }
    );

    //@ts-ignore

    const _req = req as AuthRequest;
    const newBook = await bookModel.create({
      title,
      genre,
      author: _req.userId,
      coverImage: uploadResult.secure_url,
      file: bookFileUploadResult.secure_url,
    });

    // Delete temp files
    try {
      // await fs.unlinkSync(filePath);
      await fs.promises.unlink(filePath);
    } catch (err) {
      return next(createHttpError(500, "Error in file"));
    }
    try {
      // await fs.unlinkSync(bookFilePath);
      await fs.promises.unlink(bookFilePath);
    } catch (err) {
      return next(createHttpError(500, "Error"));
    }

    res
      .status(201)
      .json({ id: newBook._id, message: "files uploaded successfully" });
  } catch (err) {
    console.log(err, "error");

    return next(createHttpError(500, "Error creating book file"));
  }
};

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, genre } = req.body;
        const bookId = req.params.bookId;
        const book = await bookModel.findOne({ _id: bookId });

        if (!book) {
            return next(createHttpError(404, "Book not found"));
        }

        // Check access
        const _req = req as AuthRequest;
        if (book.author.toString() !== _req.userId) {
            return next(createHttpError(403, "Unauthorized"));
        }

        // Check if files are uploaded
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        let completeCoverImage = "";
        let completeFileName = "";

        // Upload cover image if exists
        if (files && files.coverImage) {
            console.log(files,"file already")
              const converMimeType = files.coverImage[0].mimetype.split("/").at(-1);
              console.log(converMimeType,"converMimeType");
              
            const coverImageFile = files.coverImage[0].filename;
            // const coverImageFileName = coverImageFile.filename;
            const coverImageFilePath = path.resolve(__dirname, "../../public/uploads", coverImageFile);
            completeCoverImage=coverImageFile
            const uploadResult = await cloudinary.uploader.upload(coverImageFilePath, {
                filename_override: completeCoverImage,
                folder: "book-covers",
                format: converMimeType,
            });

            completeCoverImage = uploadResult.secure_url;

            // Delete file from local storage after uploading to Cloudinary
            try {
                await fs.promises.unlink(coverImageFilePath);
            } catch (err) {
                console.error("Error deleting cover image file:", err);
                // Handle error if necessary
            }
        }

        // Upload file if exists
        if (files && files.file) {
           ;
            
            const bookFile = files.file[0];
            const bookFileName = bookFile.filename;
            const bookFilePath = path.resolve(__dirname, "../../public/uploads", bookFileName);

            const uploadResultPdf = await cloudinary.uploader.upload(bookFilePath, {
                resource_type: "raw",
                filename_override: bookFileName,
                folder: "book-pdfs",
                format:"pdf"
            });

            completeFileName = uploadResultPdf.secure_url;

            // Delete file from local storage after uploading to Cloudinary
            try {
                await fs.promises.unlink(bookFilePath);
            } catch (err) {
                console.error("Error deleting book file:", err);
                return next(createHttpError(500,"Sever error"))
                // Handle error if necessary
            }
        }

        // Update book with new data
        const updatedBook = await bookModel.findOneAndUpdate(
            { _id: bookId },
            {
                title: title,
                genre: genre,
                coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
                file: completeFileName ? completeFileName : book.file,
                // coverImage: completeCoverImage || book.coverImage,
                // file: completeFileName || book.file,
            },
            { new: true }
        );

        res.json(updatedBook);
    } catch (err) {
        console.error("Error updating book:", err);
        return next(createHttpError(500, "Server error"));
    }
};

const bookList=async(req: Request, res: Response, next: NextFunction)=>{
    try{
     const book = await bookModel.find()
     res.json({book,message:"bookList"})
    }catch(err){
        return next(createHttpError(500, "Error while getting book list"));
    }
    
}


const getListByBookId=async(req: Request, res: Response, next: NextFunction)=>{
    const bookId= req.params.bookId;
    try{
      const book= await bookModel.findOne({_id: bookId}); 
       if(!book){
        return next(createHttpError(404, "book not found"))
       }

       res.json({book,message:"getting  book List"}) 
    }catch(err){
        return next(createHttpError(500,"Error while getting book list  "))
    }
 
}

// const updateBook = async (req: Request, res: Response, next: NextFunction) => {
//   const { title, genre } = req.body;
//   const bookId = req.params.bookId;
//   const book = await bookModel.findOne({ _id: bookId });
//   //    console.log(book,"BOOOkay!");
//  try{
  
   
//   if (!book) {
//     return next(createHttpError(404, "book not found"));
//   }
//   // check access
//   const _req = req as AuthRequest;
//   if (book.author.toString() !== _req.userId) {
//     return next(createHttpError(403, "unauthorized"));
//   }

//   // check if image field is exists
//   const files = req.files as { [filename: string]: Express.Multer.File[] };
//   let completeCoverImage = "";
//  console.log(files,"++++++++Added");
 
//   if (files.coverImage) {
   

//     const converMimeType = files.coverImage[0].mimetype.split("/").at(-1);
//     const fileName = files.coverImage[0].filename;
//     const filePath = path.resolve(__dirname, "../../public/uploads", fileName);
  
//     //sent file to cloudnary
//     // const filePath = path.resolve(__dirname, "../../public/uploads" + filename);

//     completeCoverImage = fileName;

//     const uploadResult = await cloudinary.uploader.upload(filePath, {
//       filename_override: completeCoverImage,
//       folder: "book-covers",
//       format: converMimeType,
//     });
//     completeCoverImage = uploadResult.secure_url;
    
//       // Delete file from local storage after uploading to Cloudinary
//     try {
//       await fs.promises.unlink(filePath);
//     } catch (err) {
//       return next(createHttpError(500, " Delete file from local storage"));
//     }
//   }

//   // check if file field is exists
//   let completeFileName = "";
//   if (files.file) {
//     const bookFilePath = path.resolve(
//       __dirname,
//       "../../public/uploads" + files.file[0].filename
//     );
//     const bookFileName = files.filr[0].filename;
//     completeFileName = bookFileName;

//     const uploadResultPdf = await cloudinary.uploader.upload(bookFilePath, {
//       resource_type: "raw",
//       filename_override: completeFileName,
//       folder: "book-covers",
//     });
//     completeFileName = uploadResultPdf.secure_url;
//     // Delete file from local storage after uploading to Cloudinary
//     try {
//       await fs.promises.unlink(bookFilePath);
//     } catch (err) {
//       return next(createHttpError(500, "Error deleting file"));
//     }
//   }
//   const updatedBook = await bookModel.findOneAndUpdate(
//     {
//       _id: bookId,
//     },
//     {
//       title: title,
//       genre: genre,
//       coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
//       file: completeFileName ? completeFileName : book.file,
//     },
//     { new: true }
//   );
//   console.log("updatedBook", updateBook);

//   res.json(updatedBook);
// }catch (err) {
//     console.log(err,"update with error");
    
//     return next(createHttpError(500,"Server error"))
// }
// };

export { createBook, updateBook,bookList,getListByBookId };
