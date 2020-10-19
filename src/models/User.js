const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  zip_code: {
    type: Number,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  kids: {
    type: String,
    required: true
  },
  relationship: {
    type: String,
    required: true
  },
  veg: {
    type: String,
    required: true
  },
  religion: {
    type: String,
    required: true
  },
  resetToken: {
    type: String,
    required: false
  },
  resetTokenExpires: {
    type: String,
    required: false
  }
});

userSchema.pre('save', function(next) {
  const user = this;
  //console.log('user modified? ', user.isModified('password'))
  //if (!user.isModified('password')) {
  //  return next();
  //}

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      //console.log('user.password ', user.password)
      //console.log('hash in user ', hash)
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword) {
  const user = this;

  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
      if (err) {
        return reject(err);
      }

      if (!isMatch) {
        return reject(false);
      }

      //console.log('old password is correct')
      resolve(true);
    });
  });
};

mongoose.model('User', userSchema);
