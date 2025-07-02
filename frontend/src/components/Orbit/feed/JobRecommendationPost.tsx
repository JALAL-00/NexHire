import PostCard from './PostCard';

type JobRecommendationPostProps = {
  post: {
    title: string;
    company: string;
    location: string;
    skills: string[];
  };
};

export const JobRecommendationPost = ({ post }: JobRecommendationPostProps) => {
  return (
    <PostCard>
        <p className="text-sm text-gray-500 mb-2">Recommended for you</p>
        <h3 className="font-bold text-lg">{post.title}</h3>
        <p>{post.company} - {post.location}</p>
        <div className="mt-3 flex gap-2">
            {post.skills.map(skill => <div key={skill} className="badge badge-outline">{skill}</div>)}
        </div>
        <div className="card-actions justify-end mt-4">
            <button className="btn btn-primary btn-sm">Apply Now</button>
            <button className="btn btn-ghost btn-sm">Save</button>
        </div>
    </PostCard>
  );
};