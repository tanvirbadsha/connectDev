const express = require('express');
const router = express.Router();
const auth = require('../../middlewear/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

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

module.exports = router;