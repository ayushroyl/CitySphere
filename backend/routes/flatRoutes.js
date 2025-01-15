const express = require('express');
const fs = require('fs');
const path = require('path'); // Useful for resolving file paths
const { uploadFlatPhotos } = require('../middleware/upload');
const { adminMiddleware } = require('../middleware/authMiddleware');  // Import middlewares
const Flat = require('../models/Flat'); // Assuming this is your Flat model
const router = express.Router();

//add flat
router.post('/add', adminMiddleware, (req, res, next) => {
    uploadFlatPhotos(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  }, async (req, res) => {
    try {
      const { flatName, description, price } = req.body;
      const photos = req.files.map((file) => `/uploads/flats/${file.filename}`); // Map file paths
  
      if (!flatName || !description || !price || photos.length === 0) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      const newFlat = new Flat({ flatName, description, price, photos });
      await newFlat.save();
  
      res.status(201).json({
        message: 'Flat added successfully',
        flat: newFlat,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to add flat', details: error.message });
    }
  });

// Update a flat
router.put(
    '/update/:id', adminMiddleware,
    (req, res, next) => uploadFlatPhotos(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        next();
    }),
    async (req, res) => {
        try {
            const { id } = req.params;
            const { flatName, description, price } = req.body;
            const photos = req.files.map((file) => file.path); // New photos uploaded

            const flat = await Flat.findById(id);
            if (!flat) return res.status(404).json({ error: 'Flat not found' });

            // Update fields
            flat.flatName = flatName || flat.flatName;
            flat.description = description || flat.description;
            flat.price = price || flat.price;
            if (photos.length > 0) flat.photos = [...flat.photos, ...photos]; // Append new photos to existing

            await flat.save();

            res.status(200).json({ message: 'Flat updated successfully', flat });
        } catch (error) {
            res.status(500).json({ error: 'Failed to update flat', details: error.message });
        }
    }
);

router.delete('/delete/:id', adminMiddleware, async (req, res) => {
  try {
      const { id } = req.params;

      // Find the flat by ID
      const flat = await Flat.findById(id);
      if (!flat) return res.status(404).json({ error: 'Flat not found' });

      // Delete associated photos from the filesystem
      const photos = flat.photos;
      for (const photoPath of photos) {
          // Use the correct absolute path
          const absolutePath = path.join(__dirname, '../uploads/flats', path.basename(photoPath));
          try {
              if (fs.existsSync(absolutePath)) {
                  fs.unlinkSync(absolutePath); // Delete file
              } else {
                  console.warn(`File not found: ${absolutePath}`);
              }
          } catch (fileError) {
              console.error(`Error deleting file ${absolutePath}:`, fileError.message);
              // Log and continue to avoid breaking the deletion process
          }
      }

      // Delete the flat document from the database
      await flat.deleteOne();

      res.status(200).json({ message: 'Flat deleted successfully' });
  } catch (error) {
      res.status(500).json({ error: 'Failed to delete flat', details: error.message });
  }
});

// Fetch all flats
router.get('/', async (req, res) => {
    try {
        const flats = await Flat.find();
        res.status(200).json(flats);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch flats', details: error.message });
    }
});

module.exports = router;
