const Course = require('../models/course');


exports.addCourse = async (req, res) => {
  try {
    const { title, description, duration } = req.body;

    if (!title || !description || !duration) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const newCourse = new Course({
      title,
      description,
      duration,
      image: req.file ? `uploads/${req.file.filename}` : null, 
    });

    await newCourse.save();
    res.status(201).json({
      message: 'Course added successfully!',
      course: {
        ...newCourse.toObject(),
        image: newCourse.image
          ? `http://localhost:3000/${newCourse.image}`
          : null, 
      },
    });
  } catch (error) {
    console.error('Error adding course:', error);
    res.status(500).json({ error: 'Server error while adding course.' });
  }
};


exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find();

    const updatedCourses = courses.map(course => ({
      ...course.toObject(),
      image: course.image
        ? `http://localhost:3000/${course.image}`
        : null, // Include absolute URL for image if available
    }));

    res.status(200).json(updatedCourses); // Return the updated courses
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Server error while fetching courses.' });
  }
};

// Get a course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    res.status(200).json({
      ...course.toObject(),
      image: course.image
        ? `http://localhost:3000/${course.image}`
        : null, // Return absolute URL for the image
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: 'Server error while fetching course.' });
  }
};

// Edit course (with image update)
exports.editCourse = async (req, res) => {
  try {
    const { title, description, duration } = req.body;

    const updateFields = {
      title,
      description,
      duration,
    };

    
    if (req.file) {
      updateFields.image = `uploads/${req.file.filename}`;
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    res.status(200).json({
      message: 'Course updated successfully!',
      course: {
        ...updatedCourse.toObject(),
        image: updatedCourse.image
          ? `http://localhost:3000/${updatedCourse.image}`
          : null, 
      },
    });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Server error while updating the course.' });
  }
};


exports.deleteCourse = async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);

    if (!deletedCourse) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    res.status(200).json({ message: 'Course deleted successfully!' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Server error while deleting the course.' });
  }
};

// Search courses
exports.searchCourses = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required.' });
    }

    // Search by title or description (case-insensitive)
    const courses = await Course.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ],
    });

    const updatedCourses = courses.map(course => ({
      ...course.toObject(),
      image: course.image
        ? `http://localhost:3000/${course.image}`
        : null,
    }));

    res.status(200).json(updatedCourses);
  } catch (error) {
    console.error('Error searching courses:', error);
    res.status(500).json({ error: 'Server error while searching courses.' });
  }
};