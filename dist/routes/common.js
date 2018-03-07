'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _md = require('md5');

var _md2 = _interopRequireDefault(_md);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _study = require('../models/study');

var _study2 = _interopRequireDefault(_study);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

/*
 ***************************************
 * Post study
 * *************************************
*/
router.post('/study', function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
    var query;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            query = req.body.question;

            _study2.default.find({ question: new RegExp(query, 'i') }, function (err, data) {
              if (err) res.send(err);
              res.render('result.hbs', { studies: data });
            });

          case 2:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

router.get('/study', function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _study2.default.find({}, function (err, data) {
              if (err) res.send(err);
              res.render('result.hbs', { studies: data });
            });

          case 1:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());

router.get('/study/:id', function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req, res) {
    var id;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            id = req.params.id;

            _study2.default.findById(id, function (err, data) {
              if (err) res.send(err);
              res.render('singleResult.hbs', data);
            });

          case 2:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());

/*
 ***************************************
 * Image Upload
 * *************************************
*/
var imageStorage = _multer2.default.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, _path2.default.resolve(__dirname + '/../public/media'));
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

router.post('/upload-image', cpUpload, function () {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(req, res) {
    var studyID, file, study, updateStudy;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            studyID = req.query.id;
            file = req.file;

            if (!file) {
              _context4.next = 11;
              break;
            }

            _context4.next = 5;
            return _study2.default.findOne({ _id: studyID });

          case 5:
            study = _context4.sent;

            if (!study) res.json({ success: false, message: 'Study id is invalid.' });
            study.set({ imageUrl: '/media/' + file.filename });
            updateStudy = study.save();

            if (!updateStudy) res.json({ success: false, message: 'Something went wrong try again.' });
            res.redirect('/');

          case 11:
            return _context4.abrupt('return', res.json({ status: false, message: 'Error uploading image.' }));

          case 12:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}());

router.get('/upload-image', function (req, res) {
  res.redirect('/');
});

exports.default = router;