import { Request, Response } from 'express';
import User from '../models/User';
import logger from '../logger';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userName, password, ...otherFields } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      userName,
      password: hashedPassword,
      ...otherFields
    });
    res.status(201).json({
      ...user.toObject(),
      password: undefined  // Don't send the hashed password back to the client
    });
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'An error occurred' });
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select('+password');
    console.log('All users:', users);
    res.status(200).json(users.map(user => ({
      ...user.toObject(),
      password: user.password.substring(0, 10) + '...' // Only show part of the hash for security
    })));
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userName, password } = req.body;
    logger.info(`Login attempt for user: ${userName}`);
    logger.debug(`Password received: ${password}`);

    const user = await User.findOne({ userName }).select('+password');
    if (!user) {
      logger.warn(`User ${userName} not found`);
      res.status(401).json({ message: 'Invalid username or password' });
      return;
    }

    logger.debug(`User found. Stored password hash: ${user.password}`);

    if (typeof user.comparePassword !== 'function') {
      logger.error('comparePassword is not a function');
      res.status(500).json({ message: 'Server error' });
      return;
    }

    let isMatch: boolean;
    try {
      isMatch = await user.comparePassword(password);
    } catch (error) {
      logger.error('Error in comparePassword:', error);
      res.status(500).json({ message: 'Server error' });
      return;
    }

    logger.info(`Password match result: ${isMatch}`);

    if (!isMatch) {
      res.status(401).json({ message: 'Invalid username or password' });
      return;
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
    res.status(200).json({ token });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
  }
};


export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'An error occurred' });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
  }
};

export const resetUserPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userName, newPassword } = req.body;
    logger.info(`Attempting to reset password for user: ${userName}`);

    const user = await User.findOne({ userName });
    if (!user) {
      logger.warn(`User ${userName} not found for password reset`);
      res.status(404).json({ message: 'User not found' });
      return;
    }

    user.password = newPassword;
    await user.save();

    logger.info(`Password successfully reset for user: ${userName}`);
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    logger.error('Password reset error:', error);
    res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
  }
};

