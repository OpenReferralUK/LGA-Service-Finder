import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import config from './config';
import path from 'path';

const { port, version } = config;

const start = async () => {
    const app = express()

        .use(cookieParser())
        .use(session({ secret: 'engine matrix eyebrow crack', cookie: { maxAge: 6000000 }, resave: true, saveUninitialized: true }))
        .use(express.json())
        .use(express.urlencoded())

        .use((_req, res, next) => { res.cookie('SERVED_BY_EXPRESS', 'true'); next(); })
        .use(express.static('docs'))

        .get('*', (_req, res) => {
            res.sendFile(path.join(__dirname, '../../docs/index.html'));
        });

    app.listen(port, () => console.log(`starting version ${version} - listening on port ${port}`));
};

start();
