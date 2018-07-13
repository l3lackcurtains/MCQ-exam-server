import express from 'express';
import _ from 'lodash';

import Study from '../models/study';

const router = express.Router();

/*
 ***************************************
 * get studies
 * *************************************
*/
router.get('/study', async (req, res) => {
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
    const data = await Study.paginate(findFilter, { page: pageNo, limit: limitNo, sort, select });
    if (!data) res.json({ success: false, message: 'Error fetching study.' });
    res.json({ success: true, message: 'Studies successfully fetched.', data });
  } catch (e) {
    res.json({ success: false, message: 'Something went wrong, Try again.', error: e });
  }
});

/*
 ***************************************
 * get study by id
 * *************************************
*/
router.get('/study/:id', async (req, res) => {
  // field selection
  let select = null;
  if (req.query.fields) {
    select = req.query.fields.split(',').join(' ');
  }

  try {
    const data = await Study.findOne({ _id: req.params.id }, select);
    if (!data) res.json({ success: false, message: 'Study id is invalid.' });
    res.json({ success: true, message: 'Study successfully fetched.', data });
  } catch (e) {
    res.json({ success: false, message: 'Something went wrong, Try again.', error: e });
  }
});

/*
 ***************************************
 * Post study
 * *************************************
*/
router.post('/study', async (req, res) => {
  try {
    const study = Study(req.body);
    const newStudy = await study.save();
    if (!newStudy) res.json({ success: false, message: 'Error posting study.' });
    res.json({ success: true, message: 'Study successfully Posted.', data: newStudy });
  } catch (e) {
    res.json({ success: false, message: 'Something went wrong, Try again.', error: e });
  }
});

/*
 ***************************************
 * Update study
 * *************************************
*/
router.put('/study/:id', async (req, res) => {
  try {
    const study = await Study.findOne({ _id: req.params.id });
    if (!study) res.json({ success: false, message: 'Study id is invalid.' });
    study.set({ ...req.body });
    const updateStudy = await study.save();
    if (!updateStudy) res.json({ success: false, message: 'Error updating study.' });
    res.json({ success: true, message: 'Study updated successfully', data: updateStudy });
  } catch (e) {
    res.json({ success: false, message: 'Something went wrong, Try again.', error: e });
  }
});

/*
 ***************************************
 * Delete study
 * *************************************
*/
router.delete('/study/:id', async (req, res) => {
  try {
    const removedStudy = await Study.findByIdAndRemove(req.params.id);
    if (!removedStudy) res.json({ success: false, message: 'Error deleting study.' });
    res.json({ success: true, message: 'Study deleted successfully.' });
  } catch (e) {
    res.json({ success: false, message: 'Something went wrong, Try again.', error: e });
  }
});

/*
 ***************************************
 * Search study
 * *************************************
*/
router.post('/study-search', async (req, res) => {
  const query = req.body.question;
  Study.find({ question: new RegExp(`^${query}`, 'i') }, (err, data) => {
    if (err) res.json({ success: false, message: 'Something went wrong, Try again.', error: err });
    res.json({ success: true, message: data });
  });
});

export default router;
