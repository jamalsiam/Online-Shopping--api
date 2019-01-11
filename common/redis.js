const redis = require('redis');
const redisClient = redis.createClient({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
});


redisClient.on('connect', function () {
    console.log('Redis client connected');
});
redisClient.on('error', function (err) {
    console.log('Something went wrong ' + err);
});


module.exports.setRedisRecord = (key, value) => redisClient.set(key, JSON.stringify(value), redis.print);


module.exports.getRedisRecord = (key, callback) => {
    try {
        redisClient.get(key, (error, result) => callback(error, JSON.parse(result)))
    } catch (error) {
        callback(true, null)
    }
};