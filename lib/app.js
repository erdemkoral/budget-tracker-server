const express = require('express');
const app = express();

const morgan = require('morgan')('dev');
const cors = require('cors')();
const checkDb = require('./check-connection')();
const errorHandler = require('./error-handler')();

app.use(morgan);
app.use(cors);

app.use(express.static('./public'));

const budget = require('./routes/budgets');
app.use(checkDb);
app.use('/api/budgets', budget);

app.use(errorHandler);

module.exports = app;