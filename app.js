const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser');
const session = require('express-session')
const Article = require('./models/articles');

// DB Config
const mongoURI = "mongodb+srv://admin:admin@cluster0.5htwy.mongodb.net/user?retryWrites=true&w=majority"

// Connect to mongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log(err))

// EJS
// Make sure calling the express layouts before setting the view engine
app.use(expressLayouts)
app.set('view engine', 'ejs')

// Bodyparser
app.use(express.urlencoded({ extended: false }))

app.use(cookieParser());
app.use(session({secret: "secret"}));

// Routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

app.get('/', async (req, res) => {
    const articles = await Article.find().sort({createdAt : 'desc'})
    res.render('index', { articles: articles });
});

app.get('/new', (req, res) => {
    const article = new Article({
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown,
    });
    res.render('new' , { article: article });
});

app.get('/:id', async (req, res) => {
    const article = await Article.findById(req.params.id);
    if (article == null) {
        res.render('index');
    }
    res.render('show', {article : article});
})

app.post('/save', (req, res) => {
    const article = new Article({
        title: req.body.title,
        description: req.body.description,
        author: req.session.name
    });

    Article.create(article, (err, data) => {
        if (err) {
            // res.status(500).send(err);
            res.render('new', {article: article});
        } else {
            // res.status(201).send(data);
            res.redirect(`/${article.id}`);
        }
    });
});

app.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id);
    if (article == null) {
        res.render('index');
    }
    res.render('edit' , { article: article });
});

app.post('/edit/:id', (req, res) => {
    const article = {
        title : req.body.title,
        description : req.body.description
    }
    Article.update({_id : req.params.id}, article, (err, data) => {
        if (err) {
            // res.status(500).send(err);
            res.render('edit', {article: article});
        } else {
            // res.status(201).send(data);
            res.redirect(`/${req.params.id}`);
        }
    });
});

app.get('/delete/:id', async (req, res) => {
    await  Article.deleteOne({ _id : req.params.id }, (err, data ) => {
        if (err) {
            res.status(500).send(err);
        } else {
            // res.status(201).send(data);
            res.redirect('/');
        }
    });
});

const port = 5000;
app.listen(port, console.log(`Server started on port ${port}`))