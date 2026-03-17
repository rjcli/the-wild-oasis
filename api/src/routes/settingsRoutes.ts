import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/settingsController";
import { protect } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { updateSettingsSchema } from "../schemas/settingsSchemas";

const router = Router();

router.use(protect);

router
  .route("/")
  .get(getSettings)
  .patch(validate(updateSettingsSchema), updateSettings);

export default router;
