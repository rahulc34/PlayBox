import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { isEmailValid } from "../utils/validations.js";
import jwt from "jsonwebtoken";
import { subscribe } from "diagnostics_channel";
import mongoose, { mongo } from "mongoose";
import { transporter } from "../middlewares/nodemailer.middleware.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ ValidateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generation refresh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  //get user from the frontend by req body or url
  //username, email, password, fullname, avatar, coverImage,
  // implies validations on all field
  // create user object - create entry in db
  // if error return user not created response
  // else created response with -- details
  // remove passoword, refreshToken field from response
  // send response
  const { fullname, username, email, password } = req.body;

  console.log("registering user -->", username, email, password, fullname);
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
      `user with ${existedUser?.email === email ? email : username} is already existed`
    );
  }

  //---creating the user
  const user = await User.create({
    fullname,
    avatar: "",
    coverImage: "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user?._id).select(
    "-password -refreshToken -watchHistory"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  console.log("resistered user", username);
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered successfully!!"));
});

const loginUser = asyncHandler(async (req, res) => {
  //--------steps for login user-----------//
  //get username email pass from req body
  //find user with email or username in db
  //password check
  //access token and refresh token
  //send cookies

  //Retrieve the email and password from the request body
  const { email, password } = req.body;
  console.log("body-->", req.body);
  //Ensure both email and password are provided and not empty.
  if (!password?.trim() || !email?.trim()) {
    throw new ApiError(400, "email or password is required");
  }

  //Query the database to find a user with the provided email or username
  const user = await User.findOne({
    email,
  });

  //f no user is found, throw an error indicating invalid credentials.
  if (!user) {
    throw new ApiError(400, "user not exist");
  }

  //Compare the provided password with the stored hashed password using a password hashing library (e.g., bcrypt).
  const isPasswordValid = await user.isPasswordCorrect(password);

  //If the password does not match, throw an error indicating invalid credentials.
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }

  // Create a JWT token for the user to maintain session authentication.
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -watchHistory"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  console.log("user is logged in successfully-->");
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const user = req.user._id;

  console.log("logout controller -->", user._id);

  await User.findOneAndUpdate(
    req.user?._id,
    {
      $unset: {
        refreshToken: 1, //this remove the field from document
      },
    },
    {
      new: true,
    }
  );

  console.log("logout the user from database");

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out!!"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body.refreshToken;
  console.log("refreshing the token --> ", token);
  if (!token) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    console.log("verifying the token-----");
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    console.log("decoded the token ----", decoded);
    const user = await User.findById(decoded?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (token != user?.refreshToken) {
      throw new ApiError(401, "refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user?._id
    );

    await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          refreshToken,
        },
      },
      {
        new: true,
      }
    );

    console.log("done refreshing the new token");
    return res
      .status(201)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken,
          },
          "token is refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "evalid refresh token");
  }
});

const sendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  console.log("send otp -> ", email);
  if (!isEmailValid(email)) {
    throw new ApiError(400, "Email is not valid");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "Email not found");
  }

  const { resetOtp, resetOtpExpiry } = user.resetPassword || {};

  if (resetOtp && resetOtpExpiry && resetOtpExpiry > Date.now()) {
    throw new ApiError(
      400,
      `Otp is already send. Please try after ${(resetOtpExpiry - Date.now()) / 1000} seconds`
    );
  }

  const max = 999999;
  const min = 100000;
  const generateOtp = Math.floor(Math.random() * (max - min + 1)) + min;
  console.log(generateOtp);

  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: "Reset Password",
    text: `otp : ${generateOtp} valid till 5min`,
  };

  transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      console.error("Error occured: ", error);
      return res
        .status(500)
        .json(
          new ApiError(500, "Error in sending email. Please try again later.")
        );
    } else {
      console.log("Email sent:");
      user.resetPassword = {
        resetOtp: generateOtp,
        resetOtpExpiry: Date.now() + 5 * 60 * 1000,
      };
      await user.save();
      return res
        .status(200)
        .json(new ApiResponse(200, {}, "Email is sent successfully"));
    }
  });
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ ValidateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(201, {}, "password is changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  console.log("current user --> ", req.user?.username);
  return res
    .status(200)
    .json(
      new ApiResponse(200, req.user, "current user is fetched successfully")
    );
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { username, fullname } = req.body;

  if (!fullname || !username) {
    throw new ApiError(400, "all fields are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { fullname, username },
    },
    { new: true }
  ).select("-password");

  console.log("modefied user ", user);
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  console.log("req file --> ", req.file);
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, "Error while uploadind on avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "avatar is updated successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;
  console.log("update cover image");
  console.log(req.file);
  if (!coverImageLocalPath) {
    throw new ApiError(400, "coverImage file is missing");
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImage.url) {
    throw new ApiError(400, "Error while uploadind on avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "coverImage is updated successfully"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username?.trim()) {
    throw new ApiError(400, "username is missing");
  }

  console.log("displaying the channel profile of ", username);

  const channel = await User.aggregate([
    {
      $match: { username },
    },
    {
      $lookup: {
        from: "subscriptions",
        as: "subscribers",
        localField: "_id",
        foreignField: "channel",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        as: "subscribedTo",
        localField: "_id",
        foreignField: "subscriber",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        subscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscibed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullname: 1,
        username: 1,
        email: 1,
        avatar: 1,
        coverImage: 1,
        subscribersCount: 1,
        subscribedToCount: 1,
        isSubscibed: 1,
      },
    },
  ]);

  console.log(channel);

  if (!channel?.length) {
    throw new ApiError(400, "channel don't exist");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, channel[0], "fetched user profile successfully")
    );
});

const getWatchHistory = asyncHandler(async (req, res) => {
  console.log("user watch history -> ", req.user?._id, req.user?.username);

  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user?._id),
        owner: new mongoose.Types.ObjectId(owner),
      },
    },
    {
      $lookup: {
        from: "videos",
        as: "watchHistory",
        localField: "watchHistory",
        foreignField: "_id",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullname: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "owner",
              },
            },
          },
        ],
      },
    },
  ]);

  console.log(user);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user[0].watchHistory,
        "watchHistory fetched successfully"
      )
    );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  sendOtp,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
};
