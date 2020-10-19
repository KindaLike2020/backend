const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');




const User = mongoose.model('User');

const router = express.Router();
router.use(requireAuth);

router.post('/password_reset', async (req, res) => {
    const { old_pwd, new_pwd } = req.body;
    const user = await User.findOne({ _id: req.user._id });
    try {
        await user.comparePassword(old_pwd);
        await User.updateOne({ _id: req.user._id },{password: new_pwd});
        const user_update = await User.findOne({ _id: req.user._id });
        await user_update.save();
        res.send(user_update);
    } 
    catch (err) {
        return res.status(422).send({ error: 'Invalid password or email' });
    }
});

router.post('/password_reset_no_old_pwd', async (req, res) => {
  const { new_pwd, email } = req.body;
  //console.log('arrived /password_reset_no_old_pwd, new_pwd is ', new_pwd)
  //const user = await User.findOne({ _id: req.user._id });
  try {
      //console.log('req.user._id is ', req.headers)
      await User.updateOne({ email },{password: new_pwd});
      //console.log('updated pwd')
      const user_update = await User.findOne({ email });
      await user_update.save();
      //console.log('hashed pwd')
      res.send(user_update);
  } 
  catch (err) {
      return res.status(422).send({ error: 'Invalid password or email' });
  }
});



module.exports = router;


