var express = require('express'),
    mongoose = require('mongoose'),
    mongoStore = require('connect-mongodb'),
    models = require('./models'),
    reg,
    stylus = require("stylus"),
    nib = require("nib"),
    passport = require('passport'),
    util = require('util'),
    GitHubStrategy = require('passport-github').Strategy;

var GITHUB_CLIENT_ID = "4c5f19b873ffd11a16e4",
    GITHUB_CLIENT_SECRET = "1e14d564e9e53cab1e292b5ae4833498317cfd8d";

var app = express();

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://osid.in"
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
    Registration.find({id: profile.id}, 'name', function(err, user){
                      if(err){
                        var reg = new Registration();
                        reg.set('id', profile.id);
                        return done(null, reg);	
                      }else{
                        console.log(user);
			return done(null, user);
                      }
                     })

    });
  }
));

app.get('/auth/github',
  passport.authenticate('github'),
  function(req, res){

  });

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}


//setup registration model
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
app.use(stylus.middleware({
  src: __dirname + '/assets',
  compile: compile
}));
app.use(express.static(__dirname + '/assets'));
app.use(express.bodyParser());

app.get('/', function (req, res) {
  res.render('index', {title: ''});
});

app.post('/register', function (req, res) {
  console.log(req.body);
  var reg = new Registration({githubHandle:req.param('githubHandle'), organization:req.param('organization')});
  console.log(reg);
  reg.save(function(err) {
    if (err) {
      console.log("Error: ", err);
      res.send('Error saving id -', err);
    } else
      res.send('success');
  });
});

app.get('/about', function (req, res) {
  res.render('about', {title: 'About'});
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
