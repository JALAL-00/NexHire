'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Guide } from '@/lib/dummy-data';
import { Video, BookOpen } from 'lucide-react';

export const GuideCard = ({ guide }: { guide: Guide }) => {
  return (
    <div className="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      {/* The parent of the Image component MUST be relative for layout="fill" */}
      <figure className="relative h-56">
        <Image
          src={guide.imageUrl}
          alt={`Thumbnail for ${guide.title}`}
          layout="fill"
          objectFit="cover"
          // Add a placeholder to show a loading state
          placeholder="blur"
          blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
        />
        <div className="absolute top-3 right-3 badge badge-primary font-semibold">
          {guide.type === 'Video' ? <Video size={14} className="mr-1" /> : <BookOpen size={14} className="mr-1" />}
          {guide.type}
        </div>
      </figure>
      <div className="card-body">
        <div className="badge badge-secondary badge-outline">{guide.category}</div>
        <h2 className="card-title mt-2 text-lg font-bold leading-tight">
          <a href={guide.externalUrl} target="_blank" rel="noopener noreferrer" className="link-hover">
            {guide.title}
          </a>
        </h2>
        <p className="text-gray-600 text-sm mt-1 flex-grow">{guide.summary}</p>
        <div className="card-actions justify-between items-center mt-4 pt-4 border-t">
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="w-10 rounded-full">
                {/* Check the Image component for the avatar too */}
                <Image src={guide.author.avatarUrl} alt={guide.author.name} width={40} height={40} />
              </div>
            </div>
            <div>
              <p className="font-semibold text-sm">{guide.author.name}</p>
              <p className="text-xs text-gray-500">{guide.publishedDate}</p>
            </div>
          </div>
          <Link
            href={guide.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm"
          >
            {guide.type === 'Video' ? 'Watch Now' : 'Read Article'}
          </Link>
        </div>
      </div>
    </div>
  );
};