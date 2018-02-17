import express from 'express'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import User from '../models/user'
import Token from '../models/token'
import ResetToken from '../models/resetToken'
import config from '../utils/config'

const router = express.Router()

/*
 ***************************************
 * Register New User
 * *************************************
*/
router.post('/register', (req, res) => {
	req.check('email', 'Email field is empty.').notEmpty()
	req.check('email', 'Invalid email.').isEmail()
	req.check('password', 'Password field is empty.').notEmpty()
	req.check('password', 'Password length is less than 6.').isLength({ min: 6 })
	req.check('firstname', 'Firstname field is empty.').notEmpty()
	req.check('lastname', 'Lastname field is empty.').notEmpty()
	const errors = req.validationErrors()
	if (errors) {
		const messages = []
		errors.forEach((error) => {
			messages.push(error.msg)
		})
		const newErrors = errors.map(err => `${err.msg}`)
		return res.json({
			success: false,
			message: 'Something went wrong.',
			errors: newErrors,
		})
	}

	return User.findOne({ email: req.body.email }, (e, user) => {
		if (user) {
			return res.json({
				success: false,
				message: 'User with this email already exist.',
			})
		}
		const newUser = User({
			email: req.body.email,
			password: req.body.password,
			firstname: req.body.firstname,
			lastname: req.body.lastname,
		})
		return newUser.save((err) => {
			if (err) {
				return res.json({
					success: false,
					message: 'Something went wrong, Try again.',
					error: err,
				})
			}

			// Create a email verification token
			const token = Token({
				userId: newUser._id,
				token: crypto.randomBytes(16).toString('hex'),
			})

			// Save the verification token
			return token.save((err2) => {
				if (err2) {
					User.findByIdAndRemove(newUser._id)
					return res.json({
						success: false,
						message: 'Something went wrong, Try again.',
						error: err2,
					})
				}

				// Send the email
				const transporter = nodemailer.createTransport({
					host: 'smtp.gmail.com',
					port: 587,
					secure: false,
					auth: {
						user: config.email.id,
						pass: config.email.pass,
					},
				})
				const mailOptions = {
					from: 'no-reply@brainapp.com',
					to: newUser.email,
					subject: 'Account Verification',
					text: `Hello,
						\n\n
						Please verify your account by clicking the link:\n http://${req.headers.host}/verification/${token.token}\n`,
				}

				// Send verification Link
				return transporter.sendMail(mailOptions, (trerr) => {
					if (trerr) {
						User.findByIdAndRemove(newUser._id)
						return res.json({ status: false, message: 'Couldn\'t send email verification', error: trerr.message })
					}
					return res.json({ success: true, message: `A verification email has been sent to ${newUser.email}` })
				})
			})
		})
	})
})

/*
 ***************************************
 * Email Verification
 * *************************************
*/
router.post('/verification', (req, res) => {
	req.check('token', 'Token field is empty.').notEmpty()
	const errors = req.validationErrors()
	if (errors) {
		const messages = []
		errors.forEach((error) => {
			messages.push(error.msg)
		})
		const newErrors = errors.map(err => `${err.msg}`)
		return res.json({
			success: false,
			message: 'Something went wrong.',
			errors: newErrors,
		})
	}

	return Token.findOne({ token: req.body.token }, (err, token) => {
		if (!token) {
			return res.json({
				success: false,
				message: 'Token is invalid or expired. Create user again.',
			})
		}
		return User.findOne({ _id: token.userId }, (err2, user) => {
			if (!user) {
				return res.json({
					success: false,
					message: 'No user found with this token.',
				})
			}
			if (user.isVerified) {
				return res.json({
					success: false,
					message: 'User Already Verified.',
				})
			}
			const newUser = user
			newUser.isVerified = true
			return newUser.save((err3) => {
				if (err3) {
					return res.json({
						success: false,
						message: 'Couldn\'t verify user',
						error: err3,
					})
				}
				return res.json({
					success: true,
					message: 'User verified successfully.',
				})
			})
		})
	})
})

