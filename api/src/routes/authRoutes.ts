import { Router } from "express";
import {
  login,
  signup,
  refreshToken,
  getMe,
  updateMe,
  updatePassword,
  getAllUsers,
  adminUpdateUser,
  adminDeleteUser,
} from "../controllers/authController";
import { protect } from "../middleware/auth";
import { uploadAvatarImage } from "../middleware/upload";
import { validate } from "../middleware/validate";
import {
  loginSchema,
  signupSchema,
  updatePasswordSchema,
  updateMeSchema,
  refreshTokenSchema,
  adminUpdateUserSchema,
} from "../schemas/authSchemas";

const router = Router();

router.post("/login", validate(loginSchema), login);
router.post("/signup", validate(signupSchema), signup);
router.post("/refresh-token", validate(refreshTokenSchema), refreshToken);

router.use(protect);
router.get("/users", getAllUsers);
router.patch("/users/:id", validate(adminUpdateUserSchema), adminUpdateUser);
router.delete("/users/:id", adminDeleteUser);
router.get("/me", getMe);
router.patch(
  "/update-me",
  uploadAvatarImage,
  validate(updateMeSchema),
  updateMe,
);
router.patch(
  "/update-password",
  validate(updatePasswordSchema),
  updatePassword,
);

export default router;
