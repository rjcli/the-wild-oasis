import path from 'node:path';
import fs from 'node:fs';
import multer, { FileFilterCallback } from 'multer';
import { RequestHandler } from 'express';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';

const cabinUploadsDir = path.join(process.cwd(), env.UPLOADS_DIR, 'cabins');
const avatarUploadsDir = path.join(process.cwd(), env.UPLOADS_DIR, 'avatars');
fs.mkdirSync(cabinUploadsDir, { recursive: true });
fs.mkdirSync(avatarUploadsDir, { recursive: true });

const memoryStorage = multer.memoryStorage();

const imageFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new AppError('Only image files are allowed.', 400));
  }
};

export const uploadCabinImage: RequestHandler = multer({
  storage: memoryStorage,
  limits: { fileSize: env.MAX_FILE_SIZE_BYTES },
  fileFilter: imageFilter,
}).single('image') as unknown as RequestHandler;

export const uploadAvatarImage: RequestHandler = multer({
  storage: memoryStorage,
  limits: { fileSize: env.MAX_FILE_SIZE_BYTES },
  fileFilter: imageFilter,
}).single('avatar') as unknown as RequestHandler;

export { cabinUploadsDir, avatarUploadsDir };
