import express, { NextFunction, Response, Request } from 'express';
import cors from 'cors';
import { statusRouter } from './routes/status';
import { eventsRouter } from './routes/events';

const app: express.Application = express();
const port: string = process.env.PORT || '8000';


app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

app.use('/status', statusRouter);
app.use('/api/events', eventsRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
	res
		.type('text/html')
		.status(404)
		.send("<h1>Page not found</h1>");
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	process.stdout.write(err.stack + '');
	res.status(500).send('Error');
});

app.listen(port, () => {
	console.log(`Working on port ${port}`);
});
