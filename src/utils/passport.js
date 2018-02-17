import Jwt from 'passport-jwt'

import User from '../models/user'
import config from './config'

const JwtStrategy = Jwt.Strategy
const ExtractJwt = Jwt.ExtractJwt

const jwtAuth = (passport) => {
	const options = {}
	options.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt')
	options.secretOrKey = config.secret
	passport.use(new JwtStrategy(options, async (jwtPayload, done) => {
		const user = await User.findOne({ _id: jwtPayload.data._id })
		if (!user) return done(null, false)
		return done(null, user)
	}))
}

export default jwtAuth