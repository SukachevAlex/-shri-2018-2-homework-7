const express = require('express');
const router = express.Router();
const startingDate = new Date();
const { getDiffBetweenDates, msToReadableTime } = require('../helpers/date');

router
    .all('/status', (req, res) => {
        let diff = getDiffBetweenDates(startingDate, new Date());
        res.send(msToReadableTime(diff));
    })

module.exports = router;