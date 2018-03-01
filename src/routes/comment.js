import express from 'express'
import _ from 'lodash'

import Comment from '../models/comment'

const router = express.Router()

/*
 ***************************************
 * get studies
 * *************************************
*/
router.get('/comment', async (req, res) => {
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
        const data = await Comment.paginate(findFilter, { page: pageNo, limit: limitNo, sort, select })
        if (!data) res.json({ success: false, message: "Error fetching comment." })
        res.json({ success: true, message: "Comments successfully fetched.", data })
    } catch(e) {
        res.json({ success: false, message: "Something went wrong, Try again.", error: e })
    }
	
})

/*
 ***************************************
 * get comment by id
 * *************************************
*/
router.get('/comment/:id', async (req, res) => {
    // field selection
	let select = null
	if (!!req.query.fields) {
		select = req.query.fields.split(',').join(' ')
    }
    
    try {
        const data = await Comment.findOne({ _id: req.params.id }, select)
        if (!data) res.json({ success: false, message: 'Comment id is invalid.' })
        res.json({ success: true, message: "Comment successfully fetched.", data })
    } catch(e) {
        res.json({ success: false, message: "Something went wrong, Try again.", error: e })
    }
	
})

/*
 ***************************************
 * get comment by user id
 * *************************************
*/
router.get('/comment/uid/:id', async (req, res) => {
    // field selection
	let select = null
	if (!!req.query.fields) {
		select = req.query.fields.split(',').join(' ')
    }
    
    try {
        const data = await Comment.findOne({ uid: req.params.id }, select)
        if (!data) res.json({ success: false, message: 'Comment id is invalid.' })
        res.json({ success: true, message: "Comment successfully fetched.", data })
    } catch(e) {
        res.json({ success: false, message: "Something went wrong, Try again.", error: e })
    }
	
})


/*
 ***************************************
 * Post comment
 * *************************************
*/
router.post('/comment', async (req, res) => {
    try{
        const comment = Comment(req.body)
        const newComment = await comment.save()
        if(!newComment) res.json({ success: false, message: 'Error posting comment.' })
        res.json({ success: true, message: 'Comment successfully Posted.', data: newComment })
    } catch(e) {
        res.json({ success: false, message: 'Something went wrong, Try again.', error: e })
    }

})

/*
 ***************************************
 * Update comment
 * *************************************
*/
router.put('/comment/:id', async (req, res) => {
    try {
        const comment = await Comment.findOne({ _id: req.params.id })
        if (!comment) res.json({ success: false, message: 'Comment id is invalid.' })
        comment.set({ ...req.body })
        const updateComment = await comment.save()
        if (!updateComment) res.json({ success: false, message: 'Error updating comment.' })
        res.json({ success: true, message: "Comment updated successfully", data: updateComment })
    } catch(e) {
        res.json({ success: false, message: 'Something went wrong, Try again.', error: e })
    }
	
})

/*
 ***************************************
 * Delete comment
 * *************************************
*/
router.delete('/comment/:id', async (req, res) => {
    try{
        const removedComment = await Comment.findByIdAndRemove(req.params.id);
        if (!removedComment) res.json({ success: false, message: 'Error deleting comment.' })
        res.json({ success: true, message: 'Comment deleted successfully.' })
    } catch(e) {
        res.json({ success: false, message: "Something went wrong, Try again.", error: err })
    }
	
})

export default router