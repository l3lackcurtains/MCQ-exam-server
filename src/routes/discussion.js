import express from 'express'
import _ from 'lodash'

import Discussion from '../models/discussion'

const router = express.Router()

/*
 ***************************************
 * get studies
 * *************************************
*/
router.get('/discussion', async (req, res) => {
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
        const data = await Discussion.paginate(findFilter, { page: pageNo, limit: limitNo, sort, select })
        if (!data) res.json({ success: false, message: "Error fetching discussion." })
        res.json({ success: true, message: "Discussions successfully fetched.", data })
    } catch(e) {
        res.json({ success: false, message: "Something went wrong, Try again.", error: e })
    }
	
})

/*
 ***************************************
 * get discussion by id
 * *************************************
*/
router.get('/discussion/:id', async (req, res) => {
    // field selection
	let select = null
	if (!!req.query.fields) {
		select = req.query.fields.split(',').join(' ')
    }
    
    try {
        const data = await Discussion.findOne({ _id: req.params.id }, select)
        if (!data) res.json({ success: false, message: 'Discussion id is invalid.' })
        res.json({ success: true, message: "Discussion successfully fetched.", data })
    } catch(e) {
        res.json({ success: false, message: "Something went wrong, Try again.", error: e })
    }
	
})

/*
 ***************************************
 * get discussion by user id
 * *************************************
*/
router.get('/discussion/uid/:id', async (req, res) => {
    // field selection
	let select = null
	if (!!req.query.fields) {
		select = req.query.fields.split(',').join(' ')
    }
    
    try {
        const data = await Discussion.findOne({ uid: req.params.id }, select)
        if (!data) res.json({ success: false, message: 'Discussion id is invalid.' })
        res.json({ success: true, message: "Discussion successfully fetched.", data })
    } catch(e) {
        res.json({ success: false, message: "Something went wrong, Try again.", error: e })
    }
	
})


/*
 ***************************************
 * Post discussion
 * *************************************
*/
router.post('/discussion', async (req, res) => {
    try{
        const discussion = Discussion(req.body)
        const newDiscussion = await discussion.save()
        if(!newDiscussion) res.json({ success: false, message: 'Error posting discussion.' })
        res.json({ success: true, message: 'Discussion successfully Posted.', data: newDiscussion })
    } catch(e) {
        res.json({ success: false, message: 'Something went wrong, Try again.', error: e })
    }

})

/*
 ***************************************
 * Update discussion
 * *************************************
*/
router.put('/discussion/:id', async (req, res) => {
    try {
        const discussion = await Discussion.findOne({ _id: req.params.id })
        if (!discussion) res.json({ success: false, message: 'Discussion id is invalid.' })
        discussion.set({ ...req.body })
        const updateDiscussion = await discussion.save()
        if (!updateDiscussion) res.json({ success: false, message: 'Error updating discussion.' })
        res.json({ success: true, message: "Discussion updated successfully", data: updateDiscussion })
    } catch(e) {
        res.json({ success: false, message: 'Something went wrong, Try again.', error: e })
    }
	
})

/*
 ***************************************
 * Delete discussion
 * *************************************
*/
router.delete('/discussion/:id', async (req, res) => {
    try{
        const removedDiscussion = await Discussion.findByIdAndRemove(req.params.id);
        if (!removedDiscussion) res.json({ success: false, message: 'Error deleting discussion.' })
        res.json({ success: true, message: 'Discussion deleted successfully.' })
    } catch(e) {
        res.json({ success: false, message: "Something went wrong, Try again.", error: err })
    }
	
})

export default router