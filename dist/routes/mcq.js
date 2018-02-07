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

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _mcq = require('../models/mcq');

var _mcq2 = _interopRequireDefault(_mcq);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

/*
 ***************************************
 * get studies
 * *************************************
*/
router.get('/mcq', function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
        var _req$query, page, limit, order, sortBy, fields, filter, pageNo, limitNo, sort, select, findFilter, orderNo, data;

        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _req$query = req.query, page = _req$query.page, limit = _req$query.limit, order = _req$query.order, sortBy = _req$query.sortBy, fields = _req$query.fields, filter = (0, _objectWithoutProperties3.default)(_req$query, ['page', 'limit', 'order', 'sortBy', 'fields']);
                        pageNo = parseInt(page, 10);
                        limitNo = parseInt(limit, 10);
                        sort = { createdAt: -1 };
                        select = null;
                        findFilter = {};

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
                        if (fields) {
                            select = fields.split(',').join(' ');
                        }

                        // adjust the filter options
                        _lodash2.default.forIn(findFilter, function (value, key) {
                            if (value === 'false') {
                                findFilter = _lodash2.default.omit(findFilter, [key]);
                            }
                        });

                        _context.prev = 11;
                        _context.next = 14;
                        return _mcq2.default.paginate(findFilter, { page: pageNo, limit: limitNo, sort: sort, select: select });

                    case 14:
                        data = _context.sent;

                        if (!data) res.json({ success: false, message: "Error fetching mcq." });
                        res.json({ success: true, message: "Mcqs successfully fetched.", data: data });
                        _context.next = 22;
                        break;

                    case 19:
                        _context.prev = 19;
                        _context.t0 = _context['catch'](11);

                        res.json({ success: false, message: "Something went wrong, Try again.", error: _context.t0 });

                    case 22:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined, [[11, 19]]);
    }));

    return function (_x, _x2) {
        return _ref.apply(this, arguments);
    };
}());

/*
 ***************************************
 * get mcq by id
 * *************************************
*/
router.get('/mcq/:id', function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {
        var select, data;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        // field selection
                        select = null;

                        if (!!req.query.fields) {
                            select = req.query.fields.split(',').join(' ');
                        }

                        _context2.prev = 2;
                        _context2.next = 5;
                        return _mcq2.default.findOne({ _id: req.params.id }, select);

                    case 5:
                        data = _context2.sent;

                        if (!data) res.json({ success: false, message: 'Mcq id is invalid.' });
                        res.json({ success: true, message: "Mcq successfully fetched.", data: data });
                        _context2.next = 13;
                        break;

                    case 10:
                        _context2.prev = 10;
                        _context2.t0 = _context2['catch'](2);

                        res.json({ success: false, message: "Something went wrong, Try again.", error: _context2.t0 });

                    case 13:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined, [[2, 10]]);
    }));

    return function (_x3, _x4) {
        return _ref2.apply(this, arguments);
    };
}());

/*
 ***************************************
 * Post mcq
 * *************************************
*/
router.post('/mcq', function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req, res) {
        var mcq, newMcq;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _context3.prev = 0;
                        mcq = (0, _mcq2.default)(req.body);
                        _context3.next = 4;
                        return mcq.save();

                    case 4:
                        newMcq = _context3.sent;

                        if (!newMcq) res.json({ success: false, message: 'Error posting mcq.' });
                        res.json({ success: true, message: 'Mcq successfully Posted.', data: newMcq });
                        _context3.next = 12;
                        break;

                    case 9:
                        _context3.prev = 9;
                        _context3.t0 = _context3['catch'](0);

                        res.json({ success: false, message: 'Something went wrong, Try again.', error: _context3.t0 });

                    case 12:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, undefined, [[0, 9]]);
    }));

    return function (_x5, _x6) {
        return _ref3.apply(this, arguments);
    };
}());

/*
 ***************************************
 * Update mcq
 * *************************************
*/
router.put('/mcq/:id', function () {
    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(req, res) {
        var mcq, updateMcq;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        _context4.prev = 0;
                        _context4.next = 3;
                        return _mcq2.default.findOne({ _id: req.params.id });

                    case 3:
                        mcq = _context4.sent;

                        if (!mcq) res.json({ success: false, message: 'Mcq id is invalid.' });
                        mcq.set((0, _extends3.default)({}, req.body));
                        _context4.next = 8;
                        return mcq.save();

                    case 8:
                        updateMcq = _context4.sent;

                        if (!updateMcq) res.json({ success: false, message: 'Error updating mcq.' });
                        res.json({ success: true, message: "Mcq updated successfully", data: updateMcq });
                        _context4.next = 16;
                        break;

                    case 13:
                        _context4.prev = 13;
                        _context4.t0 = _context4['catch'](0);

                        res.json({ success: false, message: 'Something went wrong, Try again.', error: _context4.t0 });

                    case 16:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, undefined, [[0, 13]]);
    }));

    return function (_x7, _x8) {
        return _ref4.apply(this, arguments);
    };
}());

/*
 ***************************************
 * Delete mcq
 * *************************************
*/
router.delete('/mcq/:id', function () {
    var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(req, res) {
        var removedMcq;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        _context5.prev = 0;
                        _context5.next = 3;
                        return _mcq2.default.findByIdAndRemove(req.params.id);

                    case 3:
                        removedMcq = _context5.sent;

                        if (!removedMcq) res.json({ success: false, message: 'Error deleting mcq.' });
                        res.json({ success: true, message: 'Mcq deleted successfully.' });
                        _context5.next = 11;
                        break;

                    case 8:
                        _context5.prev = 8;
                        _context5.t0 = _context5['catch'](0);

                        res.json({ success: false, message: "Something went wrong, Try again.", error: err });

                    case 11:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, undefined, [[0, 8]]);
    }));

    return function (_x9, _x10) {
        return _ref5.apply(this, arguments);
    };
}());

exports.default = router;