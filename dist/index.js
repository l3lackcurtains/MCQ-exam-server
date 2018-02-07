'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _helmet = require('helmet');

var _helmet2 = _interopRequireDefault(_helmet);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _config = require('./utils/config');

var _config2 = _interopRequireDefault(_config);

var _study = require('./routes/study');

var _study2 = _interopRequireDefault(_study);

var _mcq = require('./routes/mcq');

var _mcq2 = _interopRequireDefault(_mcq);

var _upload = require('./routes/upload');

var _upload2 = _interopRequireDefault(_upload);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var port = process.env.PORT || 5000;

// Database Setup
_mongoose2.default.Promise = global.Promise;
_mongoose2.default.connect(_config2.default.mdbl);
var db = _mongoose2.default.connection;
db.on('error', function () {
    return console.log('[-] Failed to connect to database.');
}).once('open', function () {
    return console.log('[+] Connected to database. ');
});

// Server Setup
app.use(_bodyParser2.default.json({ limit: '50mb' }));
app.use(_bodyParser2.default.urlencoded({ limit: '50mb', extended: false, parameterLimit: 50000 }));
app.use((0, _helmet2.default)());
app.use('/', _express2.default.static(_path2.default.join(__dirname, 'public')));

// Api end points
app.use('/api', _study2.default);
app.use('/api', _mcq2.default);
app.use('/api', _upload2.default);

app.listen(port, function () {
    console.log('\n==============================================\n[+] Server running on port: ' + port + '\n==============================================\n');
});