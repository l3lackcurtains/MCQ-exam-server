'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongoosePaginate = require('mongoose-paginate');

var _mongoosePaginate2 = _interopRequireDefault(_mongoosePaginate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var studySchema = Schema({
    question: {
        type: String,
        required: true
    },
    answers: {
        type: [String]
    },
    imageUrl: {
        type: String
    },
    category: {
        type: String,
        required: true
    },
    subCategory: {
        type: String,
        required: true
    }
}, { collection: 'study', timestamps: true });

studySchema.plugin(_mongoosePaginate2.default);

var Study = _mongoose2.default.model('Study', studySchema);

exports.default = Study;