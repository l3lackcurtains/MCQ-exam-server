import User from '../models/user'

const roleAuth = (roles) => {
	const roleAuthorization = async (req, res, next) => {
		const user = req.user
		const foundUser = await User.findById(user.id)
		if (!foundUser) {
			res.status(422).json({ error: 'No user found.' })
		}
		if (roles.indexOf(foundUser.role) > -1) {
			return next()
		}

		res.status(401).json({ status: false, error: 'You are not authorized to view this content' })
	}
	return roleAuthorization
}

export default roleAuth