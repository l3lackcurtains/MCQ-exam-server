import mongoose from 'mongoose'
import bcrypt from 'bcrypt-nodejs'
import mongoosePaginate from 'mongoose-paginate'

const Schema = mongoose.Schema

const discussionSchema = Schema({
    uid: {
        type: String,
        required: true,
    },
    type: {
        type: Boolean,
    },
    question: {
        type: String,
    },
    answers: [
        {
            option: String,
            vote: Number,
            votedBy: [String],
        }
    ],
    favoritedBy: [String]
}, { collection: 'discussion', timestamps: true })

discussionSchema.plugin(mongoosePaginate)

const Discussion = mongoose.model('Discussion', discussionSchema)

export default Discussion