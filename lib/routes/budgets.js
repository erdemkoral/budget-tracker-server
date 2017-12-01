const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const Budget = require('../models/budget');

router
    .get('/', (req, res, next) => {
        Budget.find(req.query).lean()
            .then(budgets => res.send(budgets))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        Budget.findById(req.params.id).lean()
            .then(budget => res.send(budget))
            .catch(next);
    })
    .post('/', bodyParser, (req, res, next) => {
        new Budget(req.body).save()
            .then(saved => res.send(saved))
            .catch(err => {
                next(err);
            });
    })
    .delete('/:id', (req, res, next) => {
        Budget.findByIdAndRemove(req.params.id)
            .then(removed => res.send(removed))
            .catch(next);
    })
    .put('/:id', bodyParser, (req, res, next) => {
        Budget.findByIdAndUpdate(req.params.id, req.body)
            .then(updated => res.send(updated))
            .catch(next);
    });

module.exports = router;