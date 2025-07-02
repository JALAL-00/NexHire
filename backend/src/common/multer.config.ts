import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs'; 

const createFolderIfNotExists = (folderPath: string) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true }); 
  }
};

export const multerOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      // 2. DEFINE the base upload path
      const uploadPath = './uploads';
      const imageType = req.body.imageType; // 'profilePicture' or 'coverPhoto'
      
      // 3. DETERMINE the sub-folder
      const subFolder = imageType === 'profilePicture' ? 'profile-pics' : 'cover-photos';
      const destinationFolder = `${uploadPath}/${subFolder}`;

      // 4. ENSURE the destination folder exists before saving
      createFolderIfNotExists(destinationFolder);

      cb(null, destinationFolder);
    },
    filename: (req, file, cb) => {
      const userId = (req as any).user.id;
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extension = extname(file.originalname);
      cb(null, `user-${userId}-${uniqueSuffix}${extension}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 5, // 5 MB
  },
};