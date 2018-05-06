import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
import mongoosePaginate from 'mongoose-paginate';

const { Schema } = mongoose;

const userSchema = Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    isVerified: {
      type: Boolean,
      default: false
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
    }
  },
  { collection: 'user', timestamps: true }
);

/* eslint-disable */
// Before User is created, hash the password
userSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('password')) return next();
  bcrypt.hash(user.password, null, null, (err, hash) => {
    if (err) return next(err);
    user.password = hash;
    next();
  });
});

// Compare password method used during login
userSchema.methods.comparePassword = function(pass) {
  let user = this;
  return bcrypt.compareSync(pass, user.password);
};

userSchema.plugin(mongoosePaginate);

const User = mongoose.model('User', userSchema);

export default User;
