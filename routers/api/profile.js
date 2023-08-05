const express = require('express');
const router = express.Router();
const auth = require('../../middlewear/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const { route } = require('./profile');
const { profile_url } = require('gravatar');
const axios = require('axios');

//@route er endpoint- GET api/profile/me
//@desc get current user profile
//@access private
router.get('/me', auth, async (req, res)=>{
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('User',
        ['name', 'avatar']);
        if(!profile){
            res.status(400).json({ msg: 'there is no profile for this user'});
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route POST api/profile
// @desc Create or update user profile
// @access private
router.post('/', [auth, [
    check('status', 'Status is required').notEmpty(),
    check('skills', 'Skills is required').notEmpty()
]], async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    const { company, website, location, bio, status, githubusername, skills, youtube, facebook, twitter, instagram, linkedin } = req.body;
    // build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(status) profileFields.status = status;
    if(githubusername) profileFields.githubusername = githubusername;
    if(skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }
    // Build SOCIAL object
    profileFields.social = {}
    if(youtube) profileFields.social.youtube = youtube;
    if(twitter) profileFields.social.twitter = twitter;
    if(facebook) profileFields.social.facebook = facebook;
    if(linkedin) profileFields.social.linkedin = linkedin;
    if(instagram) profileFields.social.instagram = instagram;
    try {
        let profile = await Profile.findOne({ user: req.user.id });
        if(profile){
            //update
            profile = await Profile.findOneAndUpdate({ user: req.user.id },
                {$set:profileFields },
                {new: true }
            );
                return res.json(profile);
        }
        // create
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route GET api/profile
// @desc get all profiles
// @access public
router.get('/', async (req,res)=>{
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route GET api/profile/user/:user_id
// @desc get profile by user ID
// @access public
router.get('/user/:user_id', async (req,res)=>{
    try {
        const profile = await Profile.findOne({ user: req.params.user_id}).populate('user', ['name', 'avatar']);
        if(!profile){
            return res.status(400).json({ msg: "profile not found"});
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if(err.kind == 'objectId'){
            return res.status(400).json({ msg: "profile not found"});
        }
        res.status(500).send('Server Error');
    }
});

// @route DELETE api/profile
// @desc delete profile user and posts
// @access private
router.delete('/', auth , async (req,res)=>{
    try {
        // @todo - remove users posts
        // remove profile
        await Profile.findOneAndRemove({ user: req.user.id });
        // user
        await User.findOneAndRemove({ _id: req.user.id });
        res.json({ msg: 'User removed!'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route PUT api/profile/experience
// @desc add profile experience
// @access private
router.put('/experience', [auth, [
    check('title', 'Tittle is required').notEmpty(),
    check('company', 'Company is required').notEmpty(),
    check('from', 'From is required').notEmpty(),
]], async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
       return res.status(400).json({ errors: errors.array() })
    }
    const {title, company, location, from, to, current, description } = req.body;
    const newExp = {
        title, company, location, from , to , current, description
    }
    try {
        const profile = await Profile.findOne({ user: req.user.id});
        profile.experience.unshift(newExp);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
// @route DELETE api/profile/experience/:exp_id
// @desc delete profile experience
// @access private
router.delete('/experience/:exp_id', auth, async (req,res)=>{
    try {
        const profile = await Profile.findOne({ user: req.user.id});
        // Get remove index
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
        profile.experience.splice(removeIndex, 1);
        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route PUT api/profile/education
// @desc add education information
// @access private
router.put('/education', [auth, [
    check('school', 'School name is required').notEmpty(),
    check('degree', 'Degree is required').notEmpty(),
    check('fieldofstudy', 'Stydt field is required').notEmpty(),
]], async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
       return res.status(400).json({ errors: errors.array() })
    }
    const {school, degree, fieldofstudy, from, to, current, description } = req.body;
    const newEdu = {
        school, degree, fieldofstudy, from , to , current, description
    }
    try {
        const profile = await Profile.findOne({ user: req.user.id});
        profile.education.unshift(newEdu);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
// @route DELETE api/profile/education/:edu_id
// @desc delete profile education
// @access private
router.delete('/education/:edu_id', auth, async (req,res)=>{
    try {
        const profile = await Profile.findOne({ user: req.user.id});
        // Get remove index
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
        profile.education.splice(removeIndex, 1);
        await profile.save();
        
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route Get api/profile/github/:username
// @desc get user repos from github
// @access public
router.get('/github/:username', async (req, res)=>{
    try {
        const options = {
            url: `https://api.github.com/users/${req.params.username}/repos?per_page=5`,
            method: 'GET',
            headers: { 'user-agent': 'node.js'}
        };
        const result = await axios.get(`https://api.github.com/users/${req.params.username}/repos?per_page=5`);
        if(result.status !== 200) res.status(404).json({ msg: "NO github profile found"});
        const dataArray = result.data;
        // for(var i =0; i<dataArray.length; i++){
        //     const repoName = dataArray[i].name;
        // }
        res.json(dataArray);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;