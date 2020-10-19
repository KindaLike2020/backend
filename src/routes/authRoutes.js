const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
var zipcodes = require('zipcodes');

const User = mongoose.model('User');
const router = express.Router();

router.post('/signup', async (req, res) => {
  const { email, password, username, zip_code, age, kids, relationship, veg, religion} = req.body;
  console.log('received: ', email, password, username, zip_code, age, kids, relationship, veg, religion)
  console.log('zip_code is ', zip_code)
  const address = zipcodes.lookup(zip_code);
  console.log('address is ', address)
  const location = address.city + ', ' + address.state
  console.log('location is ', location)


  try {
    const user = new User({ email, password, username, location, zip_code, age, kids, relationship, veg, religion });
    await user.save();

    const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY');
    res.send({ token });
  } catch (err) {
    return res.status(422).send(err.message);
  }
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).send({ error: 'Must provide email and password' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(422).send({ error: 'Invalid password or email' });
  }

  try {
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY');
    res.send({ token });
  } catch (err) {
    return res.status(422).send({ error: 'Invalid password or email' });
  }
});

router.post('/password_reset_send_email', async (req, res) => {
  console.log('arrived /password_reset_send_email')
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  console.log('user: ', user)
  if (user === null){
    //console.log('cannot find this email address')
    return res.status(422).send({ error: 'Cannot find an account associated with the email address' });
  } else {
    //console.log('found the account')
    //const token = crypto.randomBytes(20).toString('hex')
    const token = Math.floor(Math.random()*1000000)+1
    //console.log('token is ', token)
    await user.updateOne({
      resetToken:token,
      resetTokenExpires: Date.now()+360000,
    })
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth:{
        user:'KindaLike2020@gmail.com',
        pass:'KindaLikeApp20!'
      }
    });

    const mailOptions = {
      from: 'KindaLike2020@gmail.com',
      to: email,
      subject: 'Link To Reset Password',
      text:`You are receiving this email because..\n\n Here is the code:\n` + 
      `${token}`     
    }

    //console.log('sending the email')
    transporter.sendMail(mailOptions, (err, response)=>{
      if (err){
        //console.log('there is an error: ', err);
      } else {
        //console.log('there is a response: ', response);
        res.status(200).json('recovery email sent')
      }
    })
    
  }
  
});

router.post('/signin_code', async (req, res) => {
  //console.log('enter /signin_code')
  const { code, email } = req.body;
  //console.log('email in /signin_code is ', email)
  const user = await User.findOne({ email });
  //console.log('user is ', user)

  if (!user) {
    return res.status(422).send({ error: 'Cannot find your account' });
  }

  if (user.resetToken === code && user.resetTokenExpires >= Date.now().toString()){
    //console.log('user.resetToken  === code')
    const token = jwt.sign({ email }, 'MY_SECRET_KEY');
    //console.log('token is ', token)
    res.send({ token });
    //console.log('send back token')
  } else {
    return res.status(422).send({ error: 'Wrong code' });
  }

});

module.exports = router;

