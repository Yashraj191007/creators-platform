import Post from '../models/Post.js';

// @desc    Create a new post
// @route   POST /api/posts
// @access  Protected
export const createPost = (io) => async (req, res) => {
    try {
        const { title, content, coverImage, coverImagePublicId } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }

        const post = await Post.create({
            title,
            content,
            coverImage: coverImage || null,
            coverImagePublicId: coverImagePublicId || null,
            author: req.user._id,
        });

        // Populate author name so the client gets it immediately
        await post.populate('author', 'name email');

        // Emit real-time event to all connected clients
        if (io) {
            io.emit('post:created', post);
        }

        res.status(201).json(post);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all posts by the logged-in user
// @route   GET /api/posts
// @access  Protected
export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find({ author: req.user._id })
            .populate('author', 'name email')
            .sort({ createdAt: -1 }); // newest first

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get a single post by ID
// @route   GET /api/posts/:id
// @access  Protected
export const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'name email');

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Only the author can view their own post
        if (post.author._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorised to view this post' });
        }

        res.status(200).json(post);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid post ID' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Protected (author only)
export const updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Ownership check
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorised to edit this post' });
        }

        const { title, content, coverImage, coverImagePublicId } = req.body;

        if (title !== undefined) post.title = title;
        if (content !== undefined) post.content = content;
        if (coverImage !== undefined) post.coverImage = coverImage;
        if (coverImagePublicId !== undefined) post.coverImagePublicId = coverImagePublicId;

        const updated = await post.save();
        await updated.populate('author', 'name email');

        res.status(200).json(updated);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid post ID' });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Protected (author only)
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Ownership check
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorised to delete this post' });
        }

        // TODO: Delete the coverImage from Cloudinary using coverImagePublicId
        //       before removing the document to avoid orphaned uploads.

        await post.deleteOne();

        res.status(200).json({ message: 'Post deleted successfully', _id: post._id });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid post ID' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
