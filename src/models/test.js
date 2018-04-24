import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import Mcq from './mcq'
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
})

const testSchema = Schema({
	name: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
    },
    totalTime: {
        type: Number,
    },
    startTime: {
        type: Number,
    },
    testScores: [
        {
            _sid: String,
            timeTaken: Number,
            score: Number
        }
    ],
    questions: [mcqSchema]
}, { collection: 'test', timestamps: true })

testSchema.plugin(mongoosePaginate)

const Test = mongoose.model('Test', testSchema)

export default Test