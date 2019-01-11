const jwt = require('./../common/jwt');
const redis = require('./../common/redis');

const refreshToken = (req, res, next) => {
    const { headers: { authorization }, body } = req;
    const haveToken = authorization && authorization.split(' ')[0] === 'Bearer';
    if (haveToken) {
        try {
            const verifyedToken = jwt.verify(authorization.split(' ')[1]);
            redis.getRedisRecord(verifyedToken.id, (error, result) => {

                if (!error && !!result) {
                    const { accessToken, refreshToken } = result;
                    const { id, exp } = jwt.verify(accessToken);

                    if (exp < Date.now() && body.refreshToken === refreshToken) {
                        req.userId = id;
                        next()
                    } else {
                        return res.json({ status: 422 })
                    }
                } else {
                    return res.json({ status: 422 })
                }
            })
        } catch (error) {
            return res.json({ status: 422 })
        }

    } else {
        return res.json({ status: 422 })
    }
}
module.exports = refreshToken;
