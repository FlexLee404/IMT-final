document.addEventListener('DOMContentLoaded', () => {
  const API_BASE_URL = 'http://localhost:3000/api/courses';
  const coursesList = document.getElementById('coursesList');
  const courseForm = document.getElementById('courseForm');
  const courseTitle = document.getElementById('courseTitle');
  const courseDescription = document.getElementById('courseDescription');
  const courseDuration = document.getElementById('courseDuration');
  const imageInput = document.getElementById('imageInput');
  const imagePreview = document.getElementById('imagePreview');
  const logoutButton = document.getElementById('logoutButton');
  const formTitle = document.getElementById('formTitle');

  let editCourseId = null;
  console.log(document.getElementById('courseForm')); 
  
  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json(); 
      console.log('API Response:', data);
  
      if (Array.isArray(data)) {
        coursesList.innerHTML = ''; 
  
        data.forEach(course => {
          const listItem = document.createElement('li');
          listItem.innerHTML = `
            <strong>${course.title}</strong> - ${course.description} (${course.duration} hours)
            <div>
              ${course.image ? `<img src="${course.image}" alt="${course.title}" width="100" height="100" />` : ''}
              <button onclick="editCourse('${course._id}', '${course.title}', '${course.description}', '${course.duration}', '${course.image || ''}')">Edit</button>
              <button onclick="deleteCourse('${course._id}')">Delete</button>
            </div>
          `;
          coursesList.appendChild(listItem);
        });
        alert("cousres added successfully")
      } else {
        console.error('Expected an array of courses, but got:', data);
        alert('No courses available.');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      alert('Failed to fetch courses. Please ensure the backend is running and accessible.');
    }
  };
  
 
  courseForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', courseTitle.value);
    formData.append('description', courseDescription.value);
    formData.append('duration', courseDuration.value);

    if (imageInput && imageInput.files[0]) {
      formData.append('image', imageInput.files[0]);
    }

    const url = editCourseId ? `${API_BASE_URL}/edit/${editCourseId}` : `${API_BASE_URL}/add`;
    const method = editCourseId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, { method, body: formData });
      const data = await response.json();
    
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit course.');
      }
    
      alert(editCourseId ? 'Course updated successfully!' : 'Course added successfully!');
      formTitle.textContent = 'Add Course';
      editCourseId = null;
      courseForm.reset();
      imagePreview.innerHTML = '';
      fetchCourses(); 
    } catch (error) {
      console.error('Error submitting course:', error);
      alert('course submitted successfully.');
    }

  });

  /**
   * Delete a course by ID.
   */
  window.deleteCourse = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete course.');

      alert('Course deleted successfully!');
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course. Please try again.');
    }
  };

 
  window.editCourse = (id, title, description, duration, image) => {
    editCourseId = id;
    courseTitle.value = title;
    courseDescription.value = description;
    courseDuration.value = duration;
    imagePreview.innerHTML = image ? `<img src="${image}" alt="${title}" width="100" height="100" />` : '';
    formTitle.textContent = 'Edit Course';
  };

  
  if (imageInput) {
    imageInput.addEventListener('change', () => {
      const file = imageInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          imagePreview.innerHTML = `<img src="${reader.result}" alt="Selected Image" width="100" height="100" />`;
        };
        reader.readAsDataURL(file);
      }
    });
  }

 
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      alert('Logged out successfully!');
      window.location.href = 'login.html'; 
    });
  }

  
  fetchCourses();
});
