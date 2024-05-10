import Router from './router/index.js';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());
app.use(morgan('dev'));

app.use('/', Router);

app.listen(3080, () => {
    console.log('Server is running on port 3080');
});
