import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, User, BookOpen, FileText, BarChart2, CheckCircle, Play, Download, Bookmark, Link as LinkIcon } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Course, CourseModule } from '../types';
import { getCourseById, toggleBookmark } from '../data/courses';

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [activeTab, setActiveTab] = useState<'syllabus' | 'resources' | 'progress'>('syllabus');
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  
  // Get course data
  const course = getCourseById(courseId || '');
  
  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
          <Link to="/" className="btn btn-primary">
            <ArrowLeft size={16} className="mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }
  
  // Set initial bookmark state from course data
  useEffect(() => {
    setIsBookmarked(course.bookmarked || false);
  }, [course.bookmarked]);
  
  const { 
    title, 
    thumbnail, 
    instructor, 
    estimatedTime, 
    overview, 
    progress, 
    modules, 
    resources 
  } = course;
  
  const isNewCourse = progress === undefined || progress === 0;
  
  // Handle bookmark toggle
  const handleBookmarkToggle = () => {
    if (courseId) {
      toggleBookmark(courseId);
      setIsBookmarked(!isBookmarked);
    }
  };
  
  // Calculate overall progress
  const calculateModuleProgress = (module: CourseModule): number => {
    if (!module.lessons.length) return 0;
    const completedLessons = module.lessons.filter(lesson => lesson.completed).length;
    return Math.round((completedLessons / module.lessons.length) * 100);
  };
  
  const calculateOverallProgress = (): number => {
    if (!modules || !modules.length) return progress || 0;
    
    let totalLessons = 0;
    let completedLessons = 0;
    
    modules.forEach(module => {
      totalLessons += module.lessons.length;
      completedLessons += module.lessons.filter(lesson => lesson.completed).length;
    });
    
    return totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;
  };
  
  const overallProgress = calculateOverallProgress();
  
  // Find the next incomplete lesson
  const findNextLesson = (): { moduleId: string; lessonId: string; title: string } | null => {
    if (!modules) return null;
    
    for (const module of modules) {
      for (const lesson of module.lessons) {
        if (!lesson.completed) {
          return {
            moduleId: module.id,
            lessonId: lesson.id,
            title: lesson.title
          };
        }
      }
    }
    
    return null;
  };
  
  const nextLesson = findNextLesson();
  
  // Render lesson icon based on type
  const renderLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play size={16} className="text-primary" />;
      case 'quiz':
        return <FileText size={16} className="text-secondary" />;
      case 'reading':
        return <BookOpen size={16} className="text-accent" />;
      default:
        return <BookOpen size={16} />;
    }
  };
  
  // Render resource icon based on type
  const renderResourceIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText size={16} className="text-error" />;
      case 'link':
        return <LinkIcon size={16} className="text-primary" />;
      case 'video':
        return <Play size={16} className="text-secondary" />;
      case 'code':
        return <Download size={16} className="text-accent" />;
      default:
        return <FileText size={16} />;
    }
  };
  
  // Get lesson type badge with icon and color
  const getLessonTypeBadge = (type: string) => {
    switch (type) {
      case 'video':
        return (
          <span className="badge badge-sm badge-primary gap-1">
            <Play size={12} />
            Video
          </span>
        );
      case 'quiz':
        return (
          <span className="badge badge-sm badge-secondary gap-1">
            <FileText size={12} />
            Quiz
          </span>
        );
      case 'reading':
        return (
          <span className="badge badge-sm badge-accent gap-1">
            <BookOpen size={12} />
            Reading
          </span>
        );
      default:
        return (
          <span className="badge badge-sm badge-outline gap-1">
            <BookOpen size={12} />
            {type}
          </span>
        );
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Back Navigation */}
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="btn btn-ghost btn-sm gap-2">
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
        
        {/* Bookmark Button */}
        <button 
          className={`btn btn-sm ${isBookmarked ? 'btn-primary' : 'btn-outline'} gap-2`}
          onClick={handleBookmarkToggle}
        >
          <Bookmark size={16} className={isBookmarked ? 'fill-current' : ''} />
          {isBookmarked ? 'Bookmarked' : 'Bookmark'}
        </button>
      </div>
      
      {/* Course Header */}
      <div className="relative rounded-xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 z-10"></div>
        <img 
          src={thumbnail} 
          alt={title} 
          className="w-full h-64 md:h-80 object-cover"
        />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
          <div className="flex flex-wrap gap-3 mb-2">
            <span className="badge badge-primary">{course.category}</span>
            {isNewCourse ? (
              <span className="badge badge-secondary">New Course</span>
            ) : (
              <span className="badge badge-accent">{progress}% Complete</span>
            )}
          </div>
          
          <Link to={`/course/${courseId}`} className="block">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 hover:text-primary transition-colors">{title}</h1>
          </Link>
          
          <div className="flex flex-wrap gap-4 items-center text-sm md:text-base">
            {instructor && (
              <div className="flex items-center gap-1">
                <User size={16} />
                <span>{instructor}</span>
              </div>
            )}
            
            {estimatedTime && (
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{estimatedTime}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Left Side (2/3 width on desktop) */}
        <div className="lg:col-span-2">
          {/* Course Overview */}
          <div className="bg-base-100 rounded-box p-6 mb-8 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-primary">Course Overview</h2>
            <p className="text-base-content/80 leading-relaxed">
              {overview || course.description}
            </p>
          </div>
          
          {/* Secondary Navigation */}
          <div className="tabs tabs-boxed mb-6">
            <a 
              className={`tab ${activeTab === 'syllabus' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('syllabus')}
            >
              <BookOpen size={16} className="mr-2" />
              Syllabus
            </a>
            <a 
              className={`tab ${activeTab === 'resources' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('resources')}
            >
              <FileText size={16} className="mr-2" />
              Resources
            </a>
            <a 
              className={`tab ${activeTab === 'progress' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('progress')}
            >
              <BarChart2 size={16} className="mr-2" />
              Progress
            </a>
          </div>
          
          {/* Tab Content */}
          <div className="bg-base-100 rounded-box p-6 shadow-lg">
            {/* Syllabus Tab */}
            {activeTab === 'syllabus' && (
              <div>
                <h2 className="text-xl font-bold mb-4 text-secondary">Course Curriculum</h2>
                
                {modules && modules.length > 0 ? (
                  <div className="space-y-6">
                    {modules.map((module, index) => (
                      <div key={module.id} className="collapse collapse-arrow bg-base-200 rounded-box">
                        <input type="checkbox" defaultChecked={index === 0} /> 
                        <div className="collapse-title font-medium flex justify-between items-center pr-12">
                          <div className="flex items-center gap-2">
                            {module.completed ? (
                              <CheckCircle size={18} className="text-success" />
                            ) : (
                              <div className="badge badge-sm">{calculateModuleProgress(module)}%</div>
                            )}
                            <span>{module.title}</span>
                          </div>
                          <span className="text-sm text-base-content/70">{module.duration}</span>
                        </div>
                        <div className="collapse-content">
                          <ul className="space-y-2 mt-2">
                            {module.lessons.map(lesson => (
                              <li key={lesson.id} className="flex items-center justify-between p-2 rounded hover:bg-base-300 transition-colors">
                                <div className="flex items-center gap-2">
                                  {lesson.completed ? (
                                    <CheckCircle size={16} className="text-success" />
                                  ) : (
                                    renderLessonIcon(lesson.type)
                                  )}
                                  <span className={lesson.completed ? 'line-through opacity-70' : ''}>
                                    {lesson.title}
                                  </span>
                                  {getLessonTypeBadge(lesson.type)}
                                </div>
                                <span className="text-sm text-base-content/70">{lesson.duration}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="alert">
                    <span>Curriculum details will be available soon.</span>
                  </div>
                )}
              </div>
            )}
            
            {/* Resources Tab */}
            {activeTab === 'resources' && (
              <div>
                <h2 className="text-xl font-bold mb-4 text-accent">Course Resources</h2>
                
                {resources && resources.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resources.map(resource => (
                      <div key={resource.id} className="card bg-base-200">
                        <div className="card-body p-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-base-100 p-3 rounded-lg">
                              {renderResourceIcon(resource.type)}
                            </div>
                            <div>
                              <h3 className="font-medium">{resource.title}</h3>
                              <span className="text-xs badge badge-sm">{resource.type.toUpperCase()}</span>
                            </div>
                          </div>
                          <div className="card-actions justify-end mt-2">
                            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary">
                              {resource.type === 'link' ? 'Visit' : 'Download'}
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="alert">
                    <span>No resources available for this course yet.</span>
                  </div>
                )}
              </div>
            )}
            
            {/* Progress Tab */}
            {activeTab === 'progress' && (
              <div>
                <h2 className="text-xl font-bold mb-4 text-info">Your Progress</h2>
                
                <div className="stats shadow w-full mb-6">
                  <div className="stat">
                    <div className="stat-title">Overall Completion</div>
                    <div className="stat-value text-primary">{overallProgress}%</div>
                    <div className="stat-desc">
                      {isNewCourse ? 'Start learning today!' : `Last activity: ${new Date().toLocaleDateString()}`}
                    </div>
                  </div>
                  
                  <div className="stat">
                    <div className="stat-title">Time Spent</div>
                    <div className="stat-value">3h 24m</div>
                    <div className="stat-desc">Out of {estimatedTime}</div>
                  </div>
                </div>
                
                {modules && (
                  <div className="space-y-4">
                    <h3 className="font-bold">Module Progress</h3>
                    {modules.map(module => (
                      <div key={module.id} className="flex flex-col">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">{module.title}</span>
                          <span className="text-sm font-medium">{calculateModuleProgress(module)}%</span>
                        </div>
                        <progress 
                          className="progress progress-primary w-full" 
                          value={calculateModuleProgress(module)} 
                          max="100"
                        ></progress>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Sidebar - Right Side (1/3 width on desktop) */}
        <div className="lg:col-span-1">
          {/* Course Progress Card */}
          <div className="bg-base-100 rounded-box p-6 shadow-lg mb-6">
            <h3 className="text-lg font-bold mb-4 text-primary">Your Progress</h3>
            
            {isNewCourse ? (
              <div className="alert alert-info mb-4">
                <span>You haven't started this course yet.</span>
              </div>
            ) : (
              <>
                <div className="flex justify-center mb-4">
                  <div className="radial-progress text-primary relative flex items-center justify-center" 
                    style={{ "--value": overallProgress, "--size": "8rem", "--thickness": "0.8rem" } as React.CSSProperties}>
                    <span className="text-2xl font-bold absolute">{overallProgress}%</span>
                  </div>
                </div>
                
                <div className="text-center mb-4">
                  <p className="text-sm text-base-content/70">
                    {nextLesson ? `Next up: ${nextLesson.title}` : 'Course completed!'}
                  </p>
                </div>
              </>
            )}
            
            {/* CTA Button */}
            <Link to={`/classroom/${courseId}`} className="btn btn-primary w-full gap-2 whitespace-nowrap">
              {isNewCourse ? (
                <>
                  <Play size={16} />
                  Start Course
                </>
              ) : nextLesson ? (
                <>
                  <Play size={16} />
                  Continue Learning
                </>
              ) : (
                <>
                  <CheckCircle size={16} />
                  Review Course
                </>
              )}
            </Link>
          </div>
          
          {/* Course Details Card */}
          <div className="bg-base-100 rounded-box p-6 shadow-lg mb-6">
            <h3 className="text-lg font-bold mb-4 text-secondary">Course Details</h3>
            
            <ul className="space-y-3">
              <li>
                <span className="text-base-content/70 block mb-1">Category</span>
                <span className="font-medium">{course.category}</span>
              </li>
              <li>
                <span className="text-base-content/70 block mb-1">Duration</span>
                <span className="font-medium">{estimatedTime}</span>
              </li>
              <li>
                <span className="text-base-content/70 block mb-1">Instructor</span>
                <span className="font-medium">{instructor}</span>
              </li>
              <li>
                <span className="text-base-content/70 block mb-1">Last Updated</span>
                <span className="font-medium">March 15, 2023</span>
              </li>
              <li>
                <span className="text-base-content/70 block mb-1">Language</span>
                <span className="font-medium">English</span>
              </li>
            </ul>
          </div>
          
          {/* Related Courses */}
          <div className="bg-base-100 rounded-box p-6 shadow-lg">
            <h3 className="text-lg font-bold mb-4 text-accent">You Might Also Like</h3>
            
            <div className="space-y-4">
              <div className="flex gap-3 items-center">
                <img 
                  src="https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="React for Beginners" 
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h4 className="font-medium text-sm">React for Beginners</h4>
                  <p className="text-xs text-base-content/70">Michael Chen</p>
                </div>
              </div>
              
              <div className="flex gap-3 items-center">
                <img 
                  src="https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Advanced JavaScript Patterns" 
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h4 className="font-medium text-sm">Advanced JavaScript Patterns</h4>
                  <p className="text-xs text-base-content/70">David Wilson</p>
                </div>
              </div>
              
              <div className="flex gap-3 items-center">
                <img 
                  src="https://images.unsplash.com/photo-1526498460520-4c246339dccb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Mobile App Development" 
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h4 className="font-medium text-sm">Mobile App Development</h4>
                  <p className="text-xs text-base-content/70">Alex Johnson</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
