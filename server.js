const express = require('express');
const mongoose = require('mongoose');
const Article = require('./models/articles');
const app = express();
const mongoURI = 'mongodb+srv://admin:admin@cluster0.5htwy.mongodb.net/<dbname>?retryWrites=true&w=majority';

mongoose.connect(mongoURI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
    console.log("Mongodb CONNECTED");
});

app.use(express.urlencoded({ extended: false }))

app.set('view engine', 'ejs');

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

app.listen(5000);
console.log('Listening on port 5000');