import express from 'express';
import viewEngine from './config/viewEngine';
import initRoutes from './route/route';
import cors from 'cors';
import cookieParser from 'cookie-parser';
require('dotenv').config();

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser())

viewEngine(app);
initRoutes(app);

const port = process.env.PORT || 6969;

app.listen(port, () => {
    console.log('Backend Nodejs is runing on the port http://localhost:' + port);
});