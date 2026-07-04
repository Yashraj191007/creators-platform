import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

// Helper: Upload a Buffer to Cloudinary using upload_stream (supports async/await)
const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'creator-platform' },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        stream.end(buffer);
    });
};

// @route   POST /api/upload
// @desc    Upload an image to Cloudinary
// @access  Protected
router.post('/', protect, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const result = await uploadToCloudinary(req.file.buffer);

        res.status(200).json({
            success: true,
            url: result.secure_url,
            publicId: result.public_id,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Multer error handler — must have 4 parameters for Express to treat it as an error handler
router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ success: false, message: 'File too large. Maximum size is 5MB.' });
        }
        return res.status(400).json({ success: false, message: error.message });
    }
    if (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
    next();
});

export default router;
