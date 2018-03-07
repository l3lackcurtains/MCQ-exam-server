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

var commentSchema = Schema({
	uid: {
		type: String,
		required: true
	},
	did: {
		type: String,
		required: true
	},
	comment: {
		type: String
	}
}, { collection: 'comment', timestamps: true });

commentSchema.plugin(_mongoosePaginate2.default);

var Comment = _mongoose2.default.model('Comment', commentSchema);

exports.default = Comment;