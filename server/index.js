const express = require('express');
const cors = require('cors');
const app = express();
const port = 8000;

const statusRouter = require('./routes/status');
const eventsRouter = require('./routes/events');

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

app.use('/status', statusRouter);
app.use('/api/events', eventsRouter);

app.use((req, res, next) => {
	res
		.type('text/html')
		.status(404)
		.send("<h1>Page not found</h1>");
});

app.use((err, req, res, next) => {
	process.stdout.write(err.stack);
	res.status(500).send('Error');
});

app.listen(port, () => {
	console.log(`Working on port ${port}`);
});