import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'

const Schema = mongoose.Schema

const studySchema = Schema({
	question: {
        type: String,
        required: true,
    },
    answers: {
        type: [String],
    },
    imageUrl: {
        type: String,
    },
    category: {
        type: String,
        required: true,
    },
    subCategory: {
        type: String,
        required: true,
    }
}, { collection: 'study', timestamps: true })

studySchema.plugin(mongoosePaginate)

const Study = mongoose.model('Study', studySchema)

export default Study