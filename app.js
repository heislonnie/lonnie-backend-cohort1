const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const adminRoute = require('./routes/adminRoute');
const apiRoute = require('./routes/apiRoute');
const weatherRoute = require('./routes/weatherRoute');

const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Mount routes
app.use('/admin', adminRoute);
app.use('/api/v1', apiRoute);
app.use('/weather', weatherRoute);

// Convenience redirects for unprefixed routes
app.get('/profile', (req, res) => res.redirect('/admin/profile'));
app.get('/dashboard', (req, res) => res.redirect('/admin/dashboard'));
app.get('/logout', (req, res) => res.redirect('/admin/logout'));
app.post('/profile', (req, res) => res.redirect(307, '/admin/profile'));

// Root redirect
app.get('/', (req, res) => res.redirect('/admin/dashboard'));

module.exports = app;