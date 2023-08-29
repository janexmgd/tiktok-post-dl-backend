import app from './src/main.js';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
const app_name = process.env.APP_NAME;
const app_port = process.env.APP_PORT;
// console.log(typeof process.cwd());
app.listen(app_port || 3000, '0.0.0.0', () => {
  console.log(`${app_name} RUN at PORT ${app_port}`);
});
app.get('/', (req, res) => {
  res.status(200).send({
    status: 'ok',
  });
});
