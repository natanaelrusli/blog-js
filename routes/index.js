const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const Article = require('../models/articles');

router.get('/', async (req,res) => {
    const articles = await Article.find().sort({createdAt : 'desc'})
    if (typeof req.session.email != 'undefined') {
        res.render('index', { user : req.session,  articles : articles})
    } else {
        res.render('welcome')
    }
})

module.exports = router


