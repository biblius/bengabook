const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    commenter: {
        type: mongoose.ObjectId,
        ref: 'user'
    },
    comment: String
});

const postSchema = new Schema({
    poster: {
        type: mongoose.ObjectId,
        ref: 'user'
    },
    content: {
        type: String,
        required: true,
        maxLength: 500
    },
    media: {
        type: String
    },
    labambas: {
        type: Number,
        default: 0
    },
    ccms: {
        type: Number,
        default: 0
    },
    comments: {
        type: [{
            commenter: {
                type: mongoose.ObjectId,
                ref: 'user'
            },
            comment: String
        }],
        default: []
    },
    commentCount: { type: Number, default: 0 },
    posted: {
        type: Date,
        default: new Date,
        immutable: true
    }
});

const requestSchema = new Schema({
    from: {
        type: mongoose.ObjectId,
        ref: 'user'
    },
    to: {
        type: mongoose.ObjectId,
        ref: 'user'
    },
    date: {
        type: Date,
        default: new Date,
        immutable: true
    },
    accepted: {
        type: Boolean,
        default: false
    }
});


const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username is required!"]
    },
    password: {
        type: String,
        required: [true, "Password is required!"]
    },
    about: {
        type: String,
        default: "Labamba uvijek i zauvijek"
    },
    posts: {
        type: [mongoose.ObjectId],
        ref: 'post',
        default: []
    },
    labambaPosts: {
        type: [mongoose.ObjectId],
        ref: 'post',
        default: []
    },
    imgs: [String],
    profilePic: {
        type: String,
        default: '../materials/pics/bunkus.jpg'
    },
    friends: {
        type: [mongoose.ObjectId],
        ref: 'user',
        default: []
    },
    pendingRequests: {
        type: [requestSchema],
        ref: 'request',
        default: []
    }
});

userSchema.methods.hasFriend = function (friend) {
    for (let i = 0; i < this.friends.length; i++) {
        if (this.friends[i].id === friend.id) { return true };
    }
    return false;
}

userSchema.methods.removeRequest = function (request) {
    if (this.pendingRequests.length > 0) {
        for (let i = 0; i < this.pendingRequests.length; i++) {
            if (this.pendingRequests[i].id == request.id) {
                const index = this.pendingRequests.indexOf(this.pendingRequests[i]);
                return this.pendingRequests.splice(index, index + 1);
            }
        }
    }
    return "Could not find request";
}

const Post = mongoose.model('post', postSchema)
const Request = mongoose.model('request', requestSchema);
const User = mongoose.model('user', userSchema);
module.exports = { User, Request, Post };