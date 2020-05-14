var mongoose = require('mongoose'),
passLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    username: String,
    password : String
});
UserSchema.plugin(passLocalMongoose);
var User = mongoose.model("User", UserSchema);
module.exports = User;  