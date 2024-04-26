import app from "./src/app";

const startServer = () =>{
    const prot=process.env.PORT || 3000;

   app.listen(prot,() =>{
 console.log(`listening on port:${prot}`  );
   });
}


startServer();