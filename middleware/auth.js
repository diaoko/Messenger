const User = require('../models/user');
const auth = async (req, res, next) => {
    const token = req.header('Authorization');

    try {
        const user = await User.findOne({ 'token': token });
        if (!user) {
            throw new Error()
        }
        req.user = user;
        req.Authorization = token;
        next()
    } catch (error) {
        res.status(401).send({ haserror: true, code: 99, msg: 'Access Denied' })
    }

};
module.exports = auth;