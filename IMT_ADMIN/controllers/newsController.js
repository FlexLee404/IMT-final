const News = require('../models/news');


exports.addNews = async (req, res) => {
  try {
    const { title, description, content } = req.body;

    if (!title || !description || !content) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const newNews = new News({
      title,
      description,
      content,
      date: new Date(),
      image: req.file ? `uploads/${req.file.filename}` : null, 
    });

    await newNews.save();
    res.status(201).json({
      message: 'News added successfully!',
      news: {
        ...newNews.toObject(),
        image: newNews.image
          ? `${req.protocol}://${req.get('host')}/${newNews.image}`
          : null, // Return absolute URL for the image
      },
    });
  } catch (error) {
    console.error('Error adding news:', error);
    res.status(500).json({ error: 'Server error while adding news.' });
  }
};

// Get all news (preview)
exports.getNews = async (req, res) => {
  try {
    const newsList = await News.find({}, 'title date image'); // Fetch only the required fields for preview

    const updatedNewsList = newsList.map(news => ({
      ...news.toObject(),
      image: news.image
        ? `${req.protocol}://${req.get('host')}/${news.image}`
        : null, // Include absolute URL for the image
    }));

    res.status(200).json(updatedNewsList);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Server error while fetching news.' });
  }
};

// Get news by ID
exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ error: 'News not found.' });
    }

    res.status(200).json({
      ...news.toObject(),
      image: news.image
        ? `${req.protocol}://${req.get('host')}/${news.image}`
        : null, // Return absolute URL for the image
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Server error while fetching news.' });
  }
};

// Edit news (with image update)
exports.editNews = async (req, res) => {
  try {
    const { title, description, content } = req.body;

    if (!title || !description || !content) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const updateFields = {
      title,
      description,
      content,
      date: new Date(), // Update the date to the current time
    };

    // Handle image update
    if (req.file) {
      updateFields.image = `uploads/${req.file.filename}`;
    }

    const updatedNews = await News.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedNews) {
      return res.status(404).json({ error: 'News not found.' });
    }

    res.status(200).json({
      message: 'News updated successfully!',
      news: {
        ...updatedNews.toObject(),
        image: updatedNews.image
          ? `${req.protocol}://${req.get('host')}/${updatedNews.image}`
          : null, // Return absolute URL for the image
      },
    });
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(500).json({ error: 'Server error while updating news.' });
  }
};

// Delete news
exports.deleteNews = async (req, res) => {
  try {
    const deletedNews = await News.findByIdAndDelete(req.params.id);

    if (!deletedNews) {
      return res.status(404).json({ error: 'News not found.' });
    }

    res.status(200).json({ message: 'News deleted successfully!' });
  } catch (error) {
    console.error('Error deleting news:', error);
    res.status(500).json({ error: 'Server error while deleting news.' });
  }
};

// Search news
exports.searchNews = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required.' });
    }

    
    const news = await News.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ],
    });

    const updatedNews = news.map(newsItem => ({
      ...newsItem.toObject(),
      image: newsItem.image
        ? `${req.protocol}://${req.get('host')}/${newsItem.image}`
        : null,
    }));

    res.status(200).json(updatedNews);
  } catch (error) {
    console.error('Error searching news:', error);
    res.status(500).json({ error: 'Server error while searching news.' });
  }
};
