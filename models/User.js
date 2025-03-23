import mongoose from "mongoose";
import { connect } from "@/connect";
connect();
const Parkinguser=new mongoose.Schema({
   email:{required:true},
   password:{required:true},
   name:{required:true},
   phone:{required:true},
   address:{required:true}
})
