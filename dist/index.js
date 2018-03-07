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

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _expressValidator = require('express-validator');

var _expressValidator2 = _interopRequireDefault(_expressValidator);

var _expressHandlebars = require('express-handlebars');

var _expressHandlebars2 = _interopRequireDefault(_expressHandlebars);

var _config = require('./utils/config');

var _config2 = _interopRequireDefault(_config);

var _passport3 = require('./utils/passport');

var _passport4 = _interopRequireDefault(_passport3);

var _user = require('./routes/user');

var _user2 = _interopRequireDefault(_user);

var _study = require('./routes/study');

var _study2 = _interopRequireDefault(_study);

var _mcq = require('./routes/mcq');

var _mcq2 = _interopRequireDefault(_mcq);

var _upload = require('./routes/upload');

var _upload2 = _interopRequireDefault(_upload);

var _usermeta = require('./routes/usermeta');

var _usermeta2 = _interopRequireDefault(_usermeta);

var _discussion = require('./routes/discussion');

var _discussion2 = _interopRequireDefault(_discussion);

var _comment = require('./routes/comment');

var _comment2 = _interopRequireDefault(_comment);

var _common = require('./routes/common');

var _common2 = _interopRequireDefault(_common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
// common routes

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
app.use(_express2.default.static(_path2.default.join(__dirname + '/public')));

// api field validator
app.use((0, _expressValidator2.default)());

app.get('/', function (req, res) {
    res.render('home');
});

// passport initialization..
app.use(_passport2.default.initialize());
(0, _passport4.default)(_passport2.default);

// Api end points
app.use('/', _common2.default);
app.use('/api', _user2.default);
app.use('/api', _study2.default);
app.use('/api', _mcq2.default);
app.use('/api', _upload2.default);
app.use('/api', _usermeta2.default);
app.use('/api', _discussion2.default);
app.use('/api', _comment2.default);

// handlebars viewengine
app.set('views', _path2.default.join(__dirname + '/views'));
app.engine('.hbs', (0, _expressHandlebars2.default)({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: _path2.default.join(__dirname + '/views/layouts')
}));
app.set('view engine', '.hbs');

app.listen(port, function () {
    console.log('\n==============================================\n[+] Server running on port: ' + port + '\n==============================================\n');
});