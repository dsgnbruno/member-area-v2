import React, { useState } from 'react';
import { Lock, Play, Bookmark } from 'lucide-react';
import { Course } from '../types';
import { Link } from 'react-router-dom';
import { toggleBookmark } from '../data/courses';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const { id, title, description, thumbnail, status, progress } = course;
  const [isBookmarked, setIsBookmarked] = useState(course.bookmarked || false);
  const [isHovered, setIsHovered] = useState(false);
  
  const isLocked = status === 'locked';
  
  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(id);
    setIsBookmarked(!isBookmarked);
  };
  
  return (
    <div 
      className={`card w-full bg-base-100 shadow-xl overflow-hidden h-full ${isLocked ? 'grayscale opacity-80' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <figure className="relative h-48">
        <img 
          src={thumbnail} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        {isLocked && (
          <div className="absolute top-2 right-2 bg-base-100 p-2 rounded-full shadow-md">
            <Lock size={20} className="text-error" />
          </div>
        )}
        
        {/* Bookmark button - visible on hover */}
        {!isLocked && isHovered && (
          <button 
            className={`absolute top-2 right-2 btn btn-sm ${isBookmarked ? 'btn-primary' : 'btn-ghost bg-base-100/80'} btn-circle`}
            onClick={handleBookmarkToggle}
          >
            <Bookmark size={16} className={isBookmarked ? 'fill-current' : ''} />
          </button>
        )}
        
        {/* Always show bookmark indicator if bookmarked */}
        {!isLocked && isBookmarked && !isHovered && (
          <div className="absolute top-2 right-2 bg-primary p-2 rounded-full shadow-md">
            <Bookmark size={16} className="fill-current text-primary-content" />
          </div>
        )}
      </figure>
      
      <div className="card-body">
        <Link to={`/course/${id}`} className="card-title hover:text-primary transition-colors">{title}</Link>
        <p className="text-sm text-base-content/70">{description}</p>
        
        {!isLocked && progress !== undefined && (
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <progress 
              className="progress progress-primary w-full" 
              value={progress} 
              max="100"
            ></progress>
          </div>
        )}
        
        <div className="card-actions justify-end mt-4">
          {isLocked ? (
            <button className="btn btn-outline btn-sm">
              Enable this Course
            </button>
          ) : (
            <Link to={`/course/${id}`} className="btn btn-primary btn-sm">
              {progress && progress > 0 ? 'Continue' : 'Start Learning'}
              <Play size={16} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
