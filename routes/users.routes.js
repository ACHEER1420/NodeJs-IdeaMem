const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

// Load User Model
require('../models/User');
const UserModel = mongoose.model('users');

// User Login Page Route
router.get('/login', (req, res) => {
  res.render('users/login');
});

// User Register Page Route
router.get('/register', (req, res) => {
  res.render('users/register');
});

// Handle User Register Route
router.post('/register', async (req, res) => {
  let errors = [];

  if (req.body.password != req.body.password2) {
    errors.push({ text: 'Password do not match' });
  }

  if (req.body.password.length < 4) {
    errors.push({ text: 'Password must be at least 4 characters' });
  }

  const isEmailExisted = await UserModel.findOne({ email: req.body.email });
  if (isEmailExisted) {
    errors.push({text: 'Email is already existed'})
  }

  if (errors.length > 0) {
    res.render('users/register', {
      errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2,
    });
  } else {
    const newUser = new UserModel({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then((user) => {
            req.flash('success_msg', 'You are now registered and can log in');
            res.redirect('/users/login');
          })
          .catch((error) => {
            console.log(error);
            return;
          });
      });
    });
  }
});

module.exports = router;
