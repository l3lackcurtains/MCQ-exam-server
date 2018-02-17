import mongoose from 'mongoose'

const Schema = mongoose.Schema

const tokenSchema = Schema({
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

const Token = mongoose.model('Token', tokenSchema)

export default Token