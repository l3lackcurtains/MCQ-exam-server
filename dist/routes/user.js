'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _token = require('../models/token');

var _token2 = _interopRequireDefault(_token);

var _resetToken = require('../models/resetToken');

var _resetToken2 = _interopRequireDefault(_resetToken);

var _config = require('../utils/config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

/*
 ***************************************
 * Register New User
 * *************************************
*/
router.post('/register', function (req, res) {
	req.check('email', 'Email field is empty.').notEmpty();
	req.check('email', 'Invalid email.').isEmail();
	req.check('password', 'Password field is empty.').notEmpty();
	req.check('password', 'Password length is less than 6.').isLength({ min: 6 });
	req.check('firstname', 'Firstname field is empty.').notEmpty();
	req.check('lastname', 'Lastname field is empty.').notEmpty();
	var errors = req.validationErrors();
	if (errors) {
		var messages = [];
		errors.forEach(function (error) {
			messages.push(error.msg);
		});
		var newErrors = errors.map(function (err) {
			return '' + err.msg;
		});
		return res.json({
			success: false,
			message: 'Something went wrong.',
			errors: newErrors
		});
	}

	return _user2.default.findOne({ email: req.body.email }, function (e, user) {
		if (user) {
			return res.json({
				success: false,
				message: 'User with this email already exist.'
			});
		}
		var newUser = (0, _user2.default)({
			email: req.body.email,
			password: req.body.password,
			firstname: req.body.firstname,
			lastname: req.body.lastname
		});
		return newUser.save(function (err) {
			if (err) {
				return res.json({
					success: false,
					message: 'Something went wrong, Try again.',
					error: err
				});
			}

			// Create a email verification token
			var token = (0, _token2.default)({
				userId: newUser._id,
				token: _crypto2.default.randomBytes(16).toString('hex')
			});

			// Save the verification token
			return token.save(function (err2) {
				if (err2) {
					_user2.default.findByIdAndRemove(newUser._id);
					return res.json({
						success: false,
						message: 'Something went wrong, Try again.',
						error: err2
					});
				}

				// Send the email
				var transporter = _nodemailer2.default.createTransport({
					host: 'smtp.gmail.com',
					port: 587,
					secure: false,
					auth: {
						user: _config2.default.email.id,
						pass: _config2.default.email.pass
					}
				});
				var mailOptions = {
					from: 'no-reply@brainapp.com',
					to: newUser.email,
					subject: 'Account Verification',
					text: 'Hello,\n\t\t\t\t\t\t\n\n\n\t\t\t\t\t\tPlease verify your account by clicking the link:\n http://' + req.headers.host + '/verification/' + token.token + '\n'

					// Send verification Link
				};return transporter.sendMail(mailOptions, function (trerr) {
					if (trerr) {
						_user2.default.findByIdAndRemove(newUser._id);
						return res.json({ status: false, message: 'Couldn\'t send email verification', error: trerr.message });
					}
					return res.json({ success: true, message: 'A verification email has been sent to ' + newUser.email });
				});
			});
		});
	});
});

/*
 ***************************************
 * Email Verification
 * *************************************
*/
router.post('/verification', function (req, res) {
	req.check('token', 'Token field is empty.').notEmpty();
	var errors = req.validationErrors();
	if (errors) {
		var messages = [];
		errors.forEach(function (error) {
			messages.push(error.msg);
		});
		var newErrors = errors.map(function (err) {
			return '' + err.msg;
		});
		return res.json({
			success: false,
			message: 'Something went wrong.',
			errors: newErrors
		});
	}

	return _token2.default.findOne({ token: req.body.token }, function (err, token) {
		if (!token) {
			return res.json({
				success: false,
				message: 'Token is invalid or expired. Create user again.'
			});
		}
		return _user2.default.findOne({ _id: token.userId }, function (err2, user) {
			if (!user) {
				return res.json({
					success: false,
					message: 'No user found with this token.'
				});
			}
			if (user.isVerified) {
				return res.json({
					success: false,
					message: 'User Already Verified.'
				});
			}
			var newUser = user;
			newUser.isVerified = true;
			return newUser.save(function (err3) {
				if (err3) {
					return res.json({
						success: false,
						message: 'Couldn\'t verify user',
						error: err3
					});
				}
				return res.json({
					success: true,
					message: 'User verified successfully.'
				});
			});
		});
	});
});

/*
 ***************************************
 * Resend Email Verification
 * *************************************
*/
router.post('/resend-verification', function (req, res) {
	req.check('email', 'Email field is empty.').notEmpty();
	var errors = req.validationErrors();
	if (errors) {
		var messages = [];
		errors.forEach(function (error) {
			messages.push(error.msg);
		});
		var newErrors = errors.map(function (err) {
			return '' + err.msg;
		});
		return res.json({
			success: false,
			message: 'Something went wrong.',
			errors: newErrors
		});
	}
	return _user2.default.findOne({ email: req.body.email }, function (err, user) {
		if (!user) {
			return res.json({
				success: false,
				message: 'User with this email doesn\'t exist.'
			});
		}
		if (user.isVerified) {
			return res.json({
				success: false,
				message: 'User with this email is already verified.'
			});
		}

		// Create a email verification token
		var token = (0, _token2.default)({
			userId: user._id,
			token: _crypto2.default.randomBytes(16).toString('hex')
		});

		// Save the verification token
		return token.save(function (err2) {
			if (err2) {
				return res.json({
					success: false,
					message: 'Something went wrong, Try again.',
					error: err2
				});
			}

			// Send the email
			var transporter = _nodemailer2.default.createTransport({
				host: 'smtp.gmail.com',
				port: 587,
				secure: false,
				auth: {
					user: _config2.default.email.id,
					pass: _config2.default.email.pass
				}
			});
			var mailOptions = {
				from: 'no-reply@yourwebapplication.com',
				to: user.email,
				subject: 'Account Verification',
				text: 'Hello,\n\n Please verify your account by clicking the link: \n http://' + req.headers.host + '/verification/' + token.token + '\n'

				// Send verification Link
			};return transporter.sendMail(mailOptions, function (trerr) {
				if (trerr) {
					return res.json({ status: false, message: 'Couldn\'t send email verification', error: trerr.message });
				}
				return res.json({ status: false, message: 'A verification email has been sent to ' + user.email });
			});
		});
	});
});

/*
 ***************************************
 * Ask For reset password
 * *************************************
*/
router.post('/ask-reset-password', function (req, res) {
	req.check('email', 'Email field is empty.').notEmpty();
	req.check('email', 'Invalid email.').isEmail();
	var errors = req.validationErrors();
	if (errors) {
		var messages = [];
		errors.forEach(function (error) {
			messages.push(error.msg);
		});
		var newErrors = errors.map(function (err) {
			return '' + err.msg;
		});
		return res.json({
			success: false,
			message: 'Something went wrong.',
			errors: newErrors
		});
	}

	return _user2.default.findOne({ email: req.body.email }, function (e, user) {
		if (!user) {
			return res.json({
				success: false,
				message: 'User with this email doesn\'t exist.'
			});
		}

		// Create a password reset token
		var token = (0, _resetToken2.default)({
			userId: user._id,
			token: _crypto2.default.randomBytes(16).toString('hex')
		});

		// Save the verification token
		return token.save(function (err2) {
			if (err2) {
				return res.json({
					success: false,
					message: 'Something went wrong, Try again.',
					error: err2
				});
			}

			// Send the email
			var transporter = _nodemailer2.default.createTransport({
				host: 'smtp.gmail.com',
				port: 587,
				secure: false,
				auth: {
					user: _config2.default.email.id,
					pass: _config2.default.email.pass
				}
			});
			var mailOptions = {
				from: 'no-reply@yourwebapplication.com',
				to: user.email,
				subject: 'Reset Password',
				text: 'Hello,\n\n Please reset your password by clicking the link: \n http://' + req.headers.host + '/reset-password/' + token.token + '\n'

				// Send verification Link
			};return transporter.sendMail(mailOptions, function (trerr) {
				if (trerr) {
					return res.json({ status: false, message: 'Couldn\'t send password reset email', error: trerr.message });
				}
				return res.json({ status: false, message: 'An email to reset password has been sent to ' + user.email });
			});
		});
	});
});

/*
 ***************************************
 * Reset Password
 * *************************************
*/
router.post('/reset-password', function (req, res) {
	req.check('password', 'Password field is empty.').notEmpty();
	req.check('token', 'Token field is empty.').notEmpty();
	var errors = req.validationErrors();
	if (errors) {
		var messages = [];
		errors.forEach(function (error) {
			messages.push(error.msg);
		});
		var newErrors = errors.map(function (err) {
			return '' + err.msg;
		});
		return res.json({
			success: false,
			message: 'Something went wrong.',
			errors: newErrors
		});
	}
	return _resetToken2.default.findOne({ token: req.body.token }, function (err, token) {
		if (!token) {
			return res.json({
				success: false,
				message: 'Token is invalid or expired.'
			});
		}
		return _user2.default.findOne({ _id: token.userId }, function (e, user) {
			if (!user) {
				return res.json({
					success: false,
					message: 'User doesn\'t exists'
				});
			}
			var newUser = user;
			newUser.password = req.body.password;
			return newUser.save(function (err2) {
				if (err2) {
					return res.json({
						success: false,
						message: 'Couldn\'t reset password',
						error: err2
					});
				}
				return res.json({
					success: true,
					message: 'Password changed successfully.'
				});
			});
		});
	});
});

/*
 ***************************************
 * Authenticate User
 * *************************************
*/
router.post('/authenticate', function (req, res) {
	req.check('email', 'Email field is empty.').notEmpty();
	req.check('email', 'Invalid email.').isEmail();
	req.check('password', 'Password field is empty.').notEmpty();
	req.check('password', 'Password length is less than 6.').isLength({ min: 6 });

	var errors = req.validationErrors();
	if (errors) {
		var messages = [];
		errors.forEach(function (error) {
			messages.push(error.msg);
		});
		var newErrors = errors.map(function (err) {
			return '' + err.msg;
		});
		return res.json({
			success: false,
			message: 'Something went wrong.',
			errors: newErrors
		});
	}
	return _user2.default.findOne({ email: req.body.email }, function (err, user) {
		if (err) {
			return res.json({
				success: false,
				message: 'Something went wrong, Try again.'
			});
		}
		if (!user) {
			return res.json({
				success: false,
				message: 'User with this email doesn\'t exist.'
			});
		}
		if (!user.isVerified) {
			return res.json({
				success: false,
				message: 'User is not verified. Check your email.'
			});
		}
		if (!user.comparePassword(req.body.password)) {
			return res.json({ success: false, message: 'Incorrect Password.' });
		}
		var tokenData = {
			_id: user._id,
			email: user.email,
			firstname: user.firstname,
			lastname: user.lastname,
			profilePhoto: user.profilePhoto
		};
		var token = _jsonwebtoken2.default.sign({ data: tokenData }, _config2.default.secret, {
			expiresIn: 1204800
		});
		return res.json({ success: true, token: 'JWT ' + token });
	});
});

/*
 ***************************************
 * get Users
 * *************************************
*/
router.get('/users', _passport2.default.authenticate('jwt', { session: false }), function () {
	var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
		var _req$query, page, limit, order, sortBy, fields, filter, pageNo, limitNo, sort, findFilter, select, orderNo, data;

		return _regenerator2.default.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						_req$query = req.query, page = _req$query.page, limit = _req$query.limit, order = _req$query.order, sortBy = _req$query.sortBy, fields = _req$query.fields, filter = (0, _objectWithoutProperties3.default)(_req$query, ['page', 'limit', 'order', 'sortBy', 'fields']);
						pageNo = parseInt(page, 10);
						limitNo = parseInt(limit, 10);
						sort = { createdAt: -1 };
						findFilter = {};
						select = 'firstname lastname email createdAt updatedAt';

						// filter

						if (filter) {
							findFilter = filter;
						}

						// sorting 
						if (sortBy) {
							orderNo = order === -1 ? -1 : 1;

							sort = (0, _defineProperty3.default)({}, sortBy, orderNo);
						}

						// pagination
						if (!limitNo || !pageNo) {
							pageNo = 1;
							limitNo = 999999;
						}

						// field selection
						if (req.query.fields) {
							select = req.query.fields.split(',').join(' ');
						}
						_context.next = 12;
						return _user2.default.paginate(findFilter, { page: pageNo, limit: limitNo, sort: sort, select: select });

					case 12:
						data = _context.sent;

						if (!data) res.json({ success: false, message: data });
						res.json({ success: true, message: data });

					case 15:
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

/*
 ***************************************
 * get user by id
 * *************************************
*/
router.get('/users/:id', function () {
	var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {
		var select, user;
		return _regenerator2.default.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						select = 'email firstname lastname profilePhoto';
						_context2.next = 3;
						return _user2.default.findOne({ _id: req.params.id }, select);

					case 3:
						user = _context2.sent;

						if (!user) res.json({ success: false, message: 'User id is invalid.' });
						res.json({ success: true, message: user });

					case 6:
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

/*
 ***************************************
 * update user
 * *************************************
*/
router.put('/users/:id', _passport2.default.authenticate('jwt', { session: false }), function () {
	var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req, res) {
		var user, _req$body, password, oldPassword, rest;

		return _regenerator2.default.wrap(function _callee3$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						_context3.next = 2;
						return _user2.default.findOne({ _id: req.params.id });

					case 2:
						user = _context3.sent;

						if (!user) res.json({ success: false, message: 'User id is invalid.' });
						_req$body = req.body, password = _req$body.password, oldPassword = _req$body.oldPassword, rest = (0, _objectWithoutProperties3.default)(_req$body, ['password', 'oldPassword']);

						user.set((0, _extends3.default)({}, rest));

						if (!(password && oldPassword)) {
							_context3.next = 12;
							break;
						}

						if (!user.comparePassword(oldPassword)) {
							_context3.next = 11;
							break;
						}

						user.password = password;
						_context3.next = 12;
						break;

					case 11:
						return _context3.abrupt('return', res.json({ success: false, message: 'Old Password doesn\'t match the exact one' }));

					case 12:
						return _context3.abrupt('return', user.save(function (err, updatedUser) {
							if (err) res.json({ success: false, message: 'Something went wrong try again.' });
							res.json({ success: true, message: updatedUser });
						}));

					case 13:
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
 * delete user
 * *************************************
*/
router.delete('/users/:id', _passport2.default.authenticate('jwt', { session: false }), function () {
	var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(req, res) {
		var removeduser;
		return _regenerator2.default.wrap(function _callee4$(_context4) {
			while (1) {
				switch (_context4.prev = _context4.next) {
					case 0:
						_context4.next = 2;
						return _user2.default.findByIdAndRemove(req.params.id);

					case 2:
						removeduser = _context4.sent;

						if (!removeduser) {
							res.json({ success: false, message: 'Unable to delete user.' });
						}
						res.json({ success: true, message: 'User removed successfully.' });

					case 5:
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

exports.default = router;