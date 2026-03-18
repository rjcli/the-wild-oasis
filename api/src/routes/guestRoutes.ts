import { Router } from 'express';
import {
  getAllGuests,
  getGuest,
  createGuest,
  updateGuest,
  deleteGuest,
} from '../controllers/guestController';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createGuestSchema, updateGuestSchema } from '../schemas/guestSchemas';

const router = Router();

router.use(protect);

router
  .route('/')
  .get(getAllGuests)
  .post(validate(createGuestSchema), createGuest);

router
  .route('/:id')
  .get(getGuest)
  .patch(validate(updateGuestSchema), updateGuest)
  .delete(deleteGuest);

export default router;
