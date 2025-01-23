const Gallery = require('../models/gallery');


const addImage = async (req, res) => {
  const { image, caption } = req.body;

  const galleryImage = new Gallery({ image, caption });
  await galleryImage.save();
  res.status(201).json({ message: "Gallery image added successfully" });
};


const getImages = async (req, res) => {
  const images = await Gallery.find();
  res.json(images);
};


const deleteImage = async (req, res) => {
  const { id } = req.params;

  await Gallery.findByIdAndDelete(id);
  res.status(200).json({ message: "Gallery image deleted successfully" });
};

module.exports = { addImage, getImages, deleteImage };
