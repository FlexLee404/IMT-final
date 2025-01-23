const express = require('express');
const multer = require('multer');
const courseController = require('../controllers/courseController');

const router = express.Router();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); 
  }
});

const upload = multer({ storage: storage });


router.post('/add', upload.single('image'), courseController.addCourse);  
router.get('/', courseController.getCourses);  
router.get('/:id', courseController.getCourseById);  
router.put('/edit/:id', upload.single('image'), courseController.editCourse);  
router.delete('/:id', courseController.deleteCourse); 
router.get('/search', courseController.searchCourses);


module.exports = router;
