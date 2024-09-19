import React, { useState, useEffect } from 'react';
import { Camera, Video, Send, MessageCircle, Share2, MoreVertical, Trash2, Edit } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const routes={
  createPost:`${process.env.REACT_APP_BACKEND_URL}/api/forum/posts`,
  getPosts:`${process.env.REACT_APP_BACKEND_URL}/api/forum/posts`,
  getPost:`${process.env.REACT_APP_BACKEND_URL}/api/forum/posts/:id`,
  updatePost:`${process.env.REACT_APP_BACKEND_URL}/api/forum/posts/:id`,
  deletePost:`${process.env.REACT_APP_BACKEND_URL}/api/forum/posts/:id`,
  createComment:`${process.env.REACT_APP_BACKEND_URL}/api/forum/comments`,
  getComments:`${process.env.REACT_APP_BACKEND_URL}/api/forum/comments`,
  updateComment:`${process.env.REACT_APP_BACKEND_URL}/api/forum/comments/:id`,
  deleteComment:`${process.env.REACT_APP_BACKEND_URL}/api/forum/comments/:id`,
}

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const {user}=useAuth()

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(routes.getPosts, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('content', newPost);
      
      if (image) {
        formData.append('media', image);
        formData.append('mediaType', 'image');
      } else if (video) {
        formData.append('media', video);
        formData.append('mediaType', 'video');
      }

      await axios.post(routes.createPost, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setNewPost('');
      setImage(null);
      setVideo(null);
      setSelectedMedia(null);
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(routes.deletePost.replace(':id', postId), {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleMediaSelect = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedMedia({ type, src: reader.result });
      };
      reader.readAsDataURL(file);
      if (type === 'image') {
        setImage(file);
        setVideo(null);
      } else {
        setVideo(file);
        setImage(null);
      }
    }
  };

  const handleCommentSubmit = async (postId) => {
    try {
      const response = await axios.post(routes.createComment, {
        content: newComment,
        postId: postId
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setNewComment('');
      fetchPosts();
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Farmer's Forum</h1>
      
      {/* New Post Form */}
      <div className="bg-white shadow rounded-lg mb-6 p-4">
        <form onSubmit={handlePostSubmit}>
          <textarea
            className="w-full p-2 mb-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
            rows="3"
            placeholder="What's on your mind, farmer?"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          ></textarea>
          {selectedMedia && (
            <div className="mb-4">
              {selectedMedia.type === 'image' ? (
                <img src={selectedMedia.src} alt="Selected" className="max-w-full h-auto rounded-lg" />
              ) : (
                <video src={selectedMedia.src} controls className="max-w-full h-auto rounded-lg"></video>
              )}
            </div>
          )}
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleMediaSelect(e, 'image')}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="p-2 text-gray-500 hover:text-gray-700 cursor-pointer">
                <Camera size={20} />
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleMediaSelect(e, 'video')}
                className="hidden"
                id="video-upload"
              />
              <label htmlFor="video-upload" className="p-2 text-gray-500 hover:text-gray-700 cursor-pointer">
                <Video size={20} />
              </label>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center"
            >
              <Send size={16} className="mr-2" />
              Post
            </button>
          </div>
        </form>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <img src={post.user.image || '/api/placeholder/40/40'} alt={post.user.name} className="w-10 h-10 rounded-full mr-3" />
                  <div>
                    <h3 className="font-semibold">{post.user.name}</h3>
                    <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                {user && user.id === post.user.id && (
                  <div className="flex space-x-2">
                    <button onClick={() => handleDelete(post.id)} className="text-gray-500 hover:text-red-500">
                      <Trash2 size={20} />
                    </button>
                    <button className="text-gray-500 hover:text-blue-500">
                      <Edit size={20} />
                    </button>
                  </div>
                )}
              </div>
              <p className="mb-4">{post.content}</p>
              {post.image && (
                <img src={`${process.env.REACT_APP_BACKEND_URL}/uploads/${post.image}`} alt="Post content" className="w-full rounded-lg mb-4" />
              )}
              {post.video && (
                <video src={`${process.env.REACT_APP_BACKEND_URL}/uploads/${post.video}`} controls className="w-full rounded-lg mb-4"></video>
              )}
              <div className="flex items-center justify-between text-gray-500">
                <button className="flex items-center hover:text-green-500">
                  <MessageCircle size={16} className="mr-1" />
                  {post.comments ? post.comments.length : 0}
                </button>
                <button className="flex items-center hover:text-yellow-500">
                  <Share2 size={16} className="mr-1" />
                  Share
                </button>
              </div>
              
              {/* Comments Section */}
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Comments</h4>
                {post.comments && post.comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-100 p-2 rounded mb-2">
                    <p className="text-sm">{comment.content}</p>
                    <p className="text-xs text-gray-500">{comment.user.name} - {new Date(comment.createdAt).toLocaleString()}</p>
                  </div>
                ))}
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleCommentSubmit(post.id);
                  setNewComment('');
                }} className="mt-2">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                  <button type="submit" className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                    Comment
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forum;