import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import logger from '../logger';

interface IUser extends Document {
  userName: string;
  password: string;
  rank: number;
  lastTenPercent: number;
  allTimeAccuracy: number;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    userName: {
      type: String,
      required: [true, "Please enter user name"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter password"],
    },
    rank: {
      type: Number,
      required: true,
      default: 0,
    },
    lastTenPercent: {
      type: Number,
      required: true,
      default: 0,
    },
    allTimeAccuracy: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    logger.error('Error hashing password:', error);
    next(error as Error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  logger.debug('Comparing passwords:');
  logger.debug(`Stored hash: ${this.password}`);
  logger.debug(`Candidate password: ${candidatePassword}`);
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    logger.info(`Password match: ${isMatch}`);
    return isMatch;
  } catch (error) {
    logger.error('Error comparing passwords:', error);
    throw error;
  }
};

export default mongoose.model<IUser>('User', userSchema);