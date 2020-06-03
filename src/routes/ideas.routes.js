const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { routeGuard } = require('../helper/auth');

// Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');

// Ideas Page Route
router.get('/', routeGuard, async (req, res) => {
  // Idea.find({})
  //   .sort({ date: 'desc' })
  //   .then((ideas) => {
  //     res.render('ideas/index', {
  //       ideas: ideas.map((idea) => idea.toJSON()),
  //     });
  //   });

  const ideas = await Idea.find({});
  if (!ideas) return;
  ideas.sort((a, b) => a.data - b.date);
  const ideaJSON = ideas.map((idea) => idea.toJSON());

  res.render('ideas/index', {
    ideas: ideaJSON,
  });
});

// Add Idea Form Page Route
router.get('/add', routeGuard, (req, res) => {
  res.render('ideas/add');
});

// Edit Idea item Form Page Route
router.get('/edit/:id', routeGuard, async (req, res) => {
  try {
    const idea = await (await Idea.findById(req.params.id)).toJSON();
    res.render('ideas/edit', {
      idea,
    });
  } catch (error) {
    req.flash('error_msg', error.message);
  }
});

// Process Add Idea Form Route
router.post('/', routeGuard, (req, res) => {
  let errors = [];

  const title = req.body.title;
  const details = req.body.details;

  if (!title) {
    errors.push({ text: 'Please add a title' });
  }
  if (!details) {
    errors.push({ text: 'Please add some details' });
  }

  if (errors.length > 0) {
    res.render('ideas/add', {
      errors,
      title,
      details,
    });
  } else {
    const newIdea = {
      title,
      details,
    };
    new Idea(newIdea).save().then((idea) => {
      req.flash('success_msg', 'Successfully add new item');
      res.redirect('/ideas');
    });
  }
});

// Process Edit Item Form Route
router.put('/:id', routeGuard, async (req, res) => {
  const title = req.body.title;
  const details = req.body.details;
  const id = req.params.id;
  const update = {
    title,
    details,
  };
  try {
    const updatedIdea = await Idea.findByIdAndUpdate(id, update, {
      new: true,
    });
    if (updatedIdea) {
      req.flash('success_msg', 'Successfully update item');
      res.redirect('/ideas');
    }
  } catch (error) {
    req.flash('error_msg', error.message);
  }
});

// Process Delete Item Form Route
router.delete('/:id', routeGuard, async (req, res) => {
  const id = req.params.id;
  Idea.findByIdAndRemove(id)
    .then(() => {
      req.flash('success_msg', 'Item removed');
      res.redirect('/ideas');
    })
    .catch((error) => {
      req.flash('error_msg', error.message);
      console.log(error);
    });
});

module.exports = router;
