const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');
const AWS = require('aws-sdk');
require('dotenv').config()

const User = mongoose.model('User');

const router = express.Router();
router.use(requireAuth);

router.get('/image_upload', async (req, res) => {
    console.log('entered /image server')
    //console.log('req.user', req.user._id)

    //connect to Amazon S3 storage
    try{
        var s3 = new AWS.S3({accessKeyId:'AKIAXBZG3GVACEKM3EFY', secretAccessKey:'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', region:'us-east-1'});
        var params = {Bucket: 'kindalike', Key: `profile_images/${req.user._id}.jpg`, ContentType: 'image/jpeg'};
        s3.getSignedUrl('putObject', params, function (err, url) {
            console.log('Your generated pre-signed URL is', url);
            res.send([url, req.user._id]);
            //console.log('sent url');
        });    
        
    }catch(err){
        res.status(422).send({ error: err.message });
    }
});

router.get('/image_download', async (req, res) => {
    //console.log('entered /image _download server')
    //connect to Amazon S3 storage
    try{
        var s3 = new AWS.S3({accessKeyId:'AKIAXBZG3GVACEKM3EFY', secretAccessKey:'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', region:'us-east-1'});
        var params = {Bucket: 'kindalike', Key: `profile_images/${req.user._id}.jpg`};
        s3.getSignedUrl('getObject', params, function (err, url) {
            //console.log('Your generated download pre-signed URL is', url);
            res.send(url);
            //console.log('sent download url');
        });    
        
    }catch(err){
        res.status(422).send({ error: err.message });
    }
});

module.exports = router;

