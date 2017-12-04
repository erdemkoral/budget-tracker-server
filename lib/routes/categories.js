const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const Category = require('../models/category');
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
    Category.find(req.query).lean()
        .then(delayPromise(1500))
        .then(categories => res.send(categories))
        .catch(next);
})

.get('/:id', (req, res, next) => {
    const id = req.params.id;

    Promise.all([
        Category.findById(id).lean(),
        Expense.find({ category: id }).lean()
    ])
    .then(([category, expenses]) => {
        if(!category) throw { 
            code: 404, 
            error: `category ${id} does not exist`
        };
        category.expenses = expenses;
        res.send(category);
    })
    .catch(next);
})

.post('/', bodyParser, (req, res, next) => {
    new Category(req.body).save()
        .then(saved => res.send(saved))
        .catch(err => {
            next(err);
        });
})
.delete('/:id', (req, res, next) => {
    const category = req.params.id;
    
    Promise.all([
        Category.findByIdAndRemove(category),
        Expense.find({ category }).remove()
    ])
    .then(([category]) => res.send(category))
    .catch(next);
})

.put('/:id', bodyParser, (req, res, next) => {
    Category.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(updated => res.send(updated))
        .catch(next);
});

module.exports = router;