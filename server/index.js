const express = require('express');
const app = express();
const port = 8000;

app.use(require('./routes/status'));
app.use(require('./routes/events'));
app
    .use((req, res, next) => {
        const err = new Error('<h1>Page not found</h1>');
        res.status(404);
        next(err);
    })
    .use((err, req, res, next) => {
        res.status(err.status || 500);
        return res.send(`${err.message}`);
    });

app.listen(port, () => {
    console.log(`Working on port ${port}`);
});