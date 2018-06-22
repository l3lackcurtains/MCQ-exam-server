import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import User from '../models/user';
import Token from '../models/token';
import ResetToken from '../models/resetToken';
import config from '../utils/config';

const router = express.Router();

/*
 ***************************************
 * Register New User
 * *************************************
*/
router.post('/register', (req, res) => {
  req.check('deviceId', 'Device Id field is empty.').notEmpty();
  req.check('password', 'Password field is empty.').notEmpty();
  req.check('password', 'Password length is less than 6.').isLength({ min: 6 });
  const errors = req.validationErrors();
  if (errors) {
    const messages = [];
    errors.forEach(error => {
      messages.push(error.msg);
    });
    const newErrors = errors.map(err => `${err.msg}`);
    return res.json({
      success: false,
      message: 'Something went wrong.',
      errors: newErrors
    });
  }

  return User.findOne({ deviceId: req.body.deviceId }, (e, user) => {
    if (user) {
      return res.json({
        success: false,
        message: 'User with this deviceId already exist.'
      });
    }
    const newUser = User({
      deviceId: req.body.deviceId,
      password: req.body.password
    });
    return newUser.save(err => {
      if (err) {
        return res.json({
          success: false,
          message: 'Something went wrong, Try again.',
          error: err
        });
      }
      return res.json({
        success: true,
        message: `User successfully registered with email address ${newUser.deviceId}`
      });
    });
  });
});

/*
 ***************************************
 * Reset Password
 * *************************************
*/
router.post('/reset-password', (req, res) => {
  req.check('password', 'Password field is empty.').notEmpty();
  const errors = req.validationErrors();
  if (errors) {
    const messages = [];
    errors.forEach(error => {
      messages.push(error.msg);
    });
    const newErrors = errors.map(err => `${err.msg}`);
    return res.json({
      success: false,
      message: 'Something went wrong.',
      errors: newErrors
    });
  }
  return ResetToken.findOne({ token: req.body.token }, (err, token) => {
    if (!token) {
      return res.json({
        success: false,
        message: 'Token is invalid or expired.'
      });
    }
    return User.findOne({ _id: token.userId }, (e, user) => {
      if (!user) {
        return res.json({
          success: false,
          message: "User doesn't exists"
        });
      }
      const newUser = user;
      newUser.password = req.body.password;
      return newUser.save(err2 => {
        if (err2) {
          return res.json({
            success: false,
            message: "Couldn't reset password",
            error: err2
          });
        }
        return res.json({
          success: true,
          message: 'Password changed successfully.'
        });
      });
    });
  });
});

/*
 ***************************************
 * Authenticate User
 * *************************************
*/
router.post('/authenticate', (req, res) => {
  req.check('deviceId', 'Device Id field is empty.').notEmpty();
  req.check('password', 'Password field is empty.').notEmpty();
  req.check('password', 'Password length is less than 6.').isLength({ min: 6 });

  const errors = req.validationErrors();
  if (errors) {
    const messages = [];
    errors.forEach(error => {
      messages.push(error.msg);
    });
    const newErrors = errors.map(err => `${err.msg}`);
    return res.json({
      success: false,
      message: 'Something went wrong.',
      errors: newErrors
    });
  }
  return User.findOne({ deviceId: req.body.deviceId }, (err, user) => {
    if (err) {
      return res.json({
        success: false,
        message: 'Something went wrong, Try again.'
      });
    }
    if (!user) {
      return res.json({
        success: false,
        message: "User with this deviceId doesn't exist."
      });
    }

    if (!user.comparePassword(req.body.password)) {
      return res.json({ success: false, message: 'Incorrect Password.' });
    }
    const tokenData = {
      _id: user._id, // eslint-disable-line
      deviceId: user.deviceId
    };
    const token = jwt.sign({ data: tokenData }, config.secret, {
      expiresIn: 1204800
    });
    return res.json({ success: true, token: `JWT ${token}` });
  });
});

/*
 ***************************************
 * get Users
 * *************************************
*/
router.get('/users', async (req, res) => {
  const { page, limit, order, sortBy, fields, ...filter } = req.query;
  let pageNo = parseInt(page, 10);
  let limitNo = parseInt(limit, 10);
  let sort = { createdAt: -1 };
  let findFilter = {};
  let select = 'deviceId createdAt updatedAt';

  // filter
  if (filter) {
    findFilter = filter;
  }

  // sorting
  if (sortBy) {
    const orderNo = order === -1 ? -1 : 1;
    sort = { [sortBy]: orderNo };
  }

  // pagination
  if (!limitNo || !pageNo) {
    pageNo = 1;
    limitNo = 999999;
  }

  // field selection
  if (req.query.fields) {
    select = req.query.fields.split(',').join(' ');
  }
  const data = await User.paginate(findFilter, { page: pageNo, limit: limitNo, sort, select });
  if (!data) res.json({ success: false, message: data });
  res.json({ success: true, message: data });
});

/*
 ***************************************
 * get user by id
 * *************************************
*/
router.get('/users/:id', async (req, res) => {
  const select = 'email firstname lastname profilePhoto';
  const user = await User.findOne({ _id: req.params.id }, select);
  if (!user) res.json({ success: false, message: 'User id is invalid.' });
  res.json({ success: true, message: user });
});

/*
 ***************************************
 * update user
 * *************************************
*/
router.put('/users/:id', async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });
  if (!user) res.json({ success: false, message: 'User id is invalid.' });
  const { password, oldPassword, ...rest } = req.body;
  user.set({ ...rest });
  if (password && oldPassword) {
    if (user.comparePassword(oldPassword)) {
      user.password = password;
    } else {
      return res.json({ success: false, message: "Old Password doesn't match the exact one" });
    }
  }
  return user.save((err, updatedUser) => {
    if (err) res.json({ success: false, message: 'Something went wrong try again.' });
    res.json({ success: true, message: updatedUser });
  });
});

/*
 ***************************************
 * delete user
 * *************************************
*/
router.delete('/users/:id', async (req, res) => {
  const removeduser = await User.findByIdAndRemove(req.params.id);
  if (!removeduser) {
    res.json({ success: false, message: 'Unable to delete user.' });
  }
  res.json({ success: true, message: 'User removed successfully.' });
});

export default router;
