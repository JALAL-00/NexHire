// src/components/dashboard/feed/PostActions.tsx
import { ThumbsUp, MessageCircle, Repeat, Send } from 'lucide-react';

const PostActions = () => {
  return (
    <div className="mt-4 pt-2 border-t">
      <div className="flex justify-around text-gray-500">
        <button className="btn btn-ghost btn-sm flex-1">
          <ThumbsUp size={20} /> Like
        </button>
        <button className="btn btn-ghost btn-sm flex-1">
          <MessageCircle size={20} /> Comment
        </button>
        <button className="btn btn-ghost btn-sm flex-1">
          <Repeat size={20} /> Repost
        </button>
        <button className="btn btn-ghost btn-sm flex-1">
          <Send size={20} /> Send
        </button>
      </div>
    </div>
  );
}

export default PostActions;