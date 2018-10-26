import express, { Router, Response, Request } from 'express';

const startingTime: Date = new Date();

export const statusRouter: Router = express.Router()
  .all('/', (req: Request, res: Response) => {
    res.status(200).send(diffTime());
  })

function diffTime(): string {
    const currTime: Date = new Date();
    const diff: Date = new Date();
    diff.setTime(+currTime - +startingTime);
    return diff.toLocaleTimeString('en-GB', {timeZone: 'UTC'});
}