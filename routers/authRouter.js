import express from "express";

import {
  registerController,
  loginController,
  testController,
  forgetPasswordController,
  updateProfileController,
  orderContoller,
  allorderContoller,
  updateorderContoller,
} from "../controller/authController.js";
import { requiresignIn, Admin, isAdmin } from "../middleware/authMiddleware.js";
const router = new express.Router();

router.post("/register", registerController);

router.post("/login", loginController);

router.post("/forget-password", forgetPasswordController);

router.get("/test", requiresignIn, Admin, testController);

router.get("/auth-user", requiresignIn, (req, res) => {
  res.status(200).send({ ok: true });
});
router.get("/auth-admin", requiresignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});
router.put("/update-profile", requiresignIn, updateProfileController);
router.get("/order", requiresignIn, orderContoller);
router.get("/all-order", requiresignIn, isAdmin, allorderContoller);
router.put(
  "/update-order/:orderId",
  requiresignIn,
  isAdmin,
  updateorderContoller
);
export default router;
