import express, { Router, NextFunction, Response, Request } from 'express';
import fs from 'fs';
import path from 'path';

const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);

const types: Array<string> = [
  'info',
  'critical'
];

export const eventsRouter: Router = express.Router()
  .get('/', (req: Request, res: Response, next: NextFunction) => {
    let filter: Array<string>;
    let limit: number = req.query.limit && parseInt(req.query.limit);
    let offset: number = req.query.offset && parseInt(req.query.offset);

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
    let filter: Array<string>;
    let limit = req.body.limit && parseInt(req.body.limit);
    let offset = req.body.offset && parseInt(req.body.offset);

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

interface Element {
  type: string,
  title: string,
  source: string,
  time: string,
  description: Object | null,
  icon: string,
  size: string
}

function sendEvents(res: Response, filter: Array<string>, limit: number, offset: number, next: NextFunction): void {
  readFileAsync(path.resolve('./server/data/events.json'), {encoding: 'utf-8'})
      .then((data: string) => {
        console.log(data);
        let filteredEvents: Array<Object> = JSON.parse(data).events;
        if (filter) {
          filteredEvents = filteredEvents.filter((element: Element) => filter.includes(element.type));
        }
        if (offset || limit) {
          let start = offset ? Math.max(0, offset) : 0;
          let end = limit > 0 ? start + limit : undefined;
          filteredEvents = filteredEvents.slice(start, end);
        }

        res.json({events: filteredEvents});
      })
      .catch((err: Error) => next(err));
}