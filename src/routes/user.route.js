import { Router } from "express";
import { changeCurrentPasswod, currentUser, login, logout, refresAccessToken, registerUser, updateAccount } from "../controllers/user.controller.js";
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
router.route("/current-user").get(verifyJWT, currentUser);
router.route("/update-user").post(verifyJWT, updateAccount);

export default router;
