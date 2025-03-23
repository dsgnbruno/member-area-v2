import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, CheckCircle, Maximize, Volume2, Settings, BookOpen, FileText, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import { getCourseById } from '../data/courses';
import { Course, Lesson } from '../types';

const Classroom: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentModule, setCurrentModule] = useState<string | null>(null);
  const [currentLesson, setCurrentLesson] = useState<string | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  
  // Get course data
  useEffect(() => {
    if (courseId) {
      const courseData = getCourseById(courseId);
      if (courseData) {
        setCourse(courseData);
        
        // Set initial module and lesson if available
        if (courseData.modules && courseData.modules.length > 0) {
          const firstModule = courseData.modules[0];
          setCurrentModule(firstModule.id);
          
          if (firstModule.lessons && firstModule.lessons.length > 0) {
            const firstIncompleteLesson = firstModule.lessons.find(lesson => !lesson.completed);
            const firstLesson = firstIncompleteLesson || firstModule.lessons[0];
            setCurrentLesson(firstLesson.id);
            setActiveLesson(firstLesson);
          }
        }
      }
    }
  }, [courseId]);
  
  // Handle lesson selection
  const handleLessonSelect = (moduleId: string, lesson: Lesson) => {
    setCurrentModule(moduleId);
    setCurrentLesson(lesson.id);
    setActiveLesson(lesson);
    
    // On mobile, close the sidebar after selecting a lesson
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };
  
  // Find next and previous lessons
  const findAdjacentLessons = () => {
    if (!course || !course.modules || !currentModule || !currentLesson) {
      return { prev: null, next: null };
    }
    
    let allLessons: { moduleId: string; lesson: Lesson }[] = [];
    
    // Flatten all lessons with their module IDs
    course.modules.forEach(module => {
      module.lessons.forEach(lesson => {
        allLessons.push({ moduleId: module.id, lesson });
      });
    });
    
    // Find current lesson index
    const currentIndex = allLessons.findIndex(
      item => item.moduleId === currentModule && item.lesson.id === currentLesson
    );
    
    if (currentIndex === -1) return { prev: null, next: null };
    
    const prev = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
    const next = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
    
    return { prev, next };
  };
  
  const { prev, next } = findAdjacentLessons();
  
  // Get lesson type icon
  const getLessonTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play size={16} />;
      case 'quiz':
        return <FileText size={16} />;
      case 'reading':
        return <BookOpen size={16} />;
      default:
        return <BookOpen size={16} />;
    }
  };
  
  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
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
  
  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-base-100 shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Show hamburger menu on all screen sizes, not just mobile */}
            <button 
              className="btn btn-ghost btn-sm"
              onClick={toggleSidebar}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            
            <Link to={`/course/${courseId}`} className="btn btn-ghost btn-sm gap-2">
              <ArrowLeft size={16} />
              Back to Course
            </Link>
            
            <h1 className="text-lg font-bold hidden md:block truncate max-w-md">
              {course.title}
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="badge badge-primary hidden md:inline-flex">
              {course.category}
            </span>
            <span className="text-sm hidden md:block">
              {course.progress}% Complete
            </span>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Course Sidebar */}
        <aside 
          className={`bg-base-100 shadow-lg transition-all duration-300 overflow-y-auto flex-shrink-0 
            ${sidebarOpen ? 'w-full md:w-80 lg:w-96' : 'w-0'} 
            fixed lg:relative h-[calc(100vh-4rem)] top-16 left-0 z-20 lg:z-0`}
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Course Content</h2>
              <button 
                className="btn btn-ghost btn-sm lg:hidden"
                onClick={toggleSidebar}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Your Progress</span>
                <span className="text-sm">{course.progress}%</span>
              </div>
              <progress 
                className="progress progress-primary w-full" 
                value={course.progress} 
                max="100"
              ></progress>
            </div>
            
            {course.modules && course.modules.length > 0 ? (
              <div className="space-y-4">
                {course.modules.map(module => (
                  <div key={module.id} className="collapse collapse-arrow bg-base-200 rounded-box">
                    <input 
                      type="checkbox" 
                      defaultChecked={module.id === currentModule}
                    />
                    <div className="collapse-title font-medium">
                      <div className="flex items-center gap-2">
                        {module.completed ? (
                          <CheckCircle size={16} className="text-success" />
                        ) : (
                          <div className="badge badge-sm">
                            {module.lessons.filter(l => l.completed).length}/{module.lessons.length}
                          </div>
                        )}
                        <span>{module.title}</span>
                      </div>
                    </div>
                    <div className="collapse-content">
                      <ul className="space-y-1 mt-2">
                        {module.lessons.map(lesson => (
                          <li 
                            key={lesson.id} 
                            className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors
                              ${currentLesson === lesson.id ? 'bg-primary/10 text-primary' : 'hover:bg-base-300'}`}
                            onClick={() => handleLessonSelect(module.id, lesson)}
                          >
                            <div className="flex items-center gap-2 flex-1">
                              {lesson.completed ? (
                                <CheckCircle size={16} className="text-success" />
                              ) : (
                                getLessonTypeIcon(lesson.type)
                              )}
                              <span className={lesson.completed ? 'line-through opacity-70' : ''}>
                                {lesson.title}
                              </span>
                            </div>
                            <span className="text-xs opacity-70">{lesson.duration}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="alert">
                <span>No modules available for this course.</span>
              </div>
            )}
          </div>
        </aside>
        
        {/* Main Content Area */}
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-0' : 'ml-0'}`}>
          {/* Video Player or Lesson Content */}
          <div className="h-full flex flex-col">
            {activeLesson ? (
              <>
                {/* Video Player Area */}
                <div className="relative bg-black aspect-video w-full">
                  {activeLesson.type === 'video' ? (
                    <>
                      {/* Placeholder for video - in a real app, this would be a video player */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-white text-center">
                          <Play size={48} className="mx-auto mb-4 opacity-70" />
                          <h3 className="text-xl font-bold">{activeLesson.title}</h3>
                          <p className="text-white/70">Video Player Placeholder</p>
                        </div>
                      </div>
                      
                      {/* Video Controls */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <div className="flex items-center justify-between text-white">
                          <div className="flex items-center gap-4">
                            <button className="btn btn-circle btn-sm btn-ghost">
                              <Play size={16} />
                            </button>
                            <div className="flex items-center gap-2">
                              <span className="text-xs">00:00</span>
                              <div className="w-24 md:w-48 lg:w-96 h-1 bg-white/30 rounded-full">
                                <div className="h-full w-1/3 bg-primary rounded-full"></div>
                              </div>
                              <span className="text-xs">{activeLesson.duration}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button className="btn btn-circle btn-sm btn-ghost">
                              <Volume2 size={16} />
                            </button>
                            <button className="btn btn-circle btn-sm btn-ghost">
                              <Settings size={16} />
                            </button>
                            <button className="btn btn-circle btn-sm btn-ghost">
                              <Maximize size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : activeLesson.type === 'reading' ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-base-300">
                      <div className="text-center">
                        <BookOpen size={48} className="mx-auto mb-4 opacity-70" />
                        <h3 className="text-xl font-bold">{activeLesson.title}</h3>
                        <p className="opacity-70">Reading Material</p>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-base-300">
                      <div className="text-center">
                        <FileText size={48} className="mx-auto mb-4 opacity-70" />
                        <h3 className="text-xl font-bold">{activeLesson.title}</h3>
                        <p className="opacity-70">Quiz</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Lesson Content and Navigation */}
                <div className="p-6 bg-base-100 flex-1">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-2">{activeLesson.title}</h2>
                    <div className="flex items-center gap-3">
                      <span className="badge badge-primary">{activeLesson.type}</span>
                      <span className="text-sm text-base-content/70">{activeLesson.duration}</span>
                    </div>
                  </div>
                  
                  {/* Lesson Description - Placeholder content */}
                  <div className="prose max-w-none mb-8">
                    <p>
                      This is the content for the current lesson. In a real application, this would contain
                      detailed information, transcripts, or additional resources related to the lesson.
                    </p>
                    <p>
                      For video lessons, this might include a transcript or supplementary notes.
                      For reading lessons, this would contain the full text content.
                      For quizzes, this would show the questions and possible answers.
                    </p>
                  </div>
                  
                  {/* Lesson Navigation */}
                  <div className="flex justify-between mt-8">
                    {prev ? (
                      <button 
                        className="btn btn-outline gap-2"
                        onClick={() => handleLessonSelect(prev.moduleId, prev.lesson)}
                      >
                        <ChevronLeft size={16} />
                        Previous Lesson
                      </button>
                    ) : (
                      <div></div> // Empty div to maintain flex spacing
                    )}
                    
                    {next ? (
                      <button 
                        className="btn btn-primary gap-2"
                        onClick={() => handleLessonSelect(next.moduleId, next.lesson)}
                      >
                        Next Lesson
                        <ChevronRight size={16} />
                      </button>
                    ) : (
                      <button className="btn btn-success gap-2">
                        <CheckCircle size={16} />
                        Complete Course
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">Select a Lesson</h2>
                  <p className="mb-4">Choose a lesson from the sidebar to start learning.</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setSidebarOpen(true)}
                  >
                    <Menu size={16} className="mr-2" />
                    Open Course Menu
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classroom;
