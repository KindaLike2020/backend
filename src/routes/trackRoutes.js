const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');

const Track = mongoose.model('Track');

const router = express.Router();

router.use(requireAuth);

router.get('/tracks', async (req, res) => {
  //console.log(req.user._id )
  const tracks = await Track.find({ userId: req.user._id });
  res.send(tracks);
});

router.post('/tracks', async (req, res) => {
  console.log('reached track Routes')
  const { name, locations } = req.body;
  console.log('name is ', name)
  console.log('locations are ', locations)

  if (!name || !locations) {
    return res
      .status(422)
      .send({ error: 'You must provide a name and locations' });
  }

  try {
    console.log('arrived try ')
    console.log('req.user._id is ', req.user)
    const track = new Track({ name, locations, userId: req.user._id });
    console.log('track is ', track)
    await track.save();
    res.send(track);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});


module.exports = router;
