const express = require('express');
const router = express.Router();
const { User, Request, Post } = require('./models/user.js');

//initialize multer for file uploads
const handleFriendship = require('./helpers.js')
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, req.user.username + '-' + Date.now())
    }
})
const upload = multer({ storage: storage });

//checks if user exists for every path with userId
router.param('userId', (req, res, next, id) => {
    User.findById(id, (err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return next(new Error("Couldn't find user"));
        }
        next();
    })
});

//always triggers checking if there is an active session
router.use((req, res, next) => {
    if (req.user) {
        return next();
    }
    return res.redirect('/login');
})


////////////////////////////pages////////////////////////
router.get('/', async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).populate('labambaPosts');
        const posts = await Post.find().populate('poster');
        for (let i = 0; i < posts.length; i++) {
            for (let j = 0; j < posts[i].comments.length; j++) {
                await posts[i].populate({ path: `comments.${j}.commenter`, select: ['username', 'profilePic'] });
            }
        }
        return res.render('home', { user: user, posts: posts });
    } catch (err) {
        next(err);
    };
});

router.get('/logout', async (req, res, next) => {
    try {
        req.logout();
        res.redirect("/");
    } catch (err) {
        next(err);
    };
});

router.get('/profile', async (req, res, next) => {
    const user = await User.findById(req.user.id);
    await user.populate('posts');
    for (let i = 0; i < user.posts.length; i++) {
        for (let j = 0; j < user.posts[i].comments.length; j++) {
            await user.posts[i].populate({ path: `comments.${j}.commenter`, select: ['username', 'profilePic'] })
        };
    };
    return res.render('profile-active-user', { user: user, activeUser: req.user.username });
})

router.post('/about/:userId', async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { about: req.body.about });
    res.redirect('/profile');
})

router.get('/search', async (req, res, next) => {
    const regex = new RegExp(req.query.search);
    const users = await User.find({ username: regex });
    const user = await User.findById(req.user.id).populate('friends');
    return res.render(`search`, { users: users, user: user }); // ?q=${req.body.search}&page=1&limit=20`);
});

router.get('/user/:userId', async (req, res, next) => {
    const user = await User.findById(req.params.userId).populate(['friends', 'posts']);
    for (let i = 0; i < user.posts.length; i++) {
        for (let j = 0; j < user.posts[i].comments.length; j++) {
            await user.posts[i].populate({ path: `comments.${j}.commenter`, select: ['username', 'profilePic'] })
        };
    };
    res.render('profile', { user: user, activeUser: req.user.username });
});

///////////////////friendship protocol//////////////////////////////////
router.post('/addFriend', async (req, res, next) => {
    //if the request is sent to yourself
    if (req.body.to === req.user.id) {
        return res.send("Thyself shan't befriendeth thyself");
    }

    //sender is always the active user, existing request checks if there is already an inbound request
    const sender = await User.findById(req.user.id).populate('friends');
    const receiver = await User.findById(req.body.to);
    const existingRequest = await Request.findOne({ from: receiver, to: sender, accepted: false });
    //if the user is already befriended
    if (sender.hasFriend(receiver)) {
        return res.send("You are already friends!");
    }

    //if the request already exists
    if (await Request.exists({ from: sender, to: receiver, accepted: false })) {
        return res.send("You've already sent a request to this user!");
    }

    //if a request is already sent from the receiver, update it to accepted and add friends
    if (existingRequest) {
        handleFriendship(sender, receiver, existingRequest);
        return res.send('Success!');
    }

    //if there is no request create one and store in both users
    const request = await Request.create({ from: sender, to: receiver });
    await User.updateOne({ _id: receiver.id }, { $push: { pendingRequests: request } });
    await User.updateOne({ _id: sender.id }, { $push: { pendingRequests: request } });
    return res.send(request);

});

