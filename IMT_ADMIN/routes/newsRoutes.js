const multer = require('multer');
const express = require('express');
const router = express.Router();
const { addNews, getNews, getNewsById, editNews, deleteNews } = require('../controllers/newsController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

module.exports = upload;

router.post('/add', upload.single('image'), addNews);
router.get('/', getNews);
router.get('/:id', getNewsById);
router.put('/:id', upload.single('image'), editNews);
router.delete('/:id', deleteNews);

module.exports = router;
