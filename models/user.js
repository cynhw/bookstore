var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
	name: {
		first: String,
		last: String
	},
	email: String,
	password: String,
	address: {
		street: String,
		aptNumber: Number,
		city: String,
		state: String,
		zipCode: Number
	},
	phone: String
});

UserSchema.set('toJSON', {
	transform: function(doc, ret, options) {
		var returnJson = {
			id: ret._id,
			email: ret.email,
			name: ret.name, 
			address: ret.address
		};
		return returnJson;
	}
});

UserSchema.methods.authenticated = function(password, callback) {
	bcrypt.compare(password, this.password, function(err, res) {
		if (err) {
			callback(err);
		} else {
			callback(null, res ? this : false);
		}
	});
}

UserSchema.pre('save', function(next) {
	var user = this;

	if (!user.isModified('password')) return next();

	user.password = bcrypt.hashSync(user.password, 10);
	next();
});

module.exports = mongoose.model('User', UserSchema);