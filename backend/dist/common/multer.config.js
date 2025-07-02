"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerOptions = void 0;
const multer_1 = require("multer");
const path_1 = require("path");
const fs = require("fs");
const createFolderIfNotExists = (folderPath) => {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
};
exports.multerOptions = {
    storage: (0, multer_1.diskStorage)({
        destination: (req, file, cb) => {
            const uploadPath = './uploads';
            const imageType = req.body.imageType;
            const subFolder = imageType === 'profilePicture' ? 'profile-pics' : 'cover-photos';
            const destinationFolder = `${uploadPath}/${subFolder}`;
            createFolderIfNotExists(destinationFolder);
            cb(null, destinationFolder);
        },
        filename: (req, file, cb) => {
            const userId = req.user.id;
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const extension = (0, path_1.extname)(file.originalname);
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
        fileSize: 1024 * 1024 * 5,
    },
};
//# sourceMappingURL=multer.config.js.map