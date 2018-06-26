import express from 'express';
import _ from 'lodash';

import Usermeta from '../models/usermeta';

const router = express.Router();

/*
 ***************************************
 * get studies
 * *************************************
*/
router.get('/usermeta', async (req, res) => {
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
    const data = await Usermeta.paginate(findFilter, {
      page: pageNo,
      limit: limitNo,
      sort,
      select
    });
    if (!data) res.json({ success: false, message: 'Error fetching usermeta.' });
    res.json({ success: true, message: 'User metas successfully fetched.', data });
  } catch (e) {
    res.json({ success: false, message: 'Something went wrong, Try again.', error: e });
  }
});

/*
 ***************************************
 * get usermeta by user id
 * *************************************
*/
router.get('/usermeta/uid/:id', async (req, res) => {
  // field selection
  let select = null;
  if (req.query.fields) {
    select = req.query.fields.split(',').join(' ');
  }

  try {
    const data = await Usermeta.findOne({ uid: req.params.id }, select);
    if (!data) res.json({ success: false, message: 'Usermeta id is invalid.' });
    res.json({ success: true, message: 'Usermeta successfully fetched.', data });
  } catch (e) {
    res.json({ success: false, message: 'Something went wrong, Try again.', error: e });
  }
});

/*
 ***************************************
 * Post usermeta
 * *************************************
*/
router.post('/usermeta', async (req, res) => {
  try {
    const usermeta = Usermeta(req.body);
    const newUsermeta = await usermeta.save();
    if (!newUsermeta) res.json({ success: false, message: 'Error posting usermeta.' });
    res.json({ success: true, message: 'Usermeta successfully Posted.', data: newUsermeta });
  } catch (e) {
    res.json({ success: false, message: 'Something went wrong, Try again.', error: e });
  }
});

/*
 ***************************************
 * Update usermeta
 * *************************************
*/
router.put('/usermeta/:id', async (req, res) => {
  try {
    const usermeta = await Usermeta.findOne({ _id: req.params.id });
    if (!usermeta) res.json({ success: false, message: 'Usermeta id is invalid.' });
    usermeta.set({ ...req.body });
    const updateUsermeta = await usermeta.save();
    if (!updateUsermeta) res.json({ success: false, message: 'Error updating usermeta.' });
    res.json({ success: true, message: 'Usermeta updated successfully', data: updateUsermeta });
  } catch (e) {
    res.json({ success: false, message: 'Something went wrong, Try again.', error: e });
  }
});

/*
 ***************************************
 * Update usermeta
 * *************************************
*/
router.put('/usermeta/uid/:id', async (req, res) => {
  try {
    const usermeta = await Usermeta.findOne({ uid: req.params.id });
    if (!usermeta) res.json({ success: false, message: 'User id is invalid.' });
    usermeta.set({ ...req.body });
    const updateUsermeta = await usermeta.save();
    if (!updateUsermeta) res.json({ success: false, message: 'Error updating usermeta.' });
    res.json({ success: true, message: 'Usermeta updated successfully', data: updateUsermeta });
  } catch (e) {
    res.json({ success: false, message: 'Something went wrong, Try again.', error: e });
  }
});

/*
 ***************************************
 * Update usermeta by uid
 * *************************************
*/
router.put('/usermeta/uid/:id', async (req, res) => {
  try {
    const usermeta = await Usermeta.findOne({ uid: req.params.id });
    if (!usermeta) res.json({ success: false, message: 'Usermeta User id is invalid.' });
    usermeta.set({ ...req.body });
    const updateUsermeta = await usermeta.save();
    if (!updateUsermeta) res.json({ success: false, message: 'Error updating usermeta.' });
    res.json({ success: true, message: 'Usermeta updated successfully', data: updateUsermeta });
  } catch (e) {
    res.json({ success: false, message: 'Something went wrong, Try again.', error: e });
  }
});

/*
 ***************************************
 * Delete usermeta
 * *************************************
*/
router.delete('/usermeta/:id', async (req, res) => {
  try {
    const removedUsermeta = await Usermeta.findByIdAndRemove(req.params.id);
    if (!removedUsermeta) res.json({ success: false, message: 'Error deleting usermeta.' });
    res.json({ success: true, message: 'Usermeta deleted successfully.' });
  } catch (e) {
    res.json({ success: false, message: 'Something went wrong, Try again.', error: e });
  }
});

export default router;
