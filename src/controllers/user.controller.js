import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { uploadFileCloudinary } from "../utils/cloudinary.js";
import { ErrorApi } from "../utils/ErrorApi.js";

const genrateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.genrateAccessToken();
    const refreshToken = user.genrateRefreshToken();

    // save the refresh token in the data base
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    return res.status(500).json({ message: "something went wrong" });
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { userName, fullname, email, password } = req.body;

  let Error = "";
  if (userName == undefined) {
    Error = "User name filed is required";
    return res.status(400).send({ Error });
  }
  if (fullname == undefined) {
    Error = "fullname name filed is required";
    return res.status(400).send({ Error });
  }
  if (email == undefined) {
    Error = "email name filed is required";
    return res.status(400).send({ Error });
  }
  if (password == undefined) {
    Error = "password name filed is required";
    return res.status(400).send({ Error });
  }

  if (
    [userName, fullname, email, password].some((field) => field.trim() === "")
  ) {
    return res.status(400).send({
      message: "All fields are required",
    });
  }

  const checkUserExist = await User.findOne({ $or: [{ userName }, { email }] });

  if (checkUserExist) {
    return res.status(400).send({
      message: "User is allready exist",
    });
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    return res.status(400).send({
      message: "This is an error!!",
    });
  }

  const avatar = await uploadFileCloudinary(avatarLocalPath);
  const cover = await uploadFileCloudinary(coverImageLocalPath);

  // check becouse if any chance image is not uplaoded
  if (!avatar) {
    return res.status(400).send({
      message: "This is an error!",
    });
    // throw new ApiError("409", "avtar  field is required");
  }

  const user = await User.create({
    userName: userName.toLowerCase(),
    fullname,
    avatar: avatar?.url,
    coverImage: cover?.url ?? "", // if it is not there becouse it is not required,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  if (!createdUser) {
    return res.status(400).send({
      message: "This is an error!",
    });
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User created successfully"));
});

const login = asyncHandler(async (req, res) => {
  // get value from the user
  // check user name or email
  // find the user
  // password check
  // access and refresh token
  // send cookie

  const { email, userName, password } = req.body;

  if (!userName || !email) {
    return res.status(400).send({
      message: "email or user name  is required",
    });
  }

  const user = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (!user) {
    return res.status(400).json({ message: "User is not register" });
  }

  const isPassword = user.isPasswordCorect(password);

  if (!isPassword) {
    return res.status(400).json({ message: "Invalid email or Password" });
  }

  const { accessToken, refreshToken } = genrateAccessAndRefreshToken(user._id);

  // send the response to the user
  const logedInUser = await User.findById(user._id).select(
    "-passwoed -refreshToken",
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res.status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(new ApiResponse(200,{
    user:logedInUser,
    refreshToken,
    accessToken
  },"User Loged in successfully"))
});

export { registerUser, login };
