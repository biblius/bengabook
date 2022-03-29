const express = require('express');
const router = express.Router();
const { User } = require('./models/user.js');
const passport = require('passport');
const bcrypt = require('bcrypt');

router.get('/register', async (req, res, next) => {
    try {
        if (req.query.taken) {
            return res.render('register', { msg: "Username already taken!" });
        }
        res.render('register', { msg: null, user: null });
    } catch (err) {
        next(err);
    };
});

router.get('/login', async (req, res, next) => {
    try {
        if (req.query.attempt === "failed") {
            return res.render('login', { msg: "Please log in to continue", user: null });
        }
        res.render('login', { msg: null, user: null });
    } catch (err) {
        next(err);
    };
});

router.post('/register', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        //check if the username is taken, if it is return to register with msg
        const exists = await User.findOne({ username: username });
        if (exists) { return res.redirect('register/?taken=true'); }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({ username: username, password: hashedPassword });
        res.redirect(`/`);

    } catch (err) {
        next(err);
    };
});

router.post("/login", passport.authenticate("local", { failureRedirect: "/login" }), async (req, res, next) => {
    try {
        res.redirect(`/`);
    }
    catch (err) {
        next(err);
    };;
});

module.exports = router;