import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadFileCloudinary=async (filepath)=>{
    try {
        if(!filepath) return true;

        //uplaod file to cloudinary 

       const response=await cloudinary.uploader.upload(filepath,{resource_type:"auto"})

        // console.log("file uplaod in successfully")

        fs.unlinkSync(filepath);  //clear the storage
        
        return response
    } catch (error) {
        fs.unlinkSync(filepath) // removed the loacal save temprory filed uplaod file got failed
    }
}

export {uploadFileCloudinary}

// cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//   { public_id: "olympic_flag" }, 
//   function(error, result) {console.log(result); });