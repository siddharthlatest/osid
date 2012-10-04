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

var GITHUB_CLIENT_ID = "3265ceedda2e8dcc7863",
    GITHUB_CLIENT_SECRET = "61396652f379ac7b1063242bdc1330aeda459854";

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
    callbackURL: "http://127.0.0.1:5000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      console.log('User profile after github login - ', profile);
      console.log('Access token - ', accessToken);
      Registration.findOne({'githubHandle': profile.username}, function(err, user) {
        console.log('Error any - ', err);
        if(err) {    // OAuth error
          return done(err);
        } else if (user) {  // User record in the database
          console.log("User is in the database", user);
          return done(null, user);
        } else {     // record not in database
          console.log("New registration", user);
          var reg = new Registration();
          reg.set('githubHandle', profile.id);
          return done(null, reg);	
        }
      })
    });
  }
));

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

app.configure(function() {
  app.set('views', __dirname + '/views')
  app.set('view engine', 'jade')
  app.use(express.logger('dev'))
  app.use(stylus.middleware({
    src: __dirname + '/assets',
    compile: compile
  }));
  app.use(express.static(__dirname + '/assets'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({secret: 'keyboard cat'}));
  app.use(passport.initialize());
  app.use(passport.session({secret: ''}));
  app.use(app.router);
});

app.get('/', function (req, res) {
  res.locals.githubHandle=''
  res.locals.twitterHandle=''
  res.locals.organization=''
  res.locals.hackdesc=''
  res.locals.hacklink=''
  res.locals.cell=''
  res.locals.email=''
  res.locals.firstname=''
  res.locals.lastname=''
  res.render('index', {title: '', githubHandle: ''});
});

app.get('/auth/github',
  passport.authenticate('github'),
  function(req, res) {
    console.log('called while authentication');
  });

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    res.locals.githubHandle=''
    res.locals.twitterHandle=''
    res.locals.organization=''
    res.locals.hackdesc=''
    res.locals.hacklink=''
    res.locals.cell=''
    res.locals.email=''
    res.locals.firstname=''
    res.locals.lastname=''
    var object = req.user;
    object['title'] = '';
    console.log('Before rendering: User --', object);
    res.render('index', object);
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
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
  res.locals.githubHandle = ''
  res.render('about', {title: 'About'});
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
