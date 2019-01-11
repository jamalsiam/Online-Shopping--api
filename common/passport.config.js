const userModel = require('../models').User;
const passport = require('passport');
const LocalStrategy = require('passport-local');
const jwt = require('./jwt');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, (email, password, done) => {
    userModel
        .findOne({
            where: {
                email: email
            },
        })
        .then((user) => {
            if (!user) {
                return done(null, false, { errors: { type: 'Email' } });
            }
            else if (jwt.validPassword(user.dataValues.password, password)) {
                return done(null, user.dataValues.id);
            } else {
                return done(null, false, { errors: { type: 'Password' } });
            }

        })
        .catch(done)
}));