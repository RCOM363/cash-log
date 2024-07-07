import { Router } from "express";
import {
  getDashboardData,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-accesstoken").post(refreshAccessToken);
router.route("/dashboard-data").get(verifyJWT, getDashboardData);
export default router;
