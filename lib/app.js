const express = require('express');
const app = express();

const morgan = require('morgan')('dev');
const cors = require('cors')();
const redirectHttp = require('./redirect-http')();
const checkDb = require('./check-connection')();
const errorHandler = require('./auth/error-handler')();
const ensureAuth = require('./auth/ensure-auth')();

app.use(morgan);
app.use(cors);

app.use(express.static('./public'));

const expense = require('./routes/expenses');
app.use(checkDb);
app.use('/api/expenses', expense);

const category = require('./routes/categories');
app.use('/api/categories', category);

const auth = require('./routes/auth');
app.use('/api/auth', auth);

app.use(errorHandler);

module.exports = app;