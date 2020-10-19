const mongoose = require('mongoose');

const viewReviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  restaurantId: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  picture: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  createAt: {
    type: String,
    default: ''
  },
  review: {
    type: String,
    default: ''
  }
});

mongoose.model('review', viewReviewSchema);
