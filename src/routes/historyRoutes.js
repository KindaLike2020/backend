const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');

const History = mongoose.model('viewHistory');
const Like = mongoose.model('like');
const Review = mongoose.model('review');

const router = express.Router();

router.use(requireAuth);

router.get('/view_history', async (req, res) => {
  //console.log(req.user._id )
  const history = await History.find({ userId: req.user._id });
  //console.log(history)
  res.send(history);
});

router.post('/view_history', async (req, res) => {
  const { id, name, picture, address } = req.body;
  try {
    const history = new History({ restaurantId: id, userId: req.user._id, name: name, picture: picture, address: address});
    //console.log(history)
    await history.save();
    res.send(history);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

router.post('/like_history', async (req, res) => {
    const { id, name, picture, address, time } = req.body;
    //console.log('res id is ', id)
    //console.log('time is ', time)
    try {
      const like = new Like({ restaurantId: id, userId: req.user._id, name: name, picture: picture, address: address, createAt: time});
      //console.log(history)
      await like.save();
      res.send(like);
    } catch (err) {
      res.status(422).send({ error: err.message });
    }
  });

router.post('/remove_like', async (req, res) => {
    const { id } = req.body;
    //console.log('res id is ', id)
    //console.log('address is ', address)
    try {
        await Like.deleteMany({restaurantId: id})
    } catch (err) {
        res.status(422).send({ error: err.message });
    }
});

router.get('/view_like', async (req, res) => {
    //console.log(req.user._id )
    const like = await Like.find({ userId: req.user._id });
    //console.log(history)
    res.send(like);
  });


router.post('/review_history', async (req, res) => {
  const { id, name, picture, address, time, review } = req.body;
  try {
    const review_doc = await Review.findOne({ restaurantId: id});
    if (review_doc === null){
      const new_review_doc = new Review({ restaurantId: id, userId: req.user._id, name: name, picture: picture, address: address, createAt: time, review: review});
      await new_review_doc.save();
      res.send(new_review_doc);
    } else {
      var update = {
        review: review
      };
      const review_updated = await Review.updateOne({ restaurantId: id}, update);
      res.send(review_updated);
    }
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

router.get('/view_review', async (req, res) => {
  console.log('view_review: ', req.user._id )
  const review = await Review.find({ userId: req.user._id });
  console.log('review is ', review)
  res.send(review);
});

module.exports = router;
