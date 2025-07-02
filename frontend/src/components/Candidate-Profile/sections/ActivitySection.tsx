'use client';
import { useState, useEffect } from 'react';
import { getPostsByUser, deletePost } from '@/lib/api/posts';
import CreatePostModal from '@/components/posts/CreatePostModal';
import CreatePostInput, { PostType } from '@/components/posts/CreatePostInput';
import { MoreVertical, Edit, Trash2, ThumbsUp, MessageSquare, Repeat, Send } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// --- CHANGE 1: ActivityPost now accepts `isOwner` ---
const ActivityPost = ({ post, userName, profilePic, onEdit, onDelete, isOwner }: {
  post: any; 
  userName: string; 
  profilePic: string; 
  onEdit: (post: any) => void; 
  onDelete: (postId: number) => void;
  isOwner: boolean; // This prop controls the edit/delete menu
}) => {
  return (
    <div className="bg-white rounded-lg border shadow-sm mb-4 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="avatar"><div className="w-12 rounded-full"><img src={profilePic} alt="User" onError={(e) => { e.currentTarget.src = '/default-avatar.png'; }} /></div></div>
            <div>
              <p className="font-semibold text-gray-800">{userName}</p>
              <p className="text-sm text-gray-500">Junior Frontend Developer.</p>
            </div>
          </div>
          {/* --- CHANGE 2: Conditionally render the dropdown menu --- */}
          {isOwner && (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-sm btn-circle"><MoreVertical /></label>
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32 z-10">
                <li><a onClick={() => onEdit(post)}><Edit size={14}/> Edit</a></li>
                <li><a onClick={() => onDelete(post.id)} className="text-error"><Trash2 size={14}/> Delete</a></li>
              </ul>
            </div>
          )}
        </div>
        <p className="text-gray-800 my-4 whitespace-pre-line">{post.content}</p>
      </div>
      {post.mediaUrl && (
        <figure className="bg-gray-200 relative w-full max-w-[500px] mx-auto">
          <img
            src={`${API_URL}/uploads/${post.mediaUrl}`}
            alt="Post media"
            className="w-full h-full object-contain"
          />
        </figure>
      )}
      <div className="p-4 border-t">
        <div className="flex justify-around">
          <button className="btn btn-ghost text-gray-600 gap-2"><ThumbsUp size={18}/> Like</button>
          <button className="btn btn-ghost text-gray-600 gap-2"><MessageSquare size={18}/> Comment</button>
          <button className="btn btn-ghost text-gray-600 gap-2"><Repeat size={18}/> Repost</button>
          <button className="btn btn-ghost text-gray-600 gap-2"><Send size={18}/> Send</button>
        </div>
      </div>
    </div>
  );
};

// --- CHANGE 3: The main section component accepts `isOwner` ---
export default function ActivitySection({ profilePic, userName, userId, isOwner }: { 
  profilePic: string, 
  userName: string, 
  userId: number,
  isOwner: boolean 
}) {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState<any | null>(null);
  const [modalPostType, setModalPostType] = useState<PostType>('post');

  useEffect(() => {
    if (!userId) return;
    const fetchUserPosts = async () => {
      try {
        setIsLoading(true);
        const userPosts = await getPostsByUser(userId);
        setPosts(userPosts);
      } catch (error) {
        console.error("Failed to fetch user's activity", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserPosts();
  }, [userId]);

  const handlePostCreatedOrUpdated = (post: any) => {
    // A more robust way to update or add posts
    const existingPostIndex = posts.findIndex(p => p.id === post.id);
    if (existingPostIndex > -1) {
      const newPosts = [...posts];
      newPosts[existingPostIndex] = post;
      setPosts(newPosts);
    } else {
      setPosts(prevPosts => [post, ...prevPosts]);
    }
  };
  
  const handleOpenEditModal = (post: any) => {
    setPostToEdit(post);
    setModalPostType('post');
    setIsModalOpen(true);
  };

  const handleOpenCreateModal = (type: PostType) => {
    setPostToEdit(null);
    setModalPostType(type);
    setIsModalOpen(true);
  };
  
  const handleDeletePost = async (postId: number) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(postId);
        setPosts(posts.filter(p => p.id !== postId));
      } catch (error) {
        console.error("Failed to delete post", error);
        alert("Could not delete the post. Please try again.");
      }
    }
  };

  return (
    <div>
      {/* --- CHANGE 4: Conditionally render the 'Create Post' input --- */}
      {isOwner && (
        <CreatePostInput profilePic={profilePic} onOpenModal={handleOpenCreateModal} />
      )}

      {isLoading ? (
        <div className="text-center py-8"><span className="loading loading-spinner"></span></div>
      ) : posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <ActivityPost 
              key={post.id} 
              post={post} 
              userName={userName} 
              profilePic={profilePic}
              onEdit={handleOpenEditModal}
              onDelete={handleDeletePost}
              isOwner={isOwner} // Pass the prop down to each post
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8 bg-white rounded-lg border">
          <p>No activity to show yet.</p>
          {isOwner && <p className='text-sm mt-1'>Click above to share your first post!</p>}
        </div>
      )}

      {isModalOpen && (
        <CreatePostModal 
          onClose={() => setIsModalOpen(false)}
          onPostCreatedOrUpdated={handlePostCreatedOrUpdated}
          postToEdit={postToEdit}
          initialPostType={modalPostType}
        />
      )}
    </div>
  );
}