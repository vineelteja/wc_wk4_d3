const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const auth = require('http-auth');
const {check, validationResult} = require('express-validator');

const router = express.Router();
const Registration = mongoose.model('Registration');
const basic = auth.basic({
    file: path.join(__dirname, '../users.htpasswd'),
});

router.get('/', (req, res) => {
    //res.send('It works!');
    res.render('index', {title: 'Food NewsLetter', isHomePage: true});
});

router.get('/register', (req, res) => {
    //res.send('It works!');
    res.render('form');
});

router.get('/registrants', basic.check((req, res) => {
    Registration.find()
        .then((registrations) => {
            res.render('registrants', {title: 'Listing registrations', registrations, admin: true});
        })
        .catch(() => {
            res.send('Sorry! Something went wrong.');
        });
}));

router.post('/',
    [
        check('name')
            .isLength({min: 1})
            .withMessage('Please enter a name'),
        check('email')
            .isLength({min: 1})
            .withMessage('Please enter an email'),
    ],
    (req, res) => {
        //console.log(req.body);
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            const registration = new Registration(req.body);
            registration.save()
                .then(() => {
                    res.render('thankyou', {title: 'Thank You'})
                })
                .catch((err) => {
                    console.log(err);
                    res.send('Sorry! Something went wrong.');
                });
        } else {
            res.render('form', {
                title: 'Registration form',
                errors: errors.array(),
                data: req.body,
            });
        }
    });

module.exports = router;