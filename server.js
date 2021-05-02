const express = require('express');
const mongoose = require('mongoose');
const shortId = require('shortid');

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

mongoose.connect('mongodb://localhost/shortUrlDB', {useNewUrlParser: true, useUnifiedTopology: true});

const shortUrlSchema = new mongoose.Schema({
    fullUrl: {type: String, required: true },
    shortUrl: {type: String, required: true, default: shortId.generate}
  });

const shortUrlModel = mongoose.model("Url", shortUrlSchema);

app.get('/', async (req, res) => {
    const shortUrls = await shortUrlModel.find()
    res.render('index', { shortUrls: shortUrls })
})


app.post('/shortUrls', async (req, res) => {
    await shortUrlModel.create({ fullUrl: req.body.fullUrl});

    res.redirect('/');
})

app.get('/:shortUrls', async (req, res) => {
    const shortUrl = await shortUrlModel.findOne({ shortUrl: req.params.shortUrls })
    if (shortUrl == null) return res.sendStatus(404)

    

    res.redirect(shortUrl.fullUrl);
})


app.listen(5000, () => {
    console.log("Server started on port 5000...");
});