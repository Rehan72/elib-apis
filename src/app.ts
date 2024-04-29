import  express  from "express";

const app = express()
// Route configuration
// http methods: "GET", "POST", "PUT", "DELETE"
app.get('/',(req, res,next) => {
  res.json({success:"Welcome to elib apis"})
})
export default app