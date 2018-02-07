'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _md = require('md5');

var _md2 = _interopRequireDefault(_md);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

/*
 ***************************************
 * Image Upload
 * *************************************
*/
var imageStorage = _multer2.default.diskStorage({
	destination: function destination(req, file, cb) {
		cb(null, './src/public/media');
	},
	filename: function filename(req, file, cb) {
		var filename = (0, _md2.default)('' + file.originalname) + _path2.default.extname(file.originalname);
		if (req.query.name) {
			filename = req.query.name + _path2.default.extname(file.originalname);
		}
		cb(null, filename);
	}
});

var imageUpload = (0, _multer2.default)({
	fileFilter: function fileFilter(req, file, cb) {
		var ext = _path2.default.extname(file.originalname);
		if (ext !== '.png' && ext !== '.jpg' && ext !== '.JPG' && ext !== '.gif' && ext !== '.jpeg') {
			req.fileValidationError = 'goes wrong on the mimetype';
			return cb(null, false, new Error('goes wrong on the mimetype'));
		}
		cb(null, true);
	},
	storage: imageStorage
});

var cpUpload = imageUpload.single('image');

router.post('/upload-image', cpUpload, function (req, res) {
	var file = req.file;
	if (file) return res.json({ success: true, message: 'Image successfully uploaded', file: file });
	return res.json({ status: false, message: 'Error uploading image.' });
});

exports.default = router;