import fs from 'fs';
import response from './response.js';
const { failed } = response;
export const fileReader = (filePath, res) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return failed(res, {
        code: err.code || 500,
        status: 'error' || 'failed',
        message: err.message || 'internal server error',
      });
    } else {
      return data;
    }
  });
};
