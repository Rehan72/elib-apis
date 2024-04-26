import app from "./src/app";
import { config } from "./src/config/config";

const startServer = () =>{
    const prot=config.port || 3000;

   app.listen(prot,() =>{
 console.log(`listening on port:${prot}`  );
   });
}


startServer();