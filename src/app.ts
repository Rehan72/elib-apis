import express from 'express'


const app = express();

//Routes
// HTTP methods: GET, POST, PUT, DELETE, PATCH

app.get('/', (req, res, next) => {
  res.json({message:"welcome to elib apis"});
});
export default app;