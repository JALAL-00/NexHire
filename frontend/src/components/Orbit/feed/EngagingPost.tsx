'use client';

// Import the new components
import PostCard from './PostCard';
import PostActions from './PostActions';

interface PostAuthor {
  name: string;
  headline: string;
  avatarUrl: string;
}

interface PostData {
  id: number;
  author: PostAuthor;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: any[];
}

interface EngagingPostProps {
  post: PostData;
}

export const EngagingPost = ({ post }: EngagingPostProps) => {

  // This is the common content that will go inside the card body.
  const postContent = (
    <>
      {/* Post Header */}
      <div className="flex items-center gap-3">
        <div className="avatar">
          <div className="w-12 rounded-full">
            <img 
              src={post.author.avatarUrl} 
              alt={`${post.author.name}'s avatar`}
              onError={(e) => { e.currentTarget.src = '/default-avatar.png'; }}
            />
          </div>
        </div>
        <div>
          <p className="font-semibold text-gray-800">{post.author.name}</p>
          <p className="text-sm text-gray-500">{post.author.headline}</p>
        </div>
      </div>

      {/* Post Text */}
      <p className="text-gray-800 py-4 whitespace-pre-line">{post.content}</p>

      {/* Likes Count & Actions */}
      <div className="flex items-center text-xs text-gray-500">
          <span>{post.likes} likes</span>
      </div>
      <PostActions />
    </>
  );

  // --- THIS IS THE FIX ---
  // If the post has an image, we build the card manually to control the layout.
  if (post.imageUrl) {
    return (
      <div className="card w-full bg-base-100 shadow-md border border-gray-200 rounded-lg overflow-hidden mb-4">
        <div className="card-body p-4">
          {/* We only render the header and text content here */}
          <div className="flex items-center gap-3">
              <div className="avatar">
                  <div className="w-12 rounded-full"><img src={post.author.avatarUrl} alt={`${post.author.name}'s avatar`} onError={(e) => { e.currentTarget.src = '/default-avatar.png'; }}/></div>
              </div>
              <div>
                  <p className="font-semibold text-gray-800">{post.author.name}</p>
                  <p className="text-sm text-gray-500">{post.author.headline}</p>
              </div>
          </div>
          <p className="text-gray-800 py-4 whitespace-pre-line">{post.content}</p>
        </div>
        
        {/* The image is a direct child of the card, not the card-body */}
        <figure className="bg-gray-100">
          <img
            src={post.imageUrl}
            alt="Post content"
            className="w-full aspect-square object-cover"
          />
        </figure>

        {/* The actions are in their own padded section at the bottom */}
        <div className="p-4">
            <div className="flex items-center text-xs text-gray-500">
                <span>{post.likes} likes</span>
            </div>
            <PostActions />
        </div>
      </div>
    );
  }

  // If the post has NO image, we can use the simple PostCard component directly.
  return (
    <PostCard>
      {postContent}
    </PostCard>
  );
};