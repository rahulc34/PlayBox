import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { isEmailValid } from "../utils/validations.js";

const registerUser = asyncHandler(async (req, res) => {
  //get user from the frontend by req body or url
  //username, email, password, fullname, avatar, coverImage,
  // implies validations on all field
  // check for images and avatar
  // upload them to the cloudinary
  // get the url of images fromm response
  // create user object - create entry in db
  // if error return user not created response
  // else created response with -- details
  // remove passoword, refreshToken field from response
  // send response

  const { fullname, username, email, password } = req.body;
  console.log(fullname, username, email, password);

  // -- checking if fields are empty or not
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  //--email verifications
  if (!isEmailValid(email)) {
    throw new ApiError(400, "Email is not valid");
  }

  //--checking if user exist or not
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(
      409,
      `user with ${existedUser.email === email ? email : username} is already existed`
    );
  }

  //---checking for images
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  //--upload on lcoudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(500, "Failed to upload on cloudinary");
  }

  //---creating the user
  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user?._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered successfully!!"));
});

export { registerUser };
