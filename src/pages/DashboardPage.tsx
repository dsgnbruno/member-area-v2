import React, { useState, useEffect } from 'react';
import { courses, getAvailableCourses } from '../data/courses';
import { Clock, Award, BookOpen, TrendingUp, Star, ChevronRight, Lock } from 'lucide-react';
import CourseCard from '../components/CourseCard';
import { Link } from 'react-router-dom';
import { hasLifetimeAccess } from '../services/authService';

const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inProgress' | 'recommended'>('recommended');
  const [availableCourses, setAvailableCourses] = useState(courses);
  
  // Get user status
  const userHasLifetimeAccess = hasLifetimeAccess();
  
  useEffect(() => {
    // Update available courses based on user status
    setAvailableCourses(getAvailableCourses());
  }, []);
  
  // Calculate user stats
  const totalCourses = availableCourses.length;
  const inProgressCourses = availableCourses.filter(course => course.progress > 0 && course.progress < 100);
  const completedCourses = availableCourses.filter(course => course.progress === 100);
  const recommendedCourses = availableCourses.filter(course => course.progress === 0 && course.status !== 'locked');
  
  // Calculate average progress
  const totalProgress = availableCourses.reduce((sum, course) => sum + course.progress, 0);
  const averageProgress = totalCourses > 0 ? totalProgress / totalCourses : 0;
  
  // Get the course with the highest progress that's not completed
  const currentCourse = inProgressCourses.sort((a, b) => b.progress - a.progress)[0];
  
  // Limit courses to show only 2 for each category
  const limitedInProgressCourses = inProgressCourses.slice(0, 2);
  const limitedRecommendedCourses = recommendedCourses.slice(0, 2);
  
  return (
    <div className="container mx-auto">
      <div className="flex flex-col gap-6">
        {/* Welcome Section */}
        <div className="bg-base-100 rounded-box p-6 shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">Welcome back, Student!</h1>
              <p className="text-base-content/70">
                Continue your learning journey. You've made progress on {inProgressCourses.length} courses.
              </p>
            </div>
            <div className="flex flex-wrap w-full md:w-auto gap-2 justify-start md:justify-end">
              <Link to="/settings" className="btn btn-outline flex-1 md:flex-none">Account Settings</Link>
              {!userHasLifetimeAccess && (
                <a href="#premium-courses" className="btn btn-primary flex-1 md:flex-none">Explore Premium</a>
              )}
            </div>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stat bg-base-100 rounded-box shadow">
            <div className="stat-figure text-primary">
              <BookOpen size={24} />
            </div>
            <div className="stat-title">Total Courses</div>
            <div className="stat-value">{totalCourses}</div>
            <div className="stat-desc">Your enrolled courses</div>
          </div>
          
          <div className="stat bg-base-100 rounded-box shadow">
            <div className="stat-figure text-secondary">
              <TrendingUp size={24} />
            </div>
            <div className="stat-title">In Progress</div>
            <div className="stat-value">{inProgressCourses.length}</div>
            <div className="stat-desc">Active learning</div>
          </div>
          
          <div className="stat bg-base-100 rounded-box shadow">
            <div className="stat-figure text-success">
              <Award size={24} />
            </div>
            <div className="stat-title">Completed</div>
            <div className="stat-value">{completedCourses.length}</div>
            <div className="stat-desc">Finished courses</div>
          </div>
          
          <div className="stat bg-base-100 rounded-box shadow">
            <div className="stat-figure text-info">
              <Clock size={24} />
            </div>
            <div className="stat-title">Avg. Progress</div>
            <div className="stat-value">{averageProgress.toFixed(0)}%</div>
            <div className="stat-desc">Across all courses</div>
          </div>
        </div>
        
        {/* Continue Learning Section */}
        {currentCourse && (
          <div className="bg-base-100 rounded-box p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Continue Learning</h2>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <img 
                src={currentCourse.thumbnail} 
                alt={currentCourse.title} 
                className="rounded-lg w-full md:w-64 h-40 object-cover"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{currentCourse.title}</h3>
                <p className="text-base-content/70 mb-2">{currentCourse.description}</p>
                <div className="flex items-center gap-2 mb-3">
                  <div className="badge badge-outline">{currentCourse.category}</div>
                  <div className="text-sm text-base-content/70">
                    <span className="font-medium">{currentCourse.instructor}</span> • {currentCourse.estimatedTime}
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{currentCourse.progress}% complete</span>
                    <span className="text-sm text-base-content/70">{currentCourse.progress}/100</span>
                  </div>
                  <progress 
                    className="progress progress-primary w-full" 
                    value={currentCourse.progress} 
                    max="100"
                  ></progress>
                </div>
                <div className="flex gap-2">
                  <Link to={`/course/${currentCourse.id}`} className="btn btn-primary">
                    Resume Course
                  </Link>
                  <button 
                    className="btn btn-outline"
                    onClick={() => {
                      // Toggle bookmark functionality would go here
                    }}
                  >
                    {currentCourse.bookmarked ? 'Bookmarked' : 'Bookmark'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Course Tabs */}
        <div className="bg-base-100 rounded-box p-6 shadow-lg">
          <div className="tabs tabs-boxed mb-4">
            <button 
              className={`tab ${activeTab === 'recommended' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('recommended')}
            >
              Recommended For You
            </button>
            <button 
              className={`tab ${activeTab === 'inProgress' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('inProgress')}
            >
              In Progress
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeTab === 'recommended' ? (
              <>
                {limitedRecommendedCourses.map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
                {!userHasLifetimeAccess && <PremiumCourseCard />}
              </>
            ) : (
              inProgressCourses.length > 0 ? (
                <>
                  {limitedInProgressCourses.map(course => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                  {!userHasLifetimeAccess && <PremiumCourseCard />}
                </>
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-lg">You don't have any courses in progress.</p>
                  <Link to="/" className="btn btn-primary mt-4">Browse Courses</Link>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Premium Course Card Component
const PremiumCourseCard: React.FC = () => {
  return (
    <div className="card w-full bg-gradient-to-br from-primary/20 to-secondary/20 shadow-xl overflow-hidden h-full relative">
      {/* Lifetime badge positioned at the top-right corner with better visibility */}
      <div className="absolute top-3 right-3 badge badge-success py-3 px-4 text-white font-medium">
        Lifetime
      </div>
      
      <div className="card-body flex flex-col justify-between pt-12">
        <div>
          <h3 className="card-title text-lg">Upgrade to Premium</h3>
          <div className="mt-4">
            <p className="mb-2">Unlock all premium courses and get:</p>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center gap-2">
                <div className="text-success">✓</div>
                <span>Unlimited access to 200+ courses</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="text-success">✓</div>
                <span>Downloadable resources</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="text-success">✓</div>
                <span>Certificate of completion</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-bold">$49</span>
            <span className="text-base-content/70 line-through">$99</span>
          </div>
          <a href="#premium-courses" className="btn btn-success w-full text-white hover:bg-success-focus">
            Upgrade Now <ChevronRight size={16} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
