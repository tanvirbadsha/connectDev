const express = require('express');
const router = express.Router();
const {check, validationResult } = require('express-validator');
const auth = require('../../middlewear/auth');

const User = require('../../models/User');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

//@route POST api/posts
//@desc create a post
//@access private
router.post('/',[ auth, [
    check('text', 'Text is required').notEmpty()
]], async (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await User.findById(req.user.id).select('-password');
        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        })
        const post = await newPost.save();
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error')
    }

});
//@route GET api/posts
//@desc get all post
//@access private
router.get('/', auth, async (req,res)=>{
    try {
        const posts = await Post.find().sort({ date: -1 });
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
//@route GET api/posts/:id
//@desc get all post by id
//@access private
router.get('/:id', auth, async (req,res)=>{
    try {
        const post = await Post.find( req.params.id);
        if(!post){
            return res.status(404).json({ msg: 'Post not found'});
        }
        res.json(post);
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId'){
            return res.status(404).json({ msg: 'Post not found'});
        }
        res.status(500).send('Server Error');
    }
});
//@route DELETE api/posts
//@desc delete a post
//@access private
router.delete('/', auth, async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({ msg: 'Post not found'});
        }
        // check user
        if(post.user.toString() !== req.user.id){
            return res.status(401).json({ msg: 'User not authorized'});
        }
        await post.remove();
        res.json({ msg: 'Post removed'});
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId'){
            return res.status(404).json({ msg: 'Post not found'});
        }
        res.status(500).send('Server Error');
    }
});

//@route POST api/posts
//@desc like a post
//@access private
router.post('/like/:id', auth, async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        // check its already liked 
        if(post.likes.filter(like=> like.user.toString() === req.user.id).length > 0){
            return res.status(400).json({ msg: 'Post already liked'});
        }
        post.likes.unshift({ user: req.user.id});
        await post.save();
        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
//@route PUT api/posts
//@desc unlike a post
//@access private
router.post('/like/:id', auth, async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        // check its already liked 
        if(post.likes.filter(like=> like.user.toString() === req.user.id).length === 0){
            return res.status(400).json({ msg: 'Post has not been yet liked'});
        }
        // Get remove index
        const removeIndex = post.likes.map(like => like.user.toString().indexOf(req.user.id));
        post.likes.splice(removeIndex, 1);
        await post.save();
        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route POST api/posts/comment/:id
//@desc comment on a post
//@access private
router.post('/comment/:id',[ auth, [
    check('text', 'Text is required').notEmpty()
]], async (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.id);
        const newComment ={
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        };
        post.comments.unshift(newComment);
        await post.save();
        res.json(post.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error')
    }

});

//@route DELETE  api/posts/comment/:id/:comment_id
//@desc comment on a post
//@access private
router.delete('/api/posts/comment/:id/:comment_id', auth, async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        // pull out comment 
        const comment = post.comments.fin(comment => comment.id ===req.params.comment_id)
        // make sure comment exists
        if(!comment){
            return res.status(404).json({ msg: 'Comment does not exist'});
        }
        // check user
        if(comment.user.toString() !== req.user.id){
            return res.status(401).json('User not authrized');
        }
         // Get remove index
         const removeIndex = post.comments.map(comment => comment.user.toString().indexOf(req.user.id));
         post.comments.splice(removeIndex, 1);

         await post.save();

         res.json(post.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error')
    }
})
module.exports = router;