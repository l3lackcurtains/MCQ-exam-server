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

var usermetaSchema = Schema({
  uid: {
    type: String,
    required: true,
    unique: true
  },
  myMcqs: {
    type: [String]
  },
  myStudys: {
    type: [String]
  },
  correctMcqs: {
    type: [String]
  },
  incorrectMcqs: {
    type: [String]
  },
  mcqBookmarks: {
    type: [String]
  },
  studyBookmarks: {
    type: [String]
  }
}, { collection: 'usermeta', timestamps: true });

usermetaSchema.plugin(_mongoosePaginate2.default);

var Usermeta = _mongoose2.default.model('Usermeta', usermetaSchema);

exports.default = Usermeta;