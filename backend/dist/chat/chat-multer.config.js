"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatMulterOptions = void 0;
const multer_1 = require("multer");
const path_1 = require("path");
const fs = require("fs");
const createFolderIfNotExists = (folderPath) => {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
};
exports.chatMulterOptions = {
    storage: (0, multer_1.diskStorage)({
        destination: (req, file, cb) => {
            const uploadPath = './uploads/chat-media';
            createFolderIfNotExists(uploadPath);
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const extension = (0, path_1.extname)(file.originalname);
            cb(null, `media-${uniqueSuffix}${extension}`);
        },
    }),
    limits: {
        fileSize: 1024 * 1024 * 10,
    },
};
//# sourceMappingURL=chat-multer.config.js.map