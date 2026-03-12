import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
    },
    excerpt: {
      type: String,
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Auto-generate excerpt from content before saving
postSchema.pre('save', function (next) {
  if (this.content && !this.excerpt) {
    this.excerpt = this.content.substring(0, 150).trim() + (this.content.length > 150 ? '…' : '');
  }
  next();
});

const Post = mongoose.model('Post', postSchema);
export default Post;
