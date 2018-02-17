import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import path from 'path'
import passport from 'passport'
import expressValidator from 'express-validator'

import config from './utils/config'
import jwtAuth from './utils/passport'

import user from './routes/user'
import study from './routes/study'
import mcq from './routes/mcq'
import upload from './routes/upload'

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
app.use('/', express.static(path.join(__dirname, 'public')))

// api field validator
app.use(expressValidator())

// passport initialization..
app.use(passport.initialize())
jwtAuth(passport)

// Api end points
app.use('/api', user)
app.use('/api', study)
app.use('/api', mcq)
app.use('/api', upload)

app.listen(port, () => {
console.log(`
==============================================
[+] Server running on port: ${port}
==============================================
`)
})