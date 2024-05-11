import  express, { NextFunction,Request,Response }  from "express";
import createHttpError, { HttpError } from "http-errors";
import { config } from "./config/config";
import globalErrorHandler from "./middlewares/globalErrorhandler";
import userRouter from "./user/userRouter";
import bookRouter from "./book/bookRouter";

const app = express()
app.use(express.json());
// Route configuration
// http methods: "GET", "POST", "PUT", "DELETE"
app.get('/',(req, res,next) => {
  // const error= createHttpError(400,"something went wrong");
  // throw error
  res.json({success:"Welcome to elib apis"})
})

app.use('/api/users',userRouter)
app.use('/api/books',bookRouter)
// Global error handler
app.use(globalErrorHandler)
export default app