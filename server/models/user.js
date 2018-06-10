import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
import crypto from 'crypto';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  name: String,
  password: String,
  picture: String,
  isSeller: { type: Boolean, default: false },
  address: {
    addr1: String,
    addr2: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
  },
  created: { type: Date, default: Date.now }
});

UserSchema.pre('save', function(next) {
  const user = this;

  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.hash(user.password, null, null, (err, hash) => {
    if (err) {
      return next(err);
    }

    user.password = hash;
    next();
  });
});

UserSchema.methods.comparePasswords = function(enteredPassword) {
  return bcrypt.compareSync(enteredPassword, this.password);
};

UserSchema.methods.gravatar = function(size) {
  if (!this.size) {
    this.size = 200;
  }

  if (!this.email) {
    return `http://gravatar.com/avatar/?s=${size}&d=retro`;
  }

  const md5 = crypto.createHash('md5').update(this.email).digest('hex');

  return `http://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

export default mongoose.model('User', UserSchema);
