import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import path from 'path'
import passport from 'passport'
import expressValidator from 'express-validator'
import exphbs from 'express-handlebars'

import config from './utils/config'
import jwtAuth from './utils/passport'

import user from './routes/user'
import study from './routes/study'
import mcq from './routes/mcq'
import upload from './routes/upload'
import usermeta from './routes/usermeta'
import discussion from './routes/discussion'
import comment from './routes/comment'
// common routes
import common from './routes/common'

const app = express()
const port = process.env.PORT || 5000

// Database Setup
mongoose.Promise = global.Promise
mongoose.connect(config.mdbl)
const db = mongoose.connection
db.on('error', () => console.log('[-] Failed to connect to database.'))
    .once('open', () => console.log('[+] Connected to database. '))

// Server Setup
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false, parameterLimit: 50000 }))
app.use(helmet())
app.use(express.static(path.join(__dirname + '/public')))
app.disable('etag')

// api field validator
app.use(expressValidator())

app.get('/', (req, res) => {
    res.render('home')
})

// passport initialization..
app.use(passport.initialize())
jwtAuth(passport)

// Api end points
app.use('/', common)
app.use('/api', user)
app.use('/api', study)
app.use('/api', mcq)
app.use('/api', upload)
app.use('/api', usermeta)
app.use('/api', discussion)
app.use('/api', comment)

// handlebars viewengine
app.set('views', path.join(__dirname + '/views'));
app.engine('.hbs', exphbs({
        defaultLayout: 'main', 
        extname: '.hbs',
        layoutsDir: path.join(__dirname + '/views/layouts'),
}));
app.set('view engine', '.hbs');

app.listen(port, () => {
console.log(`
==============================================
[+] Server running on port: ${port}
==============================================
`)
})