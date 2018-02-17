'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _passportJwt = require('passport-jwt');

var _passportJwt2 = _interopRequireDefault(_passportJwt);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var JwtStrategy = _passportJwt2.default.Strategy;
var ExtractJwt = _passportJwt2.default.ExtractJwt;

var jwtAuth = function jwtAuth(passport) {
	var options = {};
	options.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
	options.secretOrKey = _config2.default.secret;
	passport.use(new JwtStrategy(options, function () {
		var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(jwtPayload, done) {
			var user;
			return _regenerator2.default.wrap(function _callee$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							_context.next = 2;
							return _user2.default.findOne({ _id: jwtPayload.data._id });

						case 2:
							user = _context.sent;

							if (user) {
								_context.next = 5;
								break;
							}

							return _context.abrupt('return', done(null, false));

						case 5:
							return _context.abrupt('return', done(null, user));

						case 6:
						case 'end':
							return _context.stop();
					}
				}
			}, _callee, undefined);
		}));

		return function (_x, _x2) {
			return _ref.apply(this, arguments);
		};
	}()));
};

exports.default = jwtAuth;