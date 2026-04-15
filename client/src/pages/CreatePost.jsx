import React from 'react';
import ImageUpload from '../components/ImageUpload';

const CreatePost = () => {

  const handleUpload = (formData) => {
    // In Lesson 4.7, you'll send this formData to the backend
    // For now, just log it to confirm it works
    console.log('FormData ready:', formData.get('image'));
  };

  return (
    <div>
      <h1>Create Post</h1>
      <ImageUpload onUpload={handleUpload} />
      {/* rest of your form */}
    </div>
  );
};

export default CreatePost;
