const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.set('views', 'C:/Users/Bunkus Khan/Desktop/bengabook/public/views');

//authentication and encryption middleware
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const store = new session.MemoryStore();
const bcrypt = require('bcrypt');
const cors = require('cors');

//dev middleware
const morgan = require('morgan');
const errorhandler = require('errorhandler');
const bodyParser = require('body-parser');

//mongo stuff
const mongoose = require('mongoose');
const {User} = require('./models/user.js');
const url = 'mongodb://127.0.0.1/bengabook';
const options = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose.connect(url, options, () => console.log("connected"), error => console.log(error));

//enable cors
app.use(cors({
    origin: "http://127.0.0.1:4000",
    methods: ['GET', 'POST', 'DELETE', 'PUT']
}));

//used for logging requests
app.use(morgan('dev'));

//body parser for json and standard form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

//start session
app.use(
    session({
        secret: "secret-key",
        cookie: { maxAge: 1000 * 60 * 60 * 24, secure: false },
        saveUninitialized: false,
        resave: false,
        store
    })
);

//initialize and setup passport middleware
app.use(passport.initialize());
app.use(passport.session());

//authentication strategy
passport.use(new LocalStrategy(async (username, password, done) => {
    const user = await User.findOne({ username: username });
    try {
        if (!user) {
            return done(null, false)
        };
        const matchedPassword = await bcrypt.compare(password, user.password)
        if (!matchedPassword) {
            return done(null, false)
        };
        return done(null, user);
    } catch (err) {
        next(err);
    }
}));

//attaches a user ID to req.session.passport on successfull login
passport.serializeUser((user, done) => {
    done(null, user.id);
});

//takes the ID from the passport, finds the user and attaches it to req.user on subsequent requests
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        if (err) { return done(err) };
        done(null, user);
    });
});

//initialize routes
app.use('/', require('./login-register-routes.js'));
app.use('/', require('./users-routes.js'));

//handle errors 
app.use(errorhandler());

//listen for requests
app.listen(process.env.port || 4000, () => console.log("Listening for requests on 4000"));