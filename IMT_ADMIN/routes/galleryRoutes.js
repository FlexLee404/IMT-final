const express = require('express');
const { addImage, getImages, deleteImage } = require('../controllers/galleryController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware')
const router = express.Router();


router.post('/', [verifyToken, isAdmin], addImage);


router.get('/', getImages);

router.delete('/:id', [verifyToken, isAdmin], deleteImage);

module.exports = router;
