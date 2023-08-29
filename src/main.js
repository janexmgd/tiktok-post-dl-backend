import express from './app/express.js';
import router from './router/index.js';
import cors from 'cors';
import helmet from 'helmet';

const main = express();
main.use(cors());
main.use(helmet());
main.use(express.json());
main.use(router);

export default main;
