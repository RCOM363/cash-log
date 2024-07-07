import { Router } from "express";
import { getCategories } from "../controllers/category.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/get-categories/:type").get(verifyJWT, getCategories);

export default router;
