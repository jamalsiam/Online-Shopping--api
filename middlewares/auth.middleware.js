const jwt = require('./../common/jwt');
const redis = require('./../common/redis');

const getTokenFromHeaders = (req, res, next) => {
  const { headers: { authorization } } = req;
  const haveToken = authorization && authorization.split(' ')[0] === 'Bearer';


  if (haveToken) {
    try {

      const verifyedToken = jwt.verify(authorization.split(' ')[1]);
      redis.getRedisRecord(verifyedToken.id, (error, result) => {
        const { accessToken } = result;
        if (!error && (accessToken === authorization.split(' ')[1])) {

          if (verifyedToken.exp > Date.now()) {
            req.userId = verifyedToken.id;
            next()

          } else {
            res.sendStatus(190)
          }

        } else {
          res.sendStatus(401)
        }
      })

    } catch (error) {
      res.sendStatus(401)
    }
  } else {
    res.sendStatus( 401 )
  }
};

const auth = {
  required: (req, res, next) => getTokenFromHeaders(req, res, next),

  optional: (req, res, next) => next(),
};

module.exports = auth;