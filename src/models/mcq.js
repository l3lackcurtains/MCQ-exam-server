import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'

const Schema = mongoose.Schema

const mcqSchema = Schema({
	question: {
        type: String,
        required: true,
    },
    rightAnswer: {
        type: String,
        required: true,
    },
    rightAnswerDesc: {
        type: String,
        required: true,
    },
    wrongAnswers: {
        type: [String],
        required: true
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
}, { collection: 'mcq', timestamps: true })

mcqSchema.plugin(mongoosePaginate)

const Mcq = mongoose.model('Mcq', mcqSchema)

export default Mcq