import { Course } from '../types';
import { hasLifetimeAccess } from '../services/authService';

// Sample course data
export const courses: Course[] = [
  {
    id: '1',
    title: 'Web Development Fundamentals',
    description: 'Learn the core concepts of web development including HTML, CSS, and JavaScript.',
    thumbnail: 'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    instructor: 'Sarah Johnson',
    estimatedTime: '12 hours',
    category: 'Web Development',
    status: 'active',
    progress: 75,
    bookmarked: true,
    overview: 'This comprehensive course covers all the essential concepts of modern web development. You\'ll learn how to create responsive websites using HTML5, CSS3, and JavaScript. By the end of this course, you\'ll be able to build your own web applications from scratch.',
    modules: [
      {
        id: 'm1',
        title: 'Introduction to HTML',
        duration: '2 hours',
        completed: true,
        lessons: [
          {
            id: 'l1',
            title: 'HTML Document Structure',
            duration: '15 min',
            type: 'video',
            completed: true
          },
          {
            id: 'l2',
            title: 'Working with Text Elements',
            duration: '20 min',
            type: 'video',
            completed: true
          },
          {
            id: 'l3',
            title: 'HTML Forms and Inputs',
            duration: '25 min',
            type: 'video',
            completed: true
          },
          {
            id: 'l4',
            title: 'HTML Quiz',
            duration: '15 min',
            type: 'quiz',
            completed: true
          }
        ]
      },
      {
        id: 'm2',
        title: 'CSS Styling',
        duration: '3 hours',
        completed: true,
        lessons: [
          {
            id: 'l5',
            title: 'CSS Selectors',
            duration: '20 min',
            type: 'video',
            completed: true
          },
          {
            id: 'l6',
            title: 'Box Model and Layout',
            duration: '25 min',
            type: 'video',
            completed: true
          },
          {
            id: 'l7',
            title: 'Flexbox and Grid',
            duration: '30 min',
            type: 'video',
            completed: true
          },
          {
            id: 'l8',
            title: 'Responsive Design',
            duration: '25 min',
            type: 'video',
            completed: true
          },
          {
            id: 'l9',
            title: 'CSS Quiz',
            duration: '15 min',
            type: 'quiz',
            completed: true
          }
        ]
      },
      {
        id: 'm3',
        title: 'JavaScript Basics',
        duration: '4 hours',
        completed: false,
        lessons: [
          {
            id: 'l10',
            title: 'Variables and Data Types',
            duration: '20 min',
            type: 'video',
            completed: true
          },
          {
            id: 'l11',
            title: 'Functions and Scope',
            duration: '25 min',
            type: 'video',
            completed: true
          },
          {
            id: 'l12',
            title: 'DOM Manipulation',
            duration: '30 min',
            type: 'video',
            completed: true
          },
          {
            id: 'l13',
            title: 'Events and Event Handling',
            duration: '25 min',
            type: 'video',
            completed: false
          },
          {
            id: 'l14',
            title: 'Asynchronous JavaScript',
            duration: '35 min',
            type: 'video',
            completed: false
          },
          {
            id: 'l15',
            title: 'JavaScript Quiz',
            duration: '20 min',
            type: 'quiz',
            completed: false
          }
        ]
      },
      {
        id: 'm4',
        title: 'Building a Project',
        duration: '3 hours',
        completed: false,
        lessons: [
          {
            id: 'l16',
            title: 'Project Planning',
            duration: '15 min',
            type: 'reading',
            completed: false
          },
          {
            id: 'l17',
            title: 'Setting Up the Project',
            duration: '20 min',
            type: 'video',
            completed: false
          },
          {
            id: 'l18',
            title: 'Implementing Features',
            duration: '45 min',
            type: 'video',
            completed: false
          },
          {
            id: 'l19',
            title: 'Styling the Project',
            duration: '30 min',
            type: 'video',
            completed: false
          },
          {
            id: 'l20',
            title: 'Testing and Deployment',
            duration: '25 min',
            type: 'video',
            completed: false
          },
          {
            id: 'l21',
            title: 'Final Project Submission',
            duration: '10 min',
            type: 'quiz',
            completed: false
          }
        ]
      }
    ],
    resources: [
      {
        id: 'r1',
        title: 'HTML Cheat Sheet',
        type: 'pdf',
        url: '#'
      },
      {
        id: 'r2',
        title: 'CSS Reference Guide',
        type: 'pdf',
        url: '#'
      },
      {
        id: 'r3',
        title: 'JavaScript Documentation',
        type: 'link',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript'
      },
      {
        id: 'r4',
        title: 'Project Starter Files',
        type: 'code',
        url: '#'
      }
    ]
  },
  {
    id: '2',
    title: 'React.js for Beginners',
    description: 'Start your journey with React.js and learn to build modern user interfaces.',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    instructor: 'Michael Chen',
    estimatedTime: '10 hours',
    category: 'JavaScript Frameworks',
    status: 'active',
    progress: 30,
    bookmarked: false
  },
  {
    id: '3',
    title: 'Advanced JavaScript Patterns',
    description: 'Dive deep into advanced JavaScript concepts and design patterns.',
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    instructor: 'David Wilson',
    estimatedTime: '8 hours',
    category: 'JavaScript',
    status: 'active',
    progress: 0,
    bookmarked: false
  },
  {
    id: '4',
    title: 'Mobile App Development with React Native',
    description: 'Learn to build native mobile apps using React Native framework.',
    thumbnail: 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    instructor: 'Alex Johnson',
    estimatedTime: '15 hours',
    category: 'Mobile Development',
    status: 'active',
    progress: 10,
    bookmarked: true
  },
  {
    id: '5',
    title: 'Node.js Backend Development',
    description: 'Build scalable backend services with Node.js and Express.',
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    instructor: 'Emily Davis',
    estimatedTime: '12 hours',
    category: 'Backend Development',
    status: 'active',
    progress: 0,
    bookmarked: false
  },
  {
    id: '6',
    title: 'Python for Data Science',
    description: 'Learn Python programming for data analysis and visualization.',
    thumbnail: 'https://images.unsplash.com/photo-1526379879527-8559ecfcb0c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    instructor: 'Robert Smith',
    estimatedTime: '14 hours',
    category: 'Data Science',
    status: 'locked',
    progress: 0,
    bookmarked: false
  }
];

// Function to get a course by ID
export const getCourseById = (id: string): Course | undefined => {
  return courses.find(course => course.id === id);
};

// Function to toggle bookmark status
export const toggleBookmark = (id: string): void => {
  const course = courses.find(course => course.id === id);
  if (course) {
    course.bookmarked = !course.bookmarked;
  }
};

// Function to get bookmarked courses
export const getBookmarkedCourses = (): Course[] => {
  return courses.filter(course => course.bookmarked);
};

// Function to get available courses based on user status
export const getAvailableCourses = (): Course[] => {
  // If user has lifetime access, all courses are available
  if (hasLifetimeAccess()) {
    return courses.map(course => ({
      ...course,
      status: 'active' // Override locked status for lifetime users
    }));
  }
  
  // Otherwise, return courses as is
  return courses;
};
