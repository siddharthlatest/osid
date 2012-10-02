var express = require('express'),
    mongoose = require('mongoose'),
    mongoStore = require('connect-mongodb'),
    models = require('./models'),
    db,
    reg,
    stylus = require("stylus"),
    nib = require("nib");
var app = express();

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}

models.defineModels(mongoose, function() {
  app.registration = Registration = mongoose.model('Registration');
  db = mongoose.connect(app.set('db-uri'));
});

app.configure('registration', function() {
  app.set('db-uri', 'mongodb://localhost/hackathon-registraion');
});

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(express.logger('dev'))
app.use(stylus.middleware(
  { src: __dirname + '/assets'
  , compile: compile
  }
))
app.use(express.static(__dirname + '/assets'));

app.get('/', function (req, res) {
  res.render('index', {title: 'Home'});
});
app.post('/register', function (req, res) {
  res.render('index', {title: 'Home'});
});
app.get('/about', function (req, res) {
  res.render('about', {title: 'About'});
});

app.post('/register', function(request, response){
  var reg = new Registration({request.params.github-handle, request.params.organisation});
  reg.save();
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
