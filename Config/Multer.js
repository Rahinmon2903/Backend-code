import multer from "multer";
import cloudinary from "./Cloudinary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "bloggify",
        format:["jpg","png","jpeg"],
    },
});

const upload=multer({storage:storage});

export default upload;

//multer is used to upload files and for storage and cloudinary is used to convert the upload image to an url