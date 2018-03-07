import express from 'express'
import _ from 'lodash'
import fetch from 'node-fetch'
import multer from 'multer'
import md5 from 'md5'
import path from 'path'

import Study from '../models/study'

const router = express.Router()

/*
 ***************************************
 * Post study
 * *************************************
*/
router.post('/study', async (req, res) => {
    const query = req.body.question
    Study.find({question: new RegExp(query, 'i')}, (err, data) => {
        if(err) res.send(err)
        res.render('result.hbs', { studies: data })
    })   
})

router.get('/study', async (req, res) => {
    Study.find({}, (err, data) => {
        if(err) res.send(err)
        res.render('result.hbs', { studies: data })
    })   
})

router.get('/study/:id', async (req, res) => {
    const id = req.params.id
    Study.findById(id, (err, data) => {
        if(err) res.send(err)
        res.render('singleResult.hbs',data)
    })   
})

/*
 ***************************************
 * Image Upload
 * *************************************
*/
const imageStorage = multer.diskStorage({
	destination(req, file, cb) {
		cb(null, path.resolve(__dirname + '/../public/media'))
	},
	filename(req, file, cb) {
		let filename = md5(`${file.originalname}`) + path.extname(file.originalname)
		if (req.query.name) {
			filename = req.query.name + path.extname(file.originalname)
		}
		cb(null, filename)
	},
})

const imageUpload = multer({
	fileFilter: (req, file, cb) => {
		const ext = path.extname(file.originalname)
		if (ext !== '.png' && ext !== '.jpg' && ext !== '.JPG' && ext !== '.gif' && ext !== '.jpeg') {
			req.fileValidationError = 'goes wrong on the mimetype';
			return cb(null, false, new Error('goes wrong on the mimetype'))
		}
		cb(null, true);
	},
	storage: imageStorage,
})

const cpUpload = imageUpload.single('image')

router.post('/upload-image', cpUpload, async (req, res) => {
    const studyID = req.query.id
    const file = req.file
	if (file) {
        const study = await Study.findOne({ _id: studyID })
        if (!study) return res.json({ success: false, message: 'Study id is invalid.' })
        study.set({ imageUrl: `/media/${file.filename}` })
        const updateStudy = study.save()
        console.log(updateStudy)
        if (!updateStudy) return res.json({ success: false, message: 'Something went wrong try again.' })
        return res.redirect('/')
    }
	return res.json({ status: false, message: 'Error uploading image.' })
})

router.get('/upload-image', (req, res) => {
    return res.redirect('/')
})

export default router