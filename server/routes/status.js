const express = require('express');
const router = express.Router();
const startingTime = new Date();

router
    .all('/', (req, res) => {
        res.status(200).send(diffTime());
    })

const diffTime = () => {
    const currTime = new Date();
    const diff = new Date();
    diff.setTime(currTime - startingTime);
    return diff.toLocaleTimeString('en-GB', {timeZone: 'UTC'});
}

module.exports = router;