import { v2 as cloudinary } from "cloudinary"
import fs from "fs"


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
})


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file in the cloud
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        //if file has been uploaded successfully
        console.log("File has been successfully Uploaded to Cloudinary !!", response.url)
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null
    }

}


export { uploadOnCloudinary }