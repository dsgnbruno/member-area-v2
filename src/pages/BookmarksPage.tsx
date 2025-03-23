import React from 'react';
import { Bookmark } from 'lucide-react';
import CourseGrid from '../components/CourseGrid';
import { getBookmarkedCourses } from '../data/courses';

const BookmarksPage: React.FC = () => {
  const bookmarkedCourses = getBookmarkedCourses();
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-8">
        <Bookmark size={24} className="text-primary" />
        <h1 className="text-2xl font-bold">Bookmarked Courses</h1>
      </div>
      
      {bookmarkedCourses.length > 0 ? (
        <CourseGrid courses={bookmarkedCourses} />
      ) : (
        <div className="bg-base-100 rounded-box p-8 shadow-lg text-center">
          <Bookmark size={48} className="mx-auto mb-4 text-base-content/30" />
          <h2 className="text-xl font-bold mb-2">No Bookmarked Courses</h2>
          <p className="text-base-content/70 mb-6">
            You haven't bookmarked any courses yet. Browse courses and click the bookmark icon to save them for later.
          </p>
        </div>
      )}
    </div>
  );
};

export default BookmarksPage;
