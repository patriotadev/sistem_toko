import express, {Express, Request, Response, NextFunction} from 'express';
import bodyParser from 'body-parser';
import AppRouter from './src/router';
import cors from 'cors';
require('dotenv').config();
const debug = require('debug')('hbpos-server:server');
const PORT: number = Number(process.env.PORT);
const app: Express = express();

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(AppRouter);

app.listen(PORT, () => {
    debug('\x1b[36m',`Server is running on ${process.env.HOST_URL}:${process.env.PORT}`);
    debug('\x1b[35m',`Database connect on ${process.env.DATABASE_URL}`);
}).on("error", (e) => {
    debug('\x1b[31m', e);
})
