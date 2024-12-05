import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

export const configureMiddleware = (app: express.Application) => {
    app.set('trust proxy', 1);
    
    app.use(helmet());
    
    app.use(cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true
    }));
    
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    
    app.use(compression());
    
    app.use(morgan('dev'));
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, 
        max: 100 
    });
    app.use('/api', limiter);
};