const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const googleOts = {
    clientID: process.env.PASSPORT_GOOGLE_APP_ID,
    clientSecret: process.env.PASSPORT_GOOGLE_APP_SECRET,
    callbackURL: "http://localhost:8000/api/auth/google/callback",
}

const googleCallback = (accessToken, refreshToken, profile, done) => {

     done(null,{accessToken, refreshToken, profile});    
}


passport.use(new GoogleStrategy(googleOts, googleCallback))

