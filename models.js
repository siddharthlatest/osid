function defineModels(mongoose, fn) {
  var Schema = mongoose.Schema,
      ObjectId = Schema.ObjectId;
  var regSchema = new Schema({
    'firstname': String,
    'lastname': String,
    'hacklink': String,
    'hackdesc': String,
    'email': String,
    'cell': Number,
    'githubHandle': String,
    'twitterHandle': String,
    'organization': String,
    'id': String
  });

  mongoose.model('Registration', regSchema);
  fn();
}

exports.defineModels = defineModels;
