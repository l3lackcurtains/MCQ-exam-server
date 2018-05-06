import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import AutoIncrement from 'mongoose-sequence';

const AutoInc = AutoIncrement(mongoose);
const { Schema } = mongoose;

const studySchema = Schema(
  {
    question: {
      type: String,
      required: true,
      text: true
    },
    answers: {
      type: [String]
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
  { collection: 'study', timestamps: true }
);

studySchema.plugin(mongoosePaginate);
studySchema.plugin(AutoInc, { inc_field: 'sid' });

const Study = mongoose.model('Study', studySchema);

export default Study;
