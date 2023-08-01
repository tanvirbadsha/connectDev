const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    company: String,
    website: String,
    location: String,
    status:{
        type: String,
        required: true
    },
    skills:{
        type: [String],
        required: true
    },
    bio: String,
    githubusername: String,
    experience: [
        {
            title:{
                type: String,
                required: true
            },
            company:{
                type: String,
                required: true
            },
            location:{
                type: String
            },
            from:{
                type: String,
                required: true
            },
            to:{
                type: String,
                required: true
            },
            current:{
                type: Boolean,
                default: false
            },
            description: String
        }
        
    ],
    education: [
        {
            school:{
                type: String,
                required: true
            },
            degree:{
                type: String,
                required: true
            },
            fieldofstudy:{
                type: String,
                required: true
            },
            from:{
                type: String,
                required: true
            },
            to:{
                type: String,
                required: true
            },
            current:{
                type: Boolean,
                default: false
            },
            description: String
        }
        
    ],
    social: {
        youtube: String,
        twitter: String,
        facebook: String,
        linkedin: String,
        instagram: String
    },
    date:{
        type: Date,
        default: Date.now
    }

});
const Profile = mongoose.model("Profile", profileSchema);
module.exports = Profile;