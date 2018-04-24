import express from 'express'
import _ from 'lodash'

import Test from '../models/test'

const router = express.Router()

/*
 ***************************************
 * get studies
 * *************************************
*/
router.get('/test', async (req, res) => {
    const {
		page,
		limit,
		order,
		sortBy,
		fields,
		...filter
    } = req.query
	let pageNo = parseInt(page, 10)
	let limitNo = parseInt(limit, 10)
	let sort = { createdAt: -1 }
	let select = null
	let findFilter = {}

	// filter
	if (filter) {
		findFilter = filter
	}

	// sorting 
	if (sortBy) {
		const orderNo = order === -1 ? -1 : 1
		sort = { [sortBy]: orderNo }
	}

	// pagination
	if (!limitNo || !pageNo) {
		pageNo = 1
		limitNo = 999999
	}

	// field selection
	if (fields) {
		select = fields.split(',').join(' ')
	}

	// adjust the filter options
	_.forIn(findFilter, (value, key) => {
		if (value === 'false') {
			findFilter = _.omit(findFilter, [key])
		}
    })

    try {
        const data = await Test.paginate(findFilter, { page: pageNo, limit: limitNo, sort, select })
        if (!data) res.json({ success: false, message: "Error fetching test." })
        res.json({ success: true, message: "Tests successfully fetched.", data })
    } catch(e) {
        res.json({ success: false, message: "Something went wrong, Try again.", error: e })
    }
	
})

/*
 ***************************************
 * get test by id
 * *************************************
*/
router.get('/test/:id', async (req, res) => {
    // field selection
	let select = null
	if (!!req.query.fields) {
		select = req.query.fields.split(',').join(' ')
    }
    
    try {
        const data = await Test.findOne({ _id: req.params.id }, select)
        if (!data) res.json({ success: false, message: 'Test id is invalid.' })
        res.json({ success: true, message: "Test successfully fetched.", data })
    } catch(e) {
        res.json({ success: false, message: "Something went wrong, Try again.", error: e })
    }
	
})


/*
 ***************************************
 * Post test
 * *************************************
*/
router.post('/test', async (req, res) => {
    try{
        const test = Test(req.body)
        const newTest = await test.save()
        if(!newTest) res.json({ success: false, message: 'Error posting test.' })
        res.json({ success: true, message: 'Test successfully Posted.', data: newTest })
    } catch(e) {
        res.json({ success: false, message: 'Something went wrong, Try again.', error: e })
    }

})

/*
 ***************************************
 * Update test
 * *************************************
*/
router.put('/test/:id', async (req, res) => {
    try {
        const test = await Test.findOne({ _id: req.params.id })
        if (!test) res.json({ success: false, message: 'Test id is invalid.' })
        test.set({ ...req.body })
        const updateTest = await test.save()
        if (!updateTest) res.json({ success: false, message: 'Error updating test.' })
        res.json({ success: true, message: "Test updated successfully", data: updateTest })
    } catch(e) {
        res.json({ success: false, message: 'Something went wrong, Try again.', error: e })
    }
	
})

/*
 ***************************************
 * Delete test
 * *************************************
*/
router.delete('/test/:id', async (req, res) => {
    try{
        const removedTest = await Test.findByIdAndRemove(req.params.id);
        if (!removedTest) res.json({ success: false, message: 'Error deleting test.' })
        res.json({ success: true, message: 'Test deleted successfully.' })
    } catch(e) {
        res.json({ success: false, message: "Something went wrong, Try again.", error: err })
    }
	
})

export default router