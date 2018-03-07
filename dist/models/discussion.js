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

var discussionSchema = Schema({
    uid: {
        type: String,
        required: true
    },
    type: {
        type: Boolean
    },
    question: {
        type: String
    },
    answers: [{
        option: String,
        vote: Number,
        votedBy: [String]
    }],
    favoritedBy: [String]
}, { collection: 'discussion', timestamps: true });

discussionSchema.plugin(_mongoosePaginate2.default);

var Discussion = _mongoose2.default.model('Discussion', discussionSchema);

exports.default = Discussion;