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

if(process.env.NODE_ENV === 'production') {
    app.use(redirectHttp);
}

app.use(express.static('./public'));

const auth = require('./routes/auth');
const category = require('./routes/categories');
const expense = require('./routes/expenses');
const user = require('.routers/users');

if(process.env.NODE_ENV !== 'production') {
    app.use(checkDb);
}

app.use('/api/auth', auth);
app.use('/api/categories', ensureAuth, category);
app.use('/api/expenses', ensureAuth, expense);
app.user('api/user', ensureAuth, user);

app.use(errorHandler);

module.exports = app;