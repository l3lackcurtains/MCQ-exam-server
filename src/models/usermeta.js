import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const { Schema } = mongoose;

const usermetaSchema = Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true
    },
    myMcqs: {
      type: [String]
    },
    myStudys: {
      type: [String]
    },
    correctMcqs: {
      type: [String]
    },
    incorrectMcqs: {
      type: [String]
    },
    mcqBookmarks: {
      type: [String]
    },
    studyBookmarks: {
      type: [String]
    }
  },
  { collection: 'usermeta', timestamps: true }
);

usermetaSchema.plugin(mongoosePaginate);

const Usermeta = mongoose.model('Usermeta', usermetaSchema);

export default Usermeta;
