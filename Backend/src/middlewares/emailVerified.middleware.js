//verify if user is present or not
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifiedEmail = asyncHandler(async (req, res, next) => {
  if (req.user?.isVerified) next();
  else throw new ApiError(400, "Please verify your email");
});
