import multer from 'multer';
import { config } from '../config';

// Configure multer for memory storage
const storage = multer.memoryStorage();

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = config.ALLOWED_FILE_TYPES;
  const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
  
  if (fileExtension && allowedTypes.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${fileExtension} is not allowed. Allowed types: ${allowedTypes.join(', ')}`));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.MAX_FILE_SIZE,
    files: 1 // Only allow one file at a time
  }
});

export const uploadSingle = upload.single('document');
