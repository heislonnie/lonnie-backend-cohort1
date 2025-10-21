const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');
const { tokenChecker } = require('../middlewares/tokenChecker');

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        
        if (!admin) {
            return res.redirect('/admin/login');
        }

        const validPassword = await bcrypt.compare(password, admin.password);
        if (!validPassword) {
            return res.redirect('/admin/login');
        }

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/admin/dashboard');
    } catch (error) {
        res.redirect('/admin/login');
    }
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const admin = new Admin({
            name,
            email,
            password: hashedPassword
        });
        
        await admin.save();
        res.redirect('/admin/login');
    } catch (error) {
        res.redirect('/admin/register');
    }
});

router.get('/dashboard', tokenChecker, (req, res) => {
    res.render('dashboard', { admin: req.admin });
});

router.get('/profile', tokenChecker, (req, res) => {
    res.render('profile', { admin: req.admin });
});

router.post('/profile', tokenChecker, async (req, res) => {
    try {
        const { name, email } = req.body;
        await Admin.findByIdAndUpdate(req.admin.id, { name, email });
        res.redirect('/admin/profile');
    } catch (error) {
        res.redirect('/admin/profile');
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/admin/login');
});

module.exports = router;