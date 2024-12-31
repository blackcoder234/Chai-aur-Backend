import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from '../utils/ApiError.js'
import User from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    //the steps what to do for register a user
    //1. get user details
    //2. validation of user data
    //3. check if user already exits 
    //4. check fpo image and avatar
    //5. upload them to Cloudinary
    //6. create user object - create entry in db
    //7. remove password and refresh token field
    //8. check foe user creation 
    //9. return response

    const { username, email, fullName, password } = req.body
    if (
        [username, email, fullName, password].some((allFields) => {
            return allFields?.trim() === ""
        })
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUser) {
        throw new ApiError(409, "Username/email is already exit")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")

    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }


    const user = await User.create({
        username: username.toLowerCase(),
        email,
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        password

    })
    // for debugging
    // console.log("\nUser Details->", user);

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!createdUser) {
        throw new ApiError(500, "Internal server error: registering the user")

    }
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User successfully Registered")
    )
})

// export default registerUser
export { registerUser }