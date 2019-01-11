const passport = require('passport');
const facebookStrategy = require('passport-facebook');

const fbOts = {
    clientID: process.env.PASSPORT_FACEBOOK_APP_ID,
    clientSecret: process.env.PASSPORT_FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:8000/api/auth/facebook/callback",
    profileFields: ['email']
}
const fbCallback = (accessToken, refreshToken, profile, done) => {
    done(null,{accessToken, refreshToken, profile});        
}

passport.use(new facebookStrategy(fbOts, fbCallback))