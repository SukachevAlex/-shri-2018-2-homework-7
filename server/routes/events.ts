import express, { Router, NextFunction, Response, Request } from 'express';
import fs from 'fs';
import path from 'path';

const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);

const types: string[] = [
  'info',
  'critical',
];

export const eventsRouter: Router = express.Router()
  .get('/', (req: Request, res: Response, next: NextFunction) => {
    let filter: string[] = [];
    const limit: number = req.query.limit && parseInt(req.query.limit, 10);
    const offset: number = req.query.offset && parseInt(req.query.offset, 10);

    if (req.query.type) {
      filter = req.query.type.split(':');
      for (let i = 0; i < filter.length; i++) {
        if (!types.includes(filter[i])) {
          return res.status(400).send('Incorrect type');
        }
      }
    }

    sendEvents(res, filter, limit, offset, next);
  })
  .post('/', (req: Request, res: Response, next: NextFunction) => {
    let filter: string[] = [];
    const limit = req.body.limit && parseInt(req.body.limit, 10);
    const offset = req.body.offset && parseInt(req.body.offset, 10);

    if (req.body.type) {
      filter = req.body.type.split(':');
      for (let i = 0; i < filter.length; i++) {
        if (!types.includes(filter[i])) {
          return res.status(400).send('Incorrect type');
        }
      }
    }

    sendEvents(res, filter, limit, offset, next);
  });

interface IElement {
  type: string,
  title: string,
  source: string,
  time: string,
  description: object | null,
  icon: string,
  size: string
}

function sendEvents(res: Response, filter: string[], limit: number, offset: number, next: NextFunction): void {
  readFileAsync(path.resolve('./server/data/events.json'), {encoding: 'utf-8'})
      .then((data: string) => {
        let filteredEvents: IElement[] = JSON.parse(data).events;
        if (filter) {
          filteredEvents = filteredEvents.filter((element: IElement) => filter.includes(element.type));
        }
        if (offset || limit) {
          const start = offset ? Math.max(0, offset) : 0;
          const end = limit > 0 ? start + limit : undefined;
          filteredEvents = filteredEvents.slice(start, end);
        }

        res.json({events: filteredEvents});
      })
      .catch((err: Error) => next(err));
}
