const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);

const types = [
  'info',
  'critical'
];

router
  .get('/', (req, res, next) => {
    let filter;
    let limit = req.query.limit && parseInt(req.query.limit);
    let offset = req.query.offset && parseInt(req.query.offset);

    if (req.query.type) {
      filter = req.query.type.split(':');
      for (let i = 0; i < filter.length; i++) {
        if (!types.includes(filter[i])) {
          return res.status(400).send('Incorrect type');
        }
      }
    }

    sendEvents(res, filter, limit, offset);
  })
  .post('/', (req, res, next) => {
    let filter;
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

    sendEvents(res, filter, limit, offset);
  });

function sendEvents(res, filter, limit, offset) {
  readFileAsync(path.resolve('./server/data/events.json'), {encoding: 'utf-8'})
      .then((data) => {
        let filteredEvents = JSON.parse(data).events;
        if (filter) {
          filteredEvents = filteredEvents.filter((element) => filter.includes(element.type));
        }
        if (offset || limit) {
          let start = offset ? Math.max(0, offset) : 0;
          let end = limit > 0 ? start + limit : undefined;
          filteredEvents = filteredEvents.slice(start, end);
        }

        res.json({events: filteredEvents});
      })
      .catch((err) => next(err));
}

module.exports = router;