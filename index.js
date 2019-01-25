const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const passport = require('passport');
require('dotenv').config();
const morgan = require('morgan');
const cors = require('cors');

require('./common/redis')
app.use('/', express.static('uploads'));
app.use(bodyParser.json({ limit: '2mb' }));
app.use(bodyParser.urlencoded({ limit: '2mb', extended: true }));
app.use(cors());
app.use(morgan('dev')); 
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

require('./common/passport.config');
require('./common/passportFacebook.config');
require('./common/passportGoogle.config');
app.use(require('./routes'))


app.listen(process.env.PORT, () => {
    console.log(`app running on port ${process.env.PORT}`);
});