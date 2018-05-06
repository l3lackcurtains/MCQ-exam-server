import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import AutoIncrement from 'mongoose-sequence';

const AutoInc = AutoIncrement(mongoose);

const { Schema } = mongoose;

const mcqSchema = Schema(
  {
    question: {
      type: String,
      required: true
    },
    rightAnswer: {
      type: String,
      required: true
    },
    rightAnswerDesc: {
      type: String,
      required: true
    },
    wrongAnswers: {
      type: [String],
      required: true
    },
    imageUrl: {
      type: String
    },
    category: {
      type: String,
      required: true
    },
    subCategory: {
      type: String,
      required: true
    }
  },
  { collection: 'mcq', timestamps: true }
);

mcqSchema.plugin(mongoosePaginate);
mcqSchema.plugin(AutoInc, { inc_field: 'mid' });

const Mcq = mongoose.model('Mcq', mcqSchema);

export default Mcq;
