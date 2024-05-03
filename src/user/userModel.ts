import mongoose from "mongoose";
import { User } from "./userTypes";


const userSchema = new mongoose.Schema<User>({

    name:{
        type: 'string',
        require:true,
    },
    email:{
        type: 'string',
        unique:true,
        require:true,
    },
    password:{
          type: 'string',
          require:true,

    }
},
{timestamps:true}
);


// users
export default mongoose.model<User>('user',userSchema);