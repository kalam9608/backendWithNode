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
    return res.status(400).json({ Error });
  }
  if (fullname == undefined) {
    Error = "fullname name filed is required";
    return res.status(400).json({ Error });
  }
  if (email == undefined) {
    Error = "email name filed is required";
    return res.status(400).json({ Error });
  }
  if (password == undefined) {
    Error = "password name filed is required";
    return res.status(400).json({ Error });
  }

  if (
    [userName, fullname, email, password].some((field) => field.trim() === "")
  ) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const checkUserExist = await User.findOne({ $or: [{ userName }, { email }] });

  if (checkUserExist) {
    return res.status(400).json({
      message: "User is allready exist",
    });
  }


  let coverImageLocalPath;
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path
  }


  // const avatarLocalPath = req.files?.avatar[0]?.path;

  let avatarLocalPath;

  if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
    avatarLocalPath = req.files.avatar[0].path
  }

  console.log("avatarLocalPath===>", avatarLocalPath)



  if (!avatarLocalPath) {
    return res.status(400).json({
      message: "This is an error!!",
    });
  }

  const avatar = await uploadFileCloudinary(avatarLocalPath);
  const cover = await uploadFileCloudinary(coverImageLocalPath);

  // check becouse if any chance image is not uplaoded
  if (!avatar) {
    return res.status(400).json({
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
    return res.status(400).json({
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

  // if (!(userName || email)) {
  //   return res.status(400).send({
  //     message: "email or user name  is required",
  //   });
  // }


  if (!userName && !email) {
    return res.status(400).json({
      message: "email or user name  is required",
    });
  }

  const user = await User.findOne({
    $or: [{ userName }, { email }]
  })



  if (!user) {
    return res.status(400).json({ message: "User is not register" });
  }

  const isPassword = await user.isPasswordCorect(password);


  if (!isPassword) {
    return res.status(400).json({ message: "Invalid email or Password" });
  }

  const { accessToken, refreshToken } = await genrateAccessAndRefreshToken(user._id);



  // send the response to the user
  const logedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: logedInUser,
          refreshToken,
          accessToken,
        },
        "User Loged in successfully",
      ),
    );
});

const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true, // return me old wala refresh token mil sakta h
    },
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(   new ApiResponse(
      200,
      {
     
      },
      "User Loged out successfully",
    ),);
});

export { registerUser, login, logout };
