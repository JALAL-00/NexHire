// src/components/dashboard/feed/PostCard.tsx
import { ReactNode } from 'react';

interface PostCardProps {
  children: ReactNode;
}

const PostCard = ({ children }: PostCardProps) => {
  return (
    <div className="card w-full bg-base-100 shadow-md border border-gray-200 rounded-lg mb-4">
      <div className="card-body p-4">
        {children}
      </div>
    </div>
  );
};

export default PostCard;