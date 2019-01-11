const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');

module.exports.sign = (id) => {
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);
    return {
        token: jwt.sign({
            id,
            exp: exp.getTime()
        }, process.env.JWT_KEY), 
        exp: exp.getTime()
    }
}



module.exports.verify = (record) => {
    return jwt.verify(record, process.env.JWT_KEY)

}

module.exports.generateHash = (password) => {
    return jwt.sign(password, process.env.JWT_KEY);
}

module.exports.validPassword = (currentPassword, newPassword) => {

    return currentPassword === jwt.sign(newPassword, process.env.JWT_KEY);
}


