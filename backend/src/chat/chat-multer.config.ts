import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

const createFolderIfNotExists = (folderPath: string) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

export const chatMulterOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = './uploads/chat-media';
      createFolderIfNotExists(uploadPath);
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extension = extname(file.originalname);
      cb(null, `media-${uniqueSuffix}${extension}`);
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * 10, // 10 MB limit for chat files
  },
};