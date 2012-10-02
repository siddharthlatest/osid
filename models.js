function defineModels(mongoose, fn) {
  var Schema = mongoose.Schema,
      ObjectId = Schema.ObjectId;
  var regSchema = new Schema({
    'githubHandle': {type: String, index: true},
    'organization': String
  });
  mongoose.model('Registration', regSchema);
  fn();
}

exports.defineModels = defineModels;
