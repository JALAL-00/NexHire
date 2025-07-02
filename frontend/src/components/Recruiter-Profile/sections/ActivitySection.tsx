'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getPostsByUser, deletePost } from '@/lib/api/posts';
import CreatePostModal from '@/components/posts/CreatePostModal';
import CreatePostInput, { PostType } from '@/components/posts/CreatePostInput';
import { MoreVertical, Edit, Trash2, ThumbsUp, MessageSquare, Repeat, Send } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// --- FIX 1: Add `isOwner` to the props definition of ActivityPost ---
const ActivityPost = ({ post, userName, profilePic, onEdit, onDelete, isOwner }: {
  post: any;
  userName: string;
  profilePic: string;
  onEdit: (post: any) => void;
  onDelete: (postId: number) => void;
  isOwner: boolean;
}) => {
  return (
    <div className="bg-white rounded-lg border shadow-sm mb-4">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="w-12 h-12 rounded-full relative overflow-hidden">
                <Image src={profilePic} alt="User" layout="fill" objectFit="cover" />
              </div>
            </div>
            <div>
              <p className="font-semibold text-gray-800">{userName}</p>
              <p className="text-sm text-gray-500">Recruiter</p>
            </div>
          </div>
          {/* --- FIX 2: Conditionally render the dropdown menu --- */}
          {isOwner && (
            <div className="dropdown dropdown-end z-10">
              <label tabIndex={0} className="btn btn-ghost btn-sm btn-circle"><MoreVertical /></label>
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32">
                <li><a onClick={() => onEdit(post)}><Edit size={14}/> Edit</a></li>
                <li><a onClick={() => onDelete(post.id)} className="text-error"><Trash2 size={14}/> Delete</a></li>
              </ul>
            </div>
          )}
        </div>
        <p className="text-gray-800 my-4 whitespace-pre-line">{post.content}</p>
      </div>
      {post.mediaUrl && (
        <figure className="bg-gray-200 w-full">
          <img
            src={`${API_URL}/uploads/${post.mediaUrl}`}
            alt="Post media"
            className="w-full h-auto max-h-[500px] object-contain"
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

// --- FIX 3: Add `isOwner` to the main component's props definition ---
export default function ActivitySection({ userId, isOwner }: { userId: number, isOwner: boolean }) {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState<any | null>(null);
  const [profileInfo, setProfileInfo] = useState({ name: '', pic: '/default-avatar.png' });
  const [modalPostType, setModalPostType] = useState<PostType>('post');

  useEffect(() => {
    if (!userId) return;
    const fetchUserPostsAndInfo = async () => {
      try {
        setIsLoading(true);
        const userPosts = await getPostsByUser(userId);
        setPosts(userPosts);
        if (userPosts.length > 0 && userPosts[0].author) {
            const author = userPosts[0].author;
            const recruiterProfile = author.recruiterProfile;
            setProfileInfo({
                name: `${author.firstName || ''} ${author.lastName || ''}`.trim(),
                pic: recruiterProfile?.profilePicture ? `${API_URL}/uploads/${recruiterProfile.profilePicture}` : '/default-avatar.png'
            });
        }
      } catch (error) {
        console.error("Failed to fetch user's activity", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserPostsAndInfo();
  }, [userId]);

  const handlePostCreatedOrUpdated = (post: any) => {
    const postIndex = posts.findIndex(p => p.id === post.id);
    if (postIndex > -1) {
      const updatedPosts = [...posts];
      updatedPosts[postIndex] = post;
      setPosts(updatedPosts);
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
      {/* --- FIX 4: Conditionally render the 'Create Post' input box --- */}
      {isOwner && (
        <CreatePostInput profilePic={profileInfo.pic} onOpenModal={handleOpenCreateModal} />
      )}

      {isLoading ? (
        <div className="text-center py-8"><span className="loading loading-spinner"></span></div>
      ) : posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <ActivityPost 
              key={post.id} 
              post={post} 
              userName={profileInfo.name} 
              profilePic={profileInfo.pic}
              onEdit={handleOpenEditModal}
              onDelete={handleDeletePost}
              isOwner={isOwner} // Pass the prop down
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8 bg-white rounded-lg border">
          <p>This recruiter hasn't posted any activity yet.</p>
          {isOwner && <p className="text-sm mt-1">Click above to share your first post!</p>}
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