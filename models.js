/*var mongoose = require('mongoose'),
    db = mongoose.createConnection('localhost', 'registration', 5000);

db.on('error', console.error.bind(console, 'connection error.'));
db.once('open', function(){
  console.log('Connected to the database.');
});*/

function defineModels(mongoose, fn) {
  var Schema = mongoose.Schema,
      ObjectId = Schema.ObjectId;

  var regSchema = new mongoose.Schema({
    'github-handle': {type: String, index: true},
    'organisation': String
  });
  
  regSchema.method('save', function(err, params){
    console.log("registered"+params.git-handle+" "+params.organisation);
  });
  mongoose.model('Registration', regSchema);

  fn();
}
//var registration = db.model('Registration', regSchema);

exports.defineModels = defineModels;
