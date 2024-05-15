import express from 'express';
import { bookList, createBook, updateBook ,getListByBookId,deleteBook, likeBook, getLikesCount} from './bookController';
import multer from 'multer';
import path from 'node:path'
import authenticate from '../middlewares/authenticate';

const bookRouter = express.Router();

// file store local
const upload=multer({
    dest: path.resolve(__dirname, '../../public/uploads'),
    limits: {fieldSize:3e7}
})

bookRouter.post("/",authenticate,upload.fields([
    {name:"coverImage",maxCount:1},
    {name:"file",maxCount:1},
]),createBook);

bookRouter.put("/:bookId",authenticate,upload.fields([
    {name:"coverImage",maxCount:1},
    {name:"file",maxCount:1},
]),updateBook);

bookRouter.get("/",bookList)

bookRouter.get("/:bookId",getListByBookId)

bookRouter.delete("/:bookId",authenticate,deleteBook)


// Like a book
bookRouter.post('/:bookId/like', likeBook);

// Get number of likes for a book
bookRouter.get('/:bookId/likes', getLikesCount);


export default bookRouter;