router.post('/acceptFriend', async (req, res, next) => {
    const sender = await User.findById(req.user.id);
    const receiver = await User.findById(req.body.from);
    const request = await Request.findOne({ from: receiver, to: sender, accepted: false });
    handleFriendship(sender, receiver, request);
    return res.send('Success!');
});

//////////////////////////resource getters////////////////////////////////////
router.get('/activeUserId', async (req, res, next) => {
    res.send(req.user);
});

router.get('/requests/:userId', async (req, res, next) => {
    const requestsIn = await Request.find({ to: req.params.userId, accepted: false }).populate('from');
    const requestsOut = await Request.find({ from: req.params.userId, accepted: false }).populate('to');
    const requests = { in: requestsIn, out: requestsOut };
    res.send(requests);
});

router.get('/friends/:userId', async (req, res, next) => {
    const user = await User.findById(req.params.userId).populate('friends');
    res.send(user.friends);
});

router.get('/pics/:userId', async (req, res, next) => {
    const user = await User.findById(req.params.userId);
    res.send(user.imgs);
});

router.get('/haps/:userId', async (req, res, next) => {
    const posts = await Post.find({ poster: req.params.userId });
    res.send(posts)
})

router.get('/uploads/:file', async (req, res, next) => {
    const options = {
        root: `${__dirname}/uploads`,
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };
    const fileName = req.params.file
    res.sendFile(fileName, options, (err) => {
        if (err) {
            next(err);
        }
        return console.log('Successfully sent: ', fileName);
    });
});

/////////////profile pic handler/////////////////////
router.get('/changePic', async (req, res, next) => {
    res.render('changePic', { user: req.user });
});

router.post('/uploadPic', upload.single('pic'), async (req, res, next) => {
    console.log(req.query)
    if (req.query.setAsProfilePic === 'true') {
        await User.findByIdAndUpdate(req.user.id, { $push: { imgs: req.file.path.slice(8) }, profilePic: `http://localhost:4000/uploads/${req.file.path.slice(8)}` });
        return res.redirect('/profile');
    }
    await User.findByIdAndUpdate(req.user.id, { $push: { imgs: req.file.path.slice(8) } });
    res.redirect('/profile');
});

router.post('/setPic', async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { profilePic: req.body.img });
    res.redirect('/profile');
});

/////////////////////////////hap handler/////////////////////////
router.post('/postHap', upload.single('media'), async (req, res, next) => {
    const post = await Post.create({ poster: req.user.id, content: req.body.content, media: req.file ? req.file.path.slice(8) : null });
    await User.findByIdAndUpdate(req.user.id, { $push: { posts: post } });
    res.redirect('/');
});

router.get('/posts/:postId', async (req, res, next) => {
    const post = await Post.findById(req.params.postId).populate('poster')
    for (let i = 0; i < post.comments.length; i++) {
        await post.populate({ path: `comments.${i}.commenter`, select: ['username', 'profilePic'] });
    };
    res.render('post', { post: post, user: req.user });
})

router.get('/posts/:postId/labambas', async (req, res, next) => {
    const post = await Post.findById(req.params.postId)
    res.send(post.labambas);
})

router.put('/posts/:postId', async (req, res, next) => {
    const post = await Post.findById(req.params.postId);
    const user = await User.findById(req.user.id);
    for (let i = 0; i < user.labambaPosts.length; i++) {
        if (user.labambaPosts[i].toString() === post.id) {
            post.labambas -= 1;
            post.save();
            user.labambaPosts.splice(user.labambaPosts[i], 1);
            user.save()
            return res.send('unliked')
        };
    };
    user.labambaPosts.push(post)
    user.save()
    post.labambas += 1;
    post.save();
    res.send('liked')
});

router.post('/posts/:postId/comment', async (req, res, next) => {
    const post = await Post.findById(req.params.postId);
    const user = await User.findById(req.user.id);
    const comment = { commenter: user, comment: req.body.comment }
    post.comments.push(comment);
    post.commentCount += 1;
    post.save();
    res.redirect(`/posts/${req.params.postId}`)
});

module.exports = router;