/*
 ***************************************
 * Resend Email Verification
 * *************************************
*/
router.post('/resend-verification', (req, res) => {
	req.check('email', 'Email field is empty.').notEmpty()
	const errors = req.validationErrors()
	if (errors) {
		const messages = []
		errors.forEach((error) => {
			messages.push(error.msg)
		})
		const newErrors = errors.map(err => `${err.msg}`)
		return res.json({
			success: false,
			message: 'Something went wrong.',
			errors: newErrors,
		})
	}
	return User.findOne({ email: req.body.email }, (err, user) => {
		if (!user) {
			return res.json({
				success: false,
				message: 'User with this email doesn\'t exist.',
			})
		}
		if (user.isVerified) {
			return res.json({
				success: false,
				message: 'User with this email is already verified.',
			})
		}

		// Create a email verification token
		const token = Token({
			userId: user._id,
			token: crypto.randomBytes(16).toString('hex'),
		})

		// Save the verification token
		return token.save((err2) => {
			if (err2) {
				return res.json({
					success: false,
					message: 'Something went wrong, Try again.',
					error: err2,
				})
			}

			// Send the email
			const transporter = nodemailer.createTransport({
				host: 'smtp.gmail.com',
				port: 587,
				secure: false,
				auth: {
					user: config.email.id,
					pass: config.email.pass,
				},
			})
			const mailOptions = {
				from: 'no-reply@yourwebapplication.com',
				to: user.email,
				subject: 'Account Verification',
				text: `Hello,\n\n Please verify your account by clicking the link: \n http://${req.headers.host}/verification/${token.token}\n`,
			}

			// Send verification Link
			return transporter.sendMail(mailOptions, (trerr) => {
				if (trerr) { return res.json({ status: false, message: 'Couldn\'t send email verification', error: trerr.message }) }
				return res.json({ status: false, message: `A verification email has been sent to ${user.email}` })
			})
		})
	})
})


/*
 ***************************************
 * Ask For reset password
 * *************************************
*/
router.post('/ask-reset-password', (req, res) => {
	req.check('email', 'Email field is empty.').notEmpty()
	req.check('email', 'Invalid email.').isEmail()
	const errors = req.validationErrors()
	if (errors) {
		const messages = []
		errors.forEach((error) => {
			messages.push(error.msg)
		})
		const newErrors = errors.map(err => `${err.msg}`)
		return res.json({
			success: false,
			message: 'Something went wrong.',
			errors: newErrors,
		})
	}

	return User.findOne({ email: req.body.email }, (e, user) => {
		if (!user) {
			return res.json({
				success: false,
				message: 'User with this email doesn\'t exist.',
			})
		}

		// Create a password reset token
		const token = ResetToken({
			userId: user._id,
			token: crypto.randomBytes(16).toString('hex'),
		})

		// Save the verification token
		return token.save((err2) => {
			if (err2) {
				return res.json({
					success: false,
					message: 'Something went wrong, Try again.',
					error: err2,
				})
			}

			// Send the email
			const transporter = nodemailer.createTransport({
				host: 'smtp.gmail.com',
				port: 587,
				secure: false,
				auth: {
					user: config.email.id,
					pass: config.email.pass,
				},
			})
			const mailOptions = {
				from: 'no-reply@yourwebapplication.com',
				to: user.email,
				subject: 'Reset Password',
				text: `Hello,\n\n Please reset your password by clicking the link: \n http://${req.headers.host}/reset-password/${token.token}\n`,
			}

			// Send verification Link
			return transporter.sendMail(mailOptions, (trerr) => {
				if (trerr) { return res.json({ status: false, message: 'Couldn\'t send password reset email', error: trerr.message }) }
				return res.json({ status: false, message: `An email to reset password has been sent to ${user.email}` })
			})
		})
	})
})

/*
 ***************************************
 * Reset Password
 * *************************************
*/
router.post('/reset-password', (req, res) => {
	req.check('password', 'Password field is empty.').notEmpty()
	req.check('token', 'Token field is empty.').notEmpty()
	const errors = req.validationErrors()
	if (errors) {
		const messages = []
		errors.forEach((error) => {
			messages.push(error.msg)
		})
		const newErrors = errors.map(err => `${err.msg}`)
		return res.json({
			success: false,
			message: 'Something went wrong.',
			errors: newErrors,
		})
	}
	return ResetToken.findOne({ token: req.body.token }, (err, token) => {
		if (!token) {
			return res.json({
				success: false,
				message: 'Token is invalid or expired.',
			})
		}
		return User.findOne({ _id: token.userId }, (e, user) => {
			if (!user) {
				return res.json({
					success: false,
					message: 'User doesn\'t exists',
				})
			}
			const newUser = user
			newUser.password = req.body.password
			return newUser.save((err2) => {
				if (err2) {
					return res.json({
						success: false,
						message: 'Couldn\'t reset password',
						error: err2,
					})
				}
				return res.json({
					success: true,
					message: 'Password changed successfully.',
				})
			})
		})
	})
})

