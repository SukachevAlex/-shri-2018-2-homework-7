const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const dataFile = require('../data/events.json');

router
    .get('/api/events', (req, res) => {
        let chunks = [];
        const stream = fs.createReadStream(path.resolve('./data/events.json'));
        res.header("Content-Type", "text/cache-manifest");

        let types = req.query.type ? req.query.type.split(':') : null;
        let offset = req.query.offset && req.query.offset > 0 ? +req.query.offset : 0;
        let limit = req.query.limit && req.query.limit > 0 ? +offset + +req.query.limit : -1;

        if (types || offset || limit) {
            stream.on('data', function(record) {
                if (types) {
                    chunks = JSON.parse(record).events.filter(el =>
                        types.includes(el.type));
                } else {
                    JSON.parse(record).events.forEach(element => {
                        chunks.push(element);
                    });
                }
            });
            stream.on('error', () => {
                console.log('error reading stream');
            })
            stream.on('end', function() {
                if (chunks.length) {
                    res.send(JSON.stringify(chunks.slice(offset, limit)));
                } else {
                    res.status(400).send('incorrect type');
                }
            })
        } else {
            stream.pipe(res);
        }
    })
    .post((req, res) => {
        res.json(dataFile);
    });




module.exports = router;