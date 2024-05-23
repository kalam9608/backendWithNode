import { Router } from "express";
import { changeCurrentPasswod, login, logout, refresAccessToken, registerUser } from "../controllers/user.controller.js";
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
router.route("/change-password").post(verifyJWT, changeCurrentPasswod)

//secured route
router.route("/logout").post(verifyJWT, logout);
router.route("/refresh-token").post(refresAccessToken);

export default router;
