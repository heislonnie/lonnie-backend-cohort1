const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');

const tokenChecker = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            if (req.xhr) {
                return res.status(401).json({ error: 'Please authenticate' });
            }
            return res.redirect('/admin/login');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findById(decoded.id).select('-password');
        
        if (!admin) {
            if (req.xhr) {
                return res.status(401).json({ error: 'Please authenticate' });
            }
            return res.redirect('/admin/login');
        }

        req.admin = admin;
        res.locals.admin = admin;
        next();
    } catch (error) {
        if (req.xhr) {
            return res.status(401).json({ error: 'Please authenticate' });
        }
        res.redirect('/admin/login');
    }
};

module.exports = { tokenChecker };