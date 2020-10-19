const mongoose = require('mongoose');

const viewLikeSchema = new mongoose.Schema({
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
  }

});

mongoose.model('like', viewLikeSchema);
