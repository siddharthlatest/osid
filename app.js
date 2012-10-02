var express = require('express'),
    mongoose = require('mongoose'),
    mongoStore = require('connect-mongodb'),
    models = require('./models'),
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
  mongoose.connect('mongodb://106.187.50.124/foobar');
  mongoose.connection.on("open", function() {
    console.log("Connected to foobar schema");
    Registration.count({}, function(err, count) {console.log("Records: ", count);});
  });
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
app.use(express.bodyParser());

app.get('/', function (req, res) {
  res.render('index', {title: 'Home'});
});
app.post('/register', function (req, res) {
  console.log(req.body);
  var reg = new Registration({githubHandle:req.param('githubHandle'), organization:req.param('organization')});
  console.log(reg);
  reg.save(function(err) {
    if (err)
      console.log("Error: ", err);
  });
  res.render('index', {title: 'Home'});
});
app.get('/about', function (req, res) {
  res.render('about', {title: 'About'});
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
