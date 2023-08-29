import express from '../app/express.js';
import tiktokdlRouter from './tiktokdl.router.js';
const router = express.Router();
router.use(tiktokdlRouter);
export default router;
