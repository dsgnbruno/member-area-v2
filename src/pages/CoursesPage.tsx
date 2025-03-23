import React, { useState, useEffect } from 'react';
import { getAvailableCourses } from '../data/courses';
import CourseGrid from '../components/CourseGrid';
import { Search, Filter } from 'lucide-react';

const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState(getAvailableCourses());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Extract unique categories from courses
  const categories = ['all', ...new Set(courses.map(course => course.category))];
  
  // Filter courses based on search term and category
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  useEffect(() => {
    // Update available courses based on user status
    setCourses(getAvailableCourses());
  }, []);
  
  return (
    <div className="container mx-auto">
      <div className="flex flex-col gap-6">
        <div className="bg-base-100 rounded-box p-6 shadow-lg">
          <h1 className="text-2xl font-bold mb-4">My Courses</h1>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-base-content/50" />
              </div>
              <input
                type="text"
                placeholder="Search courses..."
                className="input input-bordered w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 items-center">
              <Filter size={18} className="text-base-content/70" />
              <select 
                className="select select-bordered"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Course Grid */}
        {filteredCourses.length > 0 ? (
          <CourseGrid courses={filteredCourses} />
        ) : (
          <div className="bg-base-100 rounded-box p-12 shadow-lg text-center">
            <h2 className="text-xl font-semibold mb-2">No courses found</h2>
            <p className="text-base-content/70 mb-4">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
