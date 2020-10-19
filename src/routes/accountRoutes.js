const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');
var zipcodes = require('zipcodes');

const User = mongoose.model('User');
const Track = mongoose.model('Track');

const router = express.Router();
router.use(requireAuth);

router.get('/account', async (req, res) => {
    //console.log(req.user._id )
    const user = await User.findOne({ _id: req.user._id });
    res.send(user);
});

router.post('/account_edit', async (req, res) => {
    const { new_values } = req.body;
    //username, location, zip_code, age, kids, relationship, veg

    console.log('zip_code is ', new_values.zip_code)
    const address = zipcodes.lookup(new_values.zip_code);
    console.log('address is ', address)
    const location = address.city + ', ' + address.state
    console.log('location is ', location)


    console.log('values passed: ', new_values)
    var update = {
        username: new_values.username,
        //location: new_values.location,
        location,
        zip_code: parseInt(new_values.zip_code, 10),
        age: parseInt(new_values.age, 10),
        kids: new_values.kids,
        relationship: new_values.relationship,
        veg: new_values.veg,
        religion: new_values.religion
    };
    //update[username]=new_values.username;
    //console.log('req.user: ', req.user)
    //console.log('account_location location: ', location )
    const user = await User.updateOne({ _id: req.user._id },update);
    res.send(user);
});

module.exports = router;