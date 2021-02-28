import 'reflect-metadata';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';

import createConnection from './database';
import { router } from './routes';
import { AppError } from './errors/AppError';

createConnection();
const app = express();

app.use(express.json());
app.use(router);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _request: Request, response: Response, _next: NextFunction) => {
	if (err instanceof AppError) {
		return response.status(err.statusCode).json({
			message: err.message
		});
	}
	return response.status(500).json({
		status: 'Error',
		message: `Internal server error ${err.message}`
	});
});

app.get('*', (req, res) => {
	return res.status(404).send({
		status: 404,
		message: 'URL not found',
		url: req.protocol + "://" + req.get('host') + req.url,
	});
});

export { app };