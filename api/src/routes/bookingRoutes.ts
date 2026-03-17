import { Router } from "express";
import {
  getAllBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
  getTodayActivity,
  getBookingsAfterDate,
  getStaysAfterDate,
  checkCabinAvailability,
} from "../controllers/bookingController";
import { protect } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  createBookingSchema,
  updateBookingSchema,
} from "../schemas/bookingSchemas";

const router = Router();

// All booking routes require authentication
router.use(protect);

// Special query routes — must be defined before /:id
router.get("/today-activity", getTodayActivity);
router.get("/after-date", getBookingsAfterDate);
router.get("/stays-after-date", getStaysAfterDate);
router.get("/check-availability", checkCabinAvailability);

router
  .route("/")
  .get(getAllBookings)
  .post(validate(createBookingSchema), createBooking);

router
  .route("/:id")
  .get(getBooking)
  .patch(validate(updateBookingSchema), updateBooking)
  .delete(deleteBooking);

export default router;
