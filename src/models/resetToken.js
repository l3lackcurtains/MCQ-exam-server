import mongoose from 'mongoose'

const Schema = mongoose.Schema

const resetTokenSchema = Schema({
	userId: {
		type: String,
		required: true,
	},
	token: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now,
		expires: 43200,
	},
})

const ResetToken = mongoose.model('ResetToken', resetTokenSchema)

export default ResetToken