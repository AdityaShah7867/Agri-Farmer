import React, { useState } from 'react';
import { Camera, Video, Send, ThumbsUp, MessageCircle, Share2, MoreVertical } from 'lucide-react';

const mockPosts = [
  {
    id: 1,
    user: {
      name: 'Rajesh Patel',
      avatar: '/api/placeholder/40/40',
    },
    content: 'Looking for high-yield wheat seeds for the upcoming season. Any recommendations?',
    image: 'https://eos.com/wp-content/uploads/2020/09/1_1920%D1%85600-e1670509527732.jpg.webp',
    likes: 15,
    comments: 7,
    timestamp: '2 hours ago'
  },
  {
    id: 2,
    user: {
      name: 'Priya Singh',
      avatar: '/api/placeholder/40/40',
    },
    content: 'Surplus organic tomatoes available. Contact for bulk orders!',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    likes: 23,
    comments: 12,
    timestamp: '5 hours ago'
  },
  // Add more mock posts as needed
];

const Forum = () => {
  const [newPost, setNewPost] = useState('');

  const handlePostSubmit = (e) => {
    e.preventDefault();
    // Handle post submission logic here
    console.log('New post:', newPost);
    setNewPost('');
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
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <button type="button" className="p-2 text-gray-500 hover:text-gray-700">
                <Camera size={20} />
              </button>
              <button type="button" className="p-2 text-gray-500 hover:text-gray-700">
                <Video size={20} />
              </button>
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
        {mockPosts.map((post) => (
          <div key={post.id} className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <img src={post.user.avatar} alt={post.user.name} className="w-10 h-10 rounded-full mr-3" />
                  <div>
                    <h3 className="font-semibold">{post.user.name}</h3>
                    <p className="text-sm text-gray-500">{post.timestamp}</p>
                  </div>
                </div>
                <button className="text-gray-500 hover:text-gray-700">
                  <MoreVertical size={20} />
                </button>
              </div>
              <p className="mb-4">{post.content}</p>
              {post.image && (
                <img src={post.image} alt="Post content" className="w-full rounded-lg mb-4" />
              )}
              {post.video && (
                <video src={post.video} controls className="w-full rounded-lg mb-4"></video>
              )}
              <div className="flex items-center justify-between text-gray-500">
                <button className="flex items-center hover:text-blue-500">
                  <ThumbsUp size={16} className="mr-1" />
                  {post.likes}
                </button>
                <button className="flex items-center hover:text-green-500">
                  <MessageCircle size={16} className="mr-1" />
                  {post.comments}
                </button>
                <button className="flex items-center hover:text-yellow-500">
                  <Share2 size={16} className="mr-1" />
                  Share
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forum;