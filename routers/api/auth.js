const express = require('express');
const router = express.Router();
const auth = require('../../middlewear/auth');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');  //jwt
const config = require('config'); //default.json theke data anar jonne
const bcrypt = require('bcryptjs');

//@route er endpoint- api/auth
//@desc Test route
//@access public
router.get('/', auth, async (req, res)=>{
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route er endpoint- api/auth
//@desc Authenticate User & get token
//@access public
router.post('/', [
    check('email', 'Please include a valid Email').isEmail(),
    check('password', 'Password is required!').exists()

], async (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const {name, email, password } = req.body;
    try {
        // See if User Exist 
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({ errors: [ {msg: 'Invalid credentials'}]});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ errors: [ {msg: 'Invalid credentials'}]});
        }
        // Return jsonwebtoken
        const payload ={
            user: {
                id: user.id, //_id use kortesi. mongoose use kortesi dkehe .id likhlei kaj kortese. ekhane .id === ._id
            }
        }
        jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000000},
        (err, token)=>{
            if(err) throw err;
            res.json({ token });
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json('server error');
    }
});

module.exports = router;