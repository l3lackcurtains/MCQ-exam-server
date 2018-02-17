'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bcryptNodejs = require('bcrypt-nodejs');

var _bcryptNodejs2 = _interopRequireDefault(_bcryptNodejs);

var _mongoosePaginate = require('mongoose-paginate');

var _mongoosePaginate2 = _interopRequireDefault(_mongoosePaginate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var userSchema = Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	isVerified: {
		type: Boolean,
		default: false
	},
	firstname: {
		type: String
	},
	lastname: {
		type: String
	},
	profilePhoto: {
		type: String,
		default: '/images/avatar.png'
	}
}, { collection: 'user', timestamps: true });

/* eslint-disable */
// Before User is created, hash the password
userSchema.pre('save', function (next) {
	var user = this;
	if (!user.isModified('password')) return next();
	_bcryptNodejs2.default.hash(user.password, null, null, function (err, hash) {
		if (err) return next(err);
		user.password = hash;
		next();
	});
});

// Compare password method used during login
userSchema.methods.comparePassword = function (pass) {
	var user = this;
	return _bcryptNodejs2.default.compareSync(pass, user.password);
};

userSchema.plugin(_mongoosePaginate2.default);

var User = _mongoose2.default.model('User', userSchema);

exports.default = User;