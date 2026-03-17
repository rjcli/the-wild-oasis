import { Router } from "express";
import {
  getAllCabins,
  getCabin,
  getCabinsStatus,
  createCabin,
  updateCabin,
  deleteCabin,
} from "../controllers/cabinController";
import { protect } from "../middleware/auth";
import { uploadCabinImage } from "../middleware/upload";
import { validate } from "../middleware/validate";
import { createCabinSchema, updateCabinSchema } from "../schemas/cabinSchemas";

const router = Router();

router
  .route("/")
  .get(getAllCabins)
  .post(protect, uploadCabinImage, validate(createCabinSchema), createCabin);

router.get("/status", getCabinsStatus);

router
  .route("/:id")
  .get(getCabin)
  .patch(protect, uploadCabinImage, validate(updateCabinSchema), updateCabin)
  .delete(protect, deleteCabin);

export default router;
