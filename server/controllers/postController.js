import Post from '../models/Post.js';

// @desc    Create a new post
// @route   POST /api/posts
// @access  Protected
export const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required',
      });
    }

    const post = await Post.create({
      title,
      content,
      author: req.user._id, // set by protect middleware
    });

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get paginated posts for the logged-in user
// @route   GET /api/posts?page=1&limit=6
// @access  Protected
export const getPosts = async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(20, parseInt(req.query.limit) || 6);
    const skip  = (page - 1) * limit;

    // Only return posts belonging to the authenticated user
    const filter = { author: req.user._id };

    const [posts, totalPosts] = await Promise.all([
      Post.find(filter)
        .sort({ createdAt: -1 })   // newest first
        .skip(skip)
        .limit(limit)
        .lean(),
      Post.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalPosts / limit);

    res.status(200).json({
      success: true,
      posts,
      pagination: {
        totalPosts,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
