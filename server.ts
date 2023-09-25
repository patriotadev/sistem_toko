import express, {Express, Request, Response} from 'express';
import bodyParser from 'body-parser';
import AppRouter from './src/router';
import cors from 'cors';
require('dotenv').config();
const PORT: number = Number(process.env.PORT);
const app: Express = express();

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(AppRouter);

app.listen(PORT, () => {
    console.log('\x1b[36m',`Server is running on ${process.env.HOST_URL}:${process.env.PORT}`);
}).on("error", (e) => {
    console.log('\x1b[31m', e);
})