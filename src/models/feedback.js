import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const { Schema } = mongoose;

const feedbackSchema = Schema(
  {
    questionId: {
      type: String
    },
    topic: {
      type: String
    },
    feedback: {
      type: String
    }
  },
  { collection: 'feedback', timestamps: true }
);

feedbackSchema.plugin(mongoosePaginate);

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;
