import PostCard from './PostCard';
import PostActions from './PostActions';

interface ArticlePostProps {
  post: {
    author: {
      avatarUrl: string;
      name: string;
      headline: string;
    };
    content: string;
    imageUrl?: string;
    tags: string[];
    likes: number;
    commentsCount: number;
  };
}

export const ArticlePost: React.FC<ArticlePostProps> = ({ post }) => {
  return (
    <PostCard>
      <div className="flex items-center mb-3">
        <div className="avatar">
          <div className="w-12 rounded-full">
            <img src={post.author.avatarUrl} alt={post.author.name} />
          </div>
        </div>
        <div className="ml-3">
          <p className="font-bold">{post.author.name}</p>
          <p className="text-xs text-gray-500">{post.author.headline}</p>
        </div>
      </div>
      <p className="mb-3">{post.content}</p>
      {post.imageUrl && <img src={post.imageUrl} alt="Article image" className="rounded-lg w-full object-cover max-h-80" />}
      <div className="mt-2 text-sm text-blue-600">
        {post.tags.join(' ')}
      </div>
      <div className="text-xs text-gray-500 mt-2 flex justify-between">
        <span>{post.likes} likes</span>
        <span>{post.commentsCount} comments</span>
      </div>
      <PostActions />
    </PostCard>
  );
};