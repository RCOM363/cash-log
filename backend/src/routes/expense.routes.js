import { Router } from "express";
import {
  addExpense,
  deleteExpense,
  getExpenses,
  updateExpense,
} from "../controllers/expense.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/add-expense").post(verifyJWT, addExpense);
router.route("/get-expenses").get(verifyJWT, getExpenses);
router.route("/delete-expense/:id").delete(verifyJWT, deleteExpense);
router.route("/update-expense/:id").patch(verifyJWT, updateExpense);

export default router;
