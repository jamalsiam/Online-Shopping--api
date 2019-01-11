const express = require('express');
const router = express.Router();
const passport = require('passport');
const models = require('../../../models');
const auth = require('../../../middlewares/auth.middleware');
const refreshToken = require('../../../middlewares/refreshToken.middleware');
const jwt = require('../../../common/jwt');
const redis = require('../../../common/redis');




router.post('/login', (req, res, next) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(422).json({
            errors: {
                email: 'is required',
            },
        });
    }

    if (!password) {
        return res.status(422).json({
            errors: {
                password: 'is required',
            },
        });
    }

    passport.authenticate('local', function (err, id, info) {
        if (err) { return next(err); };
        if (id) {
            const { token, exp } = jwt.sign(id);
            const response = {
                id,
                accessToken: token,
                refreshToken: jwt.sign(id).token,
                exp
            }

            redis.setRedisRecord(id, response)
            return res.json({ ...response });
        } else {
            return res.status(401).json(info);
        };
    })(req, res, next);


});

router.post('/signup', (req, res) => {
    const { username, email, password } = req.body.data;

    if (username && email && password) {

        models.User
            .create({ username, email, password: jwt.generateHash(password) })
            .then((user) => {
                const { id } = user.dataValues;
                const { token, exp } = jwt.sign(id);

                const response = {
                    id,
                    accessToken: token,
                    refreshToken: jwt.sign(id).token,
                    exp
                }

                redis.setRedisRecord(id, response)
                return res.json({ ...response });


            })
            .catch(err => {
                return res.status(409).json({ email: 'User Already Exists' })
            })

    } else {
        return res.status(422).json({ type: 'Fill All Input' })
    }
})



router.post('/token', refreshToken, (req, res) => {
    const { userId } = req;
    const { exp, token } = jwt.sign(userId);
    const response = {
        id: userId,
        accessToken: token,
        refreshToken: jwt.sign(userId).token,
        exp
    }
    redis.setRedisRecord(userId, response)
    return res.json({ ...response });

});

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('http://localhost:4200/#/');
    });



router.get('/google', passport.authenticate('google', { scope: ['email'] }));


router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        const { displayName, emails } = req.session.passport.user.profile;


        console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
        console.log(displayName, emails);
        console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');


        res.cookie('user', { name: 'asd', age: 12, s: '1212' }).redirect('http://localhost:4200/#/');
    });


module.exports = router;
