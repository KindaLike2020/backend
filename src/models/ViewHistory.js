const mongoose = require('mongoose');

const viewHistorySchema = new mongoose.Schema({
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
  }

});

mongoose.model('viewHistory', viewHistorySchema);
