import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            minlength: [3, 'Title must be at least 3 characters'],
            maxlength: [150, 'Title must be 150 characters or fewer'],
        },
        content: {
            type: String,
            required: [true, 'Content is required'],
            trim: true,
            minlength: [10, 'Content must be at least 10 characters'],
        },
        // Cloudinary secure_url — null means no cover image (text-only post)
        coverImage: {
            type: String,
            default: null,
        },
        // Cloudinary public_id — used for future delete / replace operations
        // TODO: Implement Cloudinary delete when a user re-uploads or deletes a post
        //       to avoid orphaned uploads accumulating in the creator-platform folder.
        coverImagePublicId: {
            type: String,
            default: null,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true, // adds createdAt and updatedAt automatically
    }
);

const Post = mongoose.model('Post', postSchema);

export default Post;
