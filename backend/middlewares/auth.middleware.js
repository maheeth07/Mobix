const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const blacklistTokenModel = require('../models/blacklistToken.model');

module.exports.authUser = async (req, res, next) => {
    try {
        let token;

        if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }
        else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - No token' });
        }

        // reject token if it's blacklisted (logged out)
        const blacklisted = await blacklistTokenModel.findOne({ token });
        if (blacklisted) {
            return res.status(401).json({ message: 'Unauthorized - Token is blacklisted' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded._id).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        req.user = user;
        req.token = token;
        next();

    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }
};
