const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    text:{
        type: String,
        required: true
    },
    name: {
        type: String
    },
    avatar: {
        type: String
    },
    likes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Users'
            }
        }
    ],
    comments:[
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Users'
            },
            text: {
                type: String,
                required: true
            },
            avatar:{
                type: String
            },
            date: {
                type: Date,
                defualt: Date.now
            }
        }
    ],
    date: {
        type: Date,
        defualt: Date.now
    }
});

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;