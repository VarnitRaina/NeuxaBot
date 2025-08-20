import mongoose from "mongoose";




export default ()=>{
    return mongoose.connect(process.env.MONGO_CONNECT_STRING);
}