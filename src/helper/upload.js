import multer from 'multer';
import path from 'path';
import response from './response.js';
import crypto from 'crypto';
const { failed } = response;
const multerUpload = multer({
  // storage: multer.diskStorage({
  //   destination: (req, file, cb) => {
  //     cb(null);
  //   },
  //   filename: (req, file, cb) => {
  //     const ext = path.extname(file.originalname);
  //     const filename = `${crypto
  //       .randomBytes(16)
  //       .toString('hex')}${crypto.randomInt(99)}${ext}`;
  //     cb(null, filename);
  //   },
  // }),
  fileFilter: (req, file, cb) => {
    const fileSize = parseInt(req.headers['content-length']);
    const maxSize = 2 * 1024 * 1024;
    if (fileSize > maxSize) {
      const error = {
        message: 'File size exceeds 2 MB',
      };
      return cb(error, false);
    }

    cb(null, true);
  },
});

// middleware
const upload = (req, res, next) => {
  const multerSingle = multerUpload.single('list');
  multerSingle(req, res, (err) => {
    if (err) {
      failed(res, {
        code: 500,
        status: 'error',
        message: err.message,
        error: [],
      });
    } else {
      next();
    }
  });
};

export default upload;
