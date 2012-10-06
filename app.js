var express = require('express'),
    mongoose = require('mongoose'),
    mongoStore = require('connect-mongodb'),
    models = require('./models'),
    reg,
    stylus = require("stylus"),
    nib = require("nib"),
    passport = require('passport'),
    util = require('util'),
    GitHubStrategy = require('passport-github').Strategy,
    config = require('./config');

var GITHUB_CLIENT_ID = config['GITHUB_CLIENT_ID'],
    GITHUB_CLIENT_SECRET = config['GITHUB_CLIENT_SECRET'];

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
    callbackURL: "http://"+ config['callback']+"/auth/github/callback#registration"
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
          reg.set('githubHandle', profile.username);
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
  mongoose.connect('mongodb://'+config['user']+':'+config['pass']+'@'+config['ip']+'/'+config['database'], function(err) {
    if (err)
      console.log('Database connection failed - ', err);
  });
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
  app.use(express.session({secret: config['SESSION_SECRET'], store: express.session.MemoryStore({reapInterval: 60000*10})}));
  app.use(passport.initialize());
  app.use(passport.session({secret: ''}));
  app.use(app.router);
});

app.get('/', function (req, res) {
  if (!req.session.passport.user) {
    res.locals.githubHandle=''
    res.locals.twitterHandle=''
    res.locals.organization=''
    res.locals.hackdesc=''
    res.locals.hacklink=''
    res.locals.cell=''
    res.locals.email=''
    res.locals.firstname=''
    res.locals.lastname=''
    res.render('index', {title: ''});
  } else {
    req.user['title'] = '';
    console.log('user - ', req.user);
    res.render('index', req.user);
  }
});

app.get('/auth/github',
  passport.authenticate('github'),
  function(req, res) {
    console.log('called while authentication');
  });

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {  // Hide the 'auth' URL
    res.redirect('/');
  });

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.post('/register', function (req, res) {
  console.log('Request parameters while saving - ', req.body);
  console.log('Twitter Handle - ', req.param('twitterHandle'));
  var reg = new Registration({githubHandle:req.param('githubHandle'), twitterHandle:req.param('twitterHandle'), organization:req.param('organization'), cell:req.param('cell'), email:req.param('email'), hacklink:req.param('hacklink'), hackdesc:req.param('hackdesc'), firstname:req.param('firstname'), lastname:req.param('lastname')});
  var upsertReg = reg.toObject(); // Convert Model to a simple object
  console.log('Upsert this -', upsertReg);
  console.log('ID to save - ', upsertReg.githubHandle);
  delete upsertReg._id;           // Delete the _id property, or "Modification on _id" not allowed error
  if (req.session.passport.user) {// Update the information if user is logged in
    console.log('User info. before, ', req.session.passport.user);
    req.session.passport.user = upsertReg;
    console.log('User info. now, ', req.session.passport.user);
  }
  Registration.update({githubHandle:upsertReg.githubHandle}, upsertReg, {upsert:true}, function(err) {
    if (err) {
      console.log("Error: ", err);
      res.send('Error saving id -', err);
    } else {
      console.log('send. success');
      res.send('success');
    }
  });
});

app.get('/about', function (req, res) {
  if (req.session.passport.user)
    res.locals.githubHandle = req.session.passport.user.githubHandle;
  else
    res.locals.githubHandle = ''
  res.render('about', {title: 'About'});
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
