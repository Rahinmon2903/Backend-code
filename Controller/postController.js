import Post from "../Model/postSchema.js";


//create post

export const  createPost=async (req,res) => {
    try {
        const {title,description}=req.body;
        const imageURL="";
        if(req.file && req.file.path){
            imageURL=req.file.path

        }
        const post=await new Post({title,description,image:imageURL})
        await post.save();
        res.status(200).json({message:"post created successfully",data:post});
        
    } catch (error) {
        res.status(500).json({message:"error in creating post"});
        
    }
    
}

//get all  approved post

export const getAllApprovedPost=async (req,res) => {
    try {
        const post=await Post.find({approved:true});
        res.status(200).json({message:"post fetched successfully",data:post});
        
    } catch (error) {
        res.status(500).json({message:"error in fetching  approved post"});
        
    }
    
}

//get all unapproved post

export const getAllUnapprovedPost=async (req,res) => {
    try {
        const post=await Post.find({approved:false});
        res.status(200).json({message:"post fetched successfully",data:post});
        
    } catch (error) {
        res.status(500).json({message:"error in fetching unapproved post"});
        
    }
    
}

//change approved to true only done by admin

export const ApprovePost=async (req,res) => {
    try {
        const post=await User.findByIdAndUpdate(
            req.params._id,
            {approved:true},
            {new:true}
        )
        res.status(200).json({
            message:"post approved successfully",
            data:post
        })
        
    } catch (error) {
         res.status(500).json({message:"error in Approve post"});
        
    }
    
}

//delete post

export const deletePost=async (req,res) => {
    try {
    await Post.findByIdAndDelete(req.params._id);
        res.status(200).json({
            message:"post deleted successfully"
           
        })
        
    } catch (error) {
         res.status(500).json({message:"error in deleting post"});
        
    }
    
}