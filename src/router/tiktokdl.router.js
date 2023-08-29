import express from '../app/express.js';
import tiktokdlController from '../controller/tiktokdl.controller.js';
import upload from '../helper/upload.js';
const { single, multi } = tiktokdlController;
const tiktokdlRouter = express.Router();

// single link
tiktokdlRouter.post('/tiktokdl/single', single);
tiktokdlRouter.post('/tiktokdl/multi', upload, multi);
export default tiktokdlRouter;