/*
 ***************************************
 * Authenticate User
 * *************************************
*/
router.post('/authenticate', (req, res) => {
	req.check('email', 'Email field is empty.').notEmpty()
	req.check('email', 'Invalid email.').isEmail()
	req.check('password', 'Password field is empty.').notEmpty()
	req.check('password', 'Password length is less than 6.').isLength({ min: 6 })

	const errors = req.validationErrors()
	if (errors) {
		const messages = []
		errors.forEach((error) => {
			messages.push(error.msg)
		})
		const newErrors = errors.map(err => `${err.msg}`)
		return res.json({
			success: false,
			message: 'Something went wrong.',
			errors: newErrors,
		})
	}
	return User.findOne({ email: req.body.email }, (err, user) => {
		if (err) {
			return res.json({
				success: false,
				message: 'Something went wrong, Try again.',
			})
		}
		if (!user) {
			return res.json({
				success: false,
				message: 'User with this email doesn\'t exist.',
			})
		}
		if (!user.isVerified) {
			return res.json({
				success: false,
				message: 'User is not verified. Check your email.',
			})
		}
		if (!user.comparePassword(req.body.password)) { return res.json({ success: false, message: 'Incorrect Password.' }) }
		const tokenData = {
			_id: user._id,
			email: user.email,
			firstname: user.firstname,
			lastname: user.lastname,
			profilePhoto: user.profilePhoto,
		}
		const token = jwt.sign({ data: tokenData }, config.secret, {
			expiresIn: 1204800,
		})
		return res.json({ success: true, token: `JWT ${token}` })
	},
	)
})


/*
 ***************************************
 * get Users
 * *************************************
*/
router.get('/users', passport.authenticate('jwt', { session: false }), async (req, res) => {
	const { page, limit, order, sortBy, fields, ...filter } = req.query
	let pageNo = parseInt(page, 10)
	let limitNo = parseInt(limit, 10)
	let sort = { createdAt: -1 }
	let findFilter = {}
	let select = 'firstname lastname email createdAt updatedAt'

	// filter
	if (filter) {
		findFilter = filter
	}

	// sorting 
	if (sortBy) {
		const orderNo = order === -1 ? -1 : 1
		sort = { [sortBy]: orderNo }
	}

	// pagination
	if (!limitNo || !pageNo) {
		pageNo = 1
		limitNo = 999999
	}

	// field selection
	if (req.query.fields) {
		select = req.query.fields.split(',').join(' ')
	}
	const data = await User.paginate(findFilter, { page: pageNo, limit: limitNo, sort, select })
	if (!data) res.json({ success: false, message: data })
	res.json({ success: true, message: data })
})

/*
 ***************************************
 * get user by id
 * *************************************
*/
router.get('/users/:id', async (req, res) => {
	const select = 'email firstname lastname profilePhoto'
	const user = await User.findOne({ _id: req.params.id }, select)
	if (!user) res.json({ success: false, message: 'User id is invalid.' })
	res.json({ success: true, message: user })
})

/*
 ***************************************
 * update user
 * *************************************
*/
router.put('/users/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
	const user = await User.findOne({ _id: req.params.id })
	if (!user) res.json({ success: false, message: 'User id is invalid.' })
	const { password, oldPassword, ...rest } = req.body
	user.set({ ...rest })
	if (password && oldPassword) {
		if (user.comparePassword(oldPassword)) {
			user.password = password
		} else {
			return res.json({ success: false, message: 'Old Password doesn\'t match the exact one' })
		}
	}
	return user.save((err, updatedUser) => {
		if (err) res.json({ success: false, message: 'Something went wrong try again.' })
		res.json({ success: true, message: updatedUser })
	})
})

/*
 ***************************************
 * delete user
 * *************************************
*/
router.delete('/users/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
	const removeduser = await User.findByIdAndRemove(req.params.id)
	if (!removeduser) {
		res.json({ success: false, message: 'Unable to delete user.' })
	}
	res.json({ success: true, message: 'User removed successfully.' })
})

export default router