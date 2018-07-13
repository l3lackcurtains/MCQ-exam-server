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
    email: {
      type: String
    },
    firstname: {
      type: String
    },
    lastname: {
      type: String
    },
    profilePhoto: {
      type: String,
      default: '/images/avatar.png'
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
    },
    totalPoint: {
      type: Number,
      default: 0
    },
    weeklyPoint: {
      type: Number,
      default: 0
    },
    isPremium: {
      type: Boolean,
      default: false
    }
  },
  { collection: 'usermeta', timestamps: true }
);

usermetaSchema.plugin(mongoosePaginate);

const Usermeta = mongoose.model('Usermeta', usermetaSchema);

export default Usermeta;
