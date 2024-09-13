require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const dns = require('dns');
const url = require('url')

// Basic Configuration
const port = process.env.PORT || 3000;

let urlDatabase = [];
let id = 1;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;
  const parsedUrl = url.parse(originalUrl);
  dns.lookup(parsedUrl.hostname, (err) => {
    if (err) {
      return res.json({ error: 'invalid url' });
    }
    urlDatabase.push({ originalUrl, shortUrl: id });
    res.json({ original_url: originalUrl, short_url: id });
    id++;
  });
});

app.get('/api/shorturl/:id', (req, res) => {
  const shortUrlId = req.params.id;
  const urlEntry = urlDatabase.find(entry => entry.shortUrl == shortUrlId);

    if (urlEntry) {
      res.redirect(urlEntry.originalUrl);
    } else {
      res.json({ error: 'No short URL found for the given input' });
    }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
