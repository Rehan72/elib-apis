import express from 'express';
import { createBook } from './bookController';
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


export default bookRouter;