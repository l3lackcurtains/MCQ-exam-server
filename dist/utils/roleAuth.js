'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var roleAuth = function roleAuth(roles) {
	var roleAuthorization = function () {
		var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res, next) {
			var user, foundUser;
			return _regenerator2.default.wrap(function _callee$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							user = req.user;
							_context.next = 3;
							return _user2.default.findById(user.id);

						case 3:
							foundUser = _context.sent;

							if (!foundUser) {
								res.status(422).json({ error: 'No user found.' });
							}

							if (!(roles.indexOf(foundUser.role) > -1)) {
								_context.next = 7;
								break;
							}

							return _context.abrupt('return', next());

						case 7:

							res.status(401).json({ status: false, error: 'You are not authorized to view this content' });

						case 8:
						case 'end':
							return _context.stop();
					}
				}
			}, _callee, undefined);
		}));

		return function roleAuthorization(_x, _x2, _x3) {
			return _ref.apply(this, arguments);
		};
	}();
	return roleAuthorization;
};

exports.default = roleAuth;