import  express, { NextFunction,Request,Response }  from "express";
import createHttpError, { HttpError } from "http-errors";
import { config } from "./config/config";
import globalErrorHandler from "./middlewares/globalErrorhandler";

const app = express()
// Route configuration
// http methods: "GET", "POST", "PUT", "DELETE"
app.get('/',(req, res,next) => {
  const error= createHttpError(400,"something went wrong");
  throw error
  res.json({success:"Welcome to elib apis"})
})

// Global error handler
app.use(globalErrorHandler)
export default app