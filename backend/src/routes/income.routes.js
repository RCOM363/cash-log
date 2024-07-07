import { Router } from "express";
import {
  addIncome,
  getIncomes,
  deleteIncome,
  updateIncome,
} from "../controllers/income.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/add-income").post(verifyJWT, addIncome);
router.route("/get-incomes").get(verifyJWT, getIncomes);
router.route("/delete-income/:id").delete(verifyJWT, deleteIncome);
router.route("/update-income/:id").patch(verifyJWT, updateIncome);

export default router;
