const express = require('express');
const router = express.Router();
const Article = require('../models/articles')


router.get('/', async (req,res) => {
    if (typeof req.session.email != 'undefined') {
        const articles = await Article.find().sort({createdAt : 'desc'})
        res.render('index', { user : req.session,  articles : articles})
    } else {
        res.render('welcome')
    }
})
module.exports = router



