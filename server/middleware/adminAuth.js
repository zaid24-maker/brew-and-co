const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 🧠 CONCEPT: adminAuth runs auth check + checks isAdmin flag on the user
//    If not admin → returns 403 Forbidden and route handler never runs
async function adminAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user || !user.isAdmin) {
            return res.status(403).json({ message: 'Admin access required' });
        }

        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
}

module.exports = adminAuth;
