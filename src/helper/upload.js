import multer from 'multer';
import response from './response.js';
const { failed } = response;
const multerUpload = multer({
  fileFilter: (req, file, cb) => {
    const fileSize = parseInt(req.headers['content-length']);
    const maxSize = 2 * 1024 * 1024;
    // console.log(file);
    if (file.mimetype != 'text/plain') {
      const error = {
        message: 'File must have extension .txt',
      };
      return cb(error, false);
    }
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
