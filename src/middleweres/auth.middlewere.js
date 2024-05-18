import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Brear ", "");

    if (!token) {
      res.status(401).json({ message: "anauthorized token" });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-passwoed -refreshToken",
    );

    if (!user) {
      return res.status(401).json({ message: "invalid user token" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "invalid access token" });
  }
});
