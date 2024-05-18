import { Router } from "express";
import { login, logout, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middleweres/multer.middlewere.js";
import { verifyJWT } from "../middleweres/auth.middlewere.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser,
);

router.route("/login").post(login);

//secured route
router.route("/logout").post(verifyJWT, logout);

export default router;
