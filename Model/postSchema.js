import mongoose from "mongoose";


const postSchema=mongoose.Schema({

    title:{type:String,required:true},
    description:{type:String,required:true},
    image:{type:String,required:true},
    approved:{
        type:Boolean,
        default:false
    },

    user:{type:mongoose.Schema.Types.ObjectId,ref:"User"}

})

const Post=mongoose.model("Post",postSchema)
export default Post;