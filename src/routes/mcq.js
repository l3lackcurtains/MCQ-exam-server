import express from 'express'
import _ from 'lodash'

import Mcq from '../models/mcq'

const router = express.Router()

/*
 ***************************************
 * get studies
 * *************************************
*/
router.get('/mcq', async (req, res) => {
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
        const data = await Mcq.paginate(findFilter, { page: pageNo, limit: limitNo, sort, select })
        if (!data) res.json({ success: false, message: "Error fetching mcq." })
        res.json({ success: true, message: "Mcqs successfully fetched.", data })
    } catch(e) {
        res.json({ success: false, message: "Something went wrong, Try again.", error: e })
    }
	
})

/*
 ***************************************
 * get mcq by id
 * *************************************
*/
router.get('/mcq/:id', async (req, res) => {
    // field selection
	let select = null
	if (!!req.query.fields) {
		select = req.query.fields.split(',').join(' ')
    }
    
    try {
        const data = await Mcq.findOne({ _id: req.params.id }, select)
        if (!data) res.json({ success: false, message: 'Mcq id is invalid.' })
        res.json({ success: true, message: "Mcq successfully fetched.", data })
    } catch(e) {
        res.json({ success: false, message: "Something went wrong, Try again.", error: e })
    }
	
})


/*
 ***************************************
 * Post mcq
 * *************************************
*/
router.post('/mcq', async (req, res) => {
    try{
        const mcq = Mcq(req.body)
        const newMcq = await mcq.save()
        if(!newMcq) res.json({ success: false, message: 'Error posting mcq.' })
        res.json({ success: true, message: 'Mcq successfully Posted.', data: newMcq })
    } catch(e) {
        res.json({ success: false, message: 'Something went wrong, Try again.', error: e })
    }

})

/*
 ***************************************
 * Update mcq
 * *************************************
*/
router.put('/mcq/:id', async (req, res) => {
    try {
        const mcq = await Mcq.findOne({ _id: req.params.id })
        if (!mcq) res.json({ success: false, message: 'Mcq id is invalid.' })
        mcq.set({ ...req.body })
        const updateMcq = await mcq.save()
        if (!updateMcq) res.json({ success: false, message: 'Error updating mcq.' })
        res.json({ success: true, message: "Mcq updated successfully", data: updateMcq })
    } catch(e) {
        res.json({ success: false, message: 'Something went wrong, Try again.', error: e })
    }
	
})

/*
 ***************************************
 * Delete mcq
 * *************************************
*/
router.delete('/mcq/:id', async (req, res) => {
    try{
        const removedMcq = await Mcq.findByIdAndRemove(req.params.id);
        if (!removedMcq) res.json({ success: false, message: 'Error deleting mcq.' })
        res.json({ success: true, message: 'Mcq deleted successfully.' })
    } catch(e) {
        res.json({ success: false, message: "Something went wrong, Try again.", error: err })
    }
	
})

export default router