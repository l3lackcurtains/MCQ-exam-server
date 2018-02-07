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

var mcqSchema = Schema({
    question: {
        type: String,
        required: true
    },
    rightAnswer: {
        type: String,
        required: true
    },
    rightAnswerDesc: {
        type: String,
        required: true
    },
    wrongAnswers: {
        type: [String],
        required: true
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
}, { collection: 'mcq', timestamps: true });

mcqSchema.plugin(_mongoosePaginate2.default);

var Mcq = _mongoose2.default.model('Mcq', mcqSchema);

exports.default = Mcq;