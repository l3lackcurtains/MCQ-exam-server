import express from 'express';
import _ from 'lodash';

import Feedback from '../models/feedback';

const router = express.Router();

/*
 ***************************************
 * get feedbacks
 * *************************************
*/
router.get('/feedback', async (req, res) => {
  const { page, limit, order, sortBy, fields, ...filter } = req.query;
  let pageNo = parseInt(page, 10);
  let limitNo = parseInt(limit, 10);
  let sort = { createdAt: -1 };
  let select = null;
  let findFilter = {};

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
  if (fields) {
    select = fields.split(',').join(' ');
  }

  // adjust the filter options
  _.forIn(findFilter, (value, key) => {
    if (value === 'false') {
      findFilter = _.omit(findFilter, [key]);
    }
  });

  try {
    const data = await Feedback.paginate(findFilter, {
      page: pageNo,
      limit: limitNo,
      sort,
      select
    });
    if (!data) res.json({ success: false, message: 'Error fetching feedback.' });
    res.json({ success: true, message: 'Feedbacks successfully fetched.', data });
  } catch (e) {
    res.json({ success: false, message: 'Something went wrong, Try again.', error: e });
  }
});

/*
 ***************************************
 * get feedback by id
 * *************************************
*/
router.get('/feedback/:id', async (req, res) => {
  // field selection
  let select = null;
  if (req.query.fields) {
    select = req.query.fields.split(',').join(' ');
  }

  try {
    const data = await Feedback.findOne({ _id: req.params.id }, select);
    if (!data) res.json({ success: false, message: 'Feedback id is invalid.' });
    res.json({ success: true, message: 'Feedback successfully fetched.', data });
  } catch (e) {
    res.json({ success: false, message: 'Something went wrong, Try again.', error: e });
  }
});

/*
 ***************************************
 * get feedback by user id
 * *************************************
*/
router.get('/feedback/uid/:id', async (req, res) => {
  // field selection
  let select = null;
  if (req.query.fields) {
    select = req.query.fields.split(',').join(' ');
  }

  try {
    const data = await Feedback.findOne({ uid: req.params.id }, select);
    if (!data) res.json({ success: false, message: 'Feedback id is invalid.' });
    res.json({ success: true, message: 'Feedback successfully fetched.', data });
  } catch (e) {
    res.json({ success: false, message: 'Something went wrong, Try again.', error: e });
  }
});

/*
 ***************************************
 * Post feedback
 * *************************************
*/
router.post('/feedback', async (req, res) => {
  try {
    const feedback = Feedback(req.body);
    const newFeedback = await feedback.save();
    if (!newFeedback) res.json({ success: false, message: 'Error posting feedback.' });
    res.json({ success: true, message: 'Feedback successfully Posted.', data: newFeedback });
  } catch (e) {
    res.json({ success: false, message: 'Something went wrong, Try again.', error: e });
  }
});

/*
 ***************************************
 * Update feedback
 * *************************************
*/
router.put('/feedback/:id', async (req, res) => {
  try {
    const feedback = await Feedback.findOne({ _id: req.params.id });
    if (!feedback) res.json({ success: false, message: 'Feedback id is invalid.' });
    feedback.set({ ...req.body });
    const updateFeedback = await feedback.save();
    if (!updateFeedback) res.json({ success: false, message: 'Error updating feedback.' });
    res.json({ success: true, message: 'Feedback updated successfully', data: updateFeedback });
  } catch (e) {
    res.json({ success: false, message: 'Something went wrong, Try again.', error: e });
  }
});

/*
 ***************************************
 * Delete feedback
 * *************************************
*/
router.delete('/feedback/:id', async (req, res) => {
  try {
    const removedFeedback = await Feedback.findByIdAndRemove(req.params.id);
    if (!removedFeedback) res.json({ success: false, message: 'Error deleting feedback.' });
    res.json({ success: true, message: 'Feedback deleted successfully.' });
  } catch (e) {
    res.json({ success: false, message: 'Something went wrong, Try again.', error: e });
  }
});

export default router;
