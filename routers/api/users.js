const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const gravatar = require('gravatar'); // for adding random picture
const bcrypt = require('bcryptjs'); // hashing password
const jwt = require('jsonwebtoken');  //jwt
const config = require('config'); //default.json theke data anar jonne

//@route er endpoint- api/users
//@desc Register User
//@access public
router.post('/', [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Please include a valid Email').isEmail(),
    check('password', 'Please insert a password with 6 or more character').isLength({min: 6})

], async (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const {name, email, password } = req.body;
    try {
        // See if User Exist 
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({ errors: [ {msg: 'User already exists'}]});
        }
        // Get User gravatar
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })
        user = new User({
            name,
            email,
            avatar,
            password
        });
        // Encrypt Password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
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