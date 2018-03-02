import express from 'express'
import multer from 'multer'
import md5 from 'md5'
import path from 'path'

const router = express.Router()

/*
 ***************************************
 * Image Upload
 * *************************************
*/
const imageStorage = multer.diskStorage({
	destination(req, file, cb) {
		cb(null, './dist/public/media')
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

router.post('/upload-image', cpUpload, (req, res) => {
	const file = req.file
	if (file) return res.json({ success: true, message: 'Image successfully uploaded', file })
	return res.json({ status: false, message: 'Error uploading image.' })
})

export default router