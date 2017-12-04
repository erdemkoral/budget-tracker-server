const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const Expense = require('../models/expense');

function delayPromise(duration) {
    return function(...args){
        return new Promise(function(resolve){
            setTimeout(function(){
                resolve(...args);
            }, duration);
        });
    };
}

router
    .get('/', (req, res, next) => {
        Expense.find(req.query).lean()
            .populate('category')
            .then(delayPromise(1500))
            .then(expenses => res.send(expenses))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        Expense.findById(req.params.id).lean()
            .populate('category')
            .then(expense => res.send(expense))
            .catch(next);
    })
    .post('/', bodyParser, (req, res, next) => {
        new Expense(req.body).save()
            .then(saved => res.send(saved))
            .catch(err => {
                next(err);
            });
    })
    .delete('/:id', (req, res, next) => {
        Expense.findByIdAndRemove(req.params.id)
            .then(removed => res.send(removed))
            .catch(next);
    })
    .put('/:id', bodyParser, (req, res, next) => {
        Expense.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .then(updated => res.send(updated))
            .catch(next);
    });

module.exports = router;