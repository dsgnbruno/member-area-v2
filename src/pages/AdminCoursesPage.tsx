import React, { useState, useEffect } from 'react';
import { Course } from '../types';
import { Edit, Trash2, Plus, Search, Save, X } from 'lucide-react';

// NocoDB configuration for Courses
const COURSES_NOCODB_CONFIG = {
  host: 'https://nocodb.bbtqj1.easypanel.host/',
  baseId: 'pzezd6u18bjbe4r',
  tableId: 'muqy4gxj2nw7oiw',
  apiToken: 'ugotnKik_E0FBXkZsdwdARlwWvNTqQg7R2Kirriy',
};

const AdminCoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    title: '',
    description: '',
    thumbnail: '',
    instructor: '',
    estimatedTime: '',
    category: '',
    status: 'locked',
    progress: 0,
    bookmarked: false
  });

  // Fetch courses from NocoDB
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${COURSES_NOCODB_CONFIG.host}api/v1/db/data/noco/${COURSES_NOCODB_CONFIG.baseId}/${COURSES_NOCODB_CONFIG.tableId}`,
        {
          headers: {
            'xc-token': COURSES_NOCODB_CONFIG.apiToken,
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch courses: ${response.status}`);
      }

      const data = await response.json();
      const coursesList = data.list || [];
      setCourses(coursesList);
      setError(null);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses. Please try again later.');
      // Use sample data for demonstration if API fails
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Filter courses based on search term
  const filteredCourses = courses.filter(course => 
    course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle course creation
  const handleCreateCourse = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${COURSES_NOCODB_CONFIG.host}api/v1/db/data/noco/${COURSES_NOCODB_CONFIG.baseId}/${COURSES_NOCODB_CONFIG.tableId}`,
        {
          method: 'POST',
          headers: {
            'xc-token': COURSES_NOCODB_CONFIG.apiToken,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newCourse)
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to create course: ${response.status}`);
      }

      // Refresh courses list
      await fetchCourses();
      setIsCreating(false);
      setNewCourse({
        title: '',
        description: '',
        thumbnail: '',
        instructor: '',
        estimatedTime: '',
        category: '',
        status: 'locked',
        progress: 0,
        bookmarked: false
      });
    } catch (err) {
      console.error('Error creating course:', err);
      setError('Failed to create course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle course update
  const handleUpdateCourse = async () => {
    if (!editingCourse) return;
    
    try {
      setLoading(true);
      const response = await fetch(
        `${COURSES_NOCODB_CONFIG.host}api/v1/db/data/noco/${COURSES_NOCODB_CONFIG.baseId}/${COURSES_NOCODB_CONFIG.tableId}/${editingCourse.id}`,
        {
          method: 'PATCH',
          headers: {
            'xc-token': COURSES_NOCODB_CONFIG.apiToken,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(editingCourse)
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update course: ${response.status}`);
      }

      // Refresh courses list
      await fetchCourses();
      setEditingCourse(null);
    } catch (err) {
      console.error('Error updating course:', err);
      setError('Failed to update course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle course deletion
  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    
    try {
      setLoading(true);
      const response = await fetch(
        `${COURSES_NOCODB_CONFIG.host}api/v1/db/data/noco/${COURSES_NOCODB_CONFIG.baseId}/${COURSES_NOCODB_CONFIG.tableId}/${id}`,
        {
          method: 'DELETE',
          headers: {
            'xc-token': COURSES_NOCODB_CONFIG.apiToken
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete course: ${response.status}`);
      }

      // Refresh courses list
      await fetchCourses();
    } catch (err) {
      console.error('Error deleting course:', err);
      setError('Failed to delete course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col gap-6">
        <div className="bg-base-100 rounded-box p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Manage Courses</h1>
            <button 
              className="btn btn-primary"
              onClick={() => setIsCreating(true)}
              disabled={isCreating || !!editingCourse}
            >
              <Plus size={18} /> Add New Course
            </button>
          </div>
          
          {/* Search */}
          <div className="relative mb-6">
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
          
          {/* Error message */}
          {error && (
            <div className="alert alert-error mb-4">
              <div>{error}</div>
            </div>
          )}
          
          {/* Create Course Form */}
          {isCreating && (
            <div className="bg-base-200 p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Add New Course</h2>
                <button 
                  className="btn btn-sm btn-ghost"
                  onClick={() => setIsCreating(false)}
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="form-control">
                  <label className="label">Title</label>
                  <input 
                    type="text" 
                    className="input input-bordered" 
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">Instructor</label>
                  <input 
                    type="text" 
                    className="input input-bordered" 
                    value={newCourse.instructor}
                    onChange={(e) => setNewCourse({...newCourse, instructor: e.target.value})}
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">Category</label>
                  <input 
                    type="text" 
                    className="input input-bordered" 
                    value={newCourse.category}
                    onChange={(e) => setNewCourse({...newCourse, category: e.target.value})}
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">Estimated Time</label>
                  <input 
                    type="text" 
                    className="input input-bordered" 
                    value={newCourse.estimatedTime}
                    onChange={(e) => setNewCourse({...newCourse, estimatedTime: e.target.value})}
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">Thumbnail URL</label>
                  <input 
                    type="text" 
                    className="input input-bordered" 
                    value={newCourse.thumbnail}
                    onChange={(e) => setNewCourse({...newCourse, thumbnail: e.target.value})}
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">Status</label>
                  <select 
                    className="select select-bordered" 
                    value={newCourse.status as string}
                    onChange={(e) => setNewCourse({...newCourse, status: e.target.value as 'active' | 'completed' | 'locked'})}
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="locked">Locked</option>
                  </select>
                </div>
              </div>
              
              <div className="form-control mb-4">
                <label className="label">Description</label>
                <textarea 
                  className="textarea textarea-bordered h-24" 
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                ></textarea>
              </div>
              
              <div className="flex justify-end gap-2">
                <button 
                  className="btn btn-ghost"
                  onClick={() => setIsCreating(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleCreateCourse}
                  disabled={loading || !newCourse.title}
                >
                  {loading ? <span className="loading loading-spinner"></span> : <Save size={18} />} Save Course
                </button>
              </div>
            </div>
          )}
          
          {/* Edit Course Form */}
          {editingCourse && (
            <div className="bg-base-200 p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Edit Course</h2>
                <button 
                  className="btn btn-sm btn-ghost"
                  onClick={() => setEditingCourse(null)}
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="form-control">
                  <label className="label">Title</label>
                  <input 
                    type="text" 
                    className="input input-bordered" 
                    value={editingCourse.title}
                    onChange={(e) => setEditingCourse({...editingCourse, title: e.target.value})}
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">Instructor</label>
                  <input 
                    type="text" 
                    className="input input-bordered" 
                    value={editingCourse.instructor}
                    onChange={(e) => setEditingCourse({...editingCourse, instructor: e.target.value})}
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">Category</label>
                  <input 
                    type="text" 
                    className="input input-bordered" 
                    value={editingCourse.category}
                    onChange={(e) => setEditingCourse({...editingCourse, category: e.target.value})}
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">Estimated Time</label>
                  <input 
                    type="text" 
                    className="input input-bordered" 
                    value={editingCourse.estimatedTime}
                    onChange={(e) => setEditingCourse({...editingCourse, estimatedTime: e.target.value})}
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">Thumbnail URL</label>
                  <input 
                    type="text" 
                    className="input input-bordered" 
                    value={editingCourse.thumbnail}
                    onChange={(e) => setEditingCourse({...editingCourse, thumbnail: e.target.value})}
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">Status</label>
                  <select 
                    className="select select-bordered" 
                    value={editingCourse.status}
                    onChange={(e) => setEditingCourse({...editingCourse, status: e.target.value as 'active' | 'completed' | 'locked'})}
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="locked">Locked</option>
                  </select>
                </div>
              </div>
              
              <div className="form-control mb-4">
                <label className="label">Description</label>
                <textarea 
                  className="textarea textarea-bordered h-24" 
                  value={editingCourse.description}
                  onChange={(e) => setEditingCourse({...editingCourse, description: e.target.value})}
                ></textarea>
              </div>
              
              <div className="flex justify-end gap-2">
                <button 
                  className="btn btn-ghost"
                  onClick={() => setEditingCourse(null)}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleUpdateCourse}
                  disabled={loading}
                >
                  {loading ? <span className="loading loading-spinner"></span> : <Save size={18} />} Update Course
                </button>
              </div>
            </div>
          )}
          
          {/* Courses Table */}
          {loading && !isCreating && !editingCourse ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Instructor</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map(course => (
                    <tr key={course.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          {course.thumbnail && (
                            <div className="avatar">
                              <div className="w-12 h-12 rounded">
                                <img src={course.thumbnail} alt={course.title} />
                              </div>
                            </div>
                          )}
                          <div>
                            <div className="font-bold">{course.title}</div>
                            <div className="text-sm opacity-50 truncate max-w-xs">{course.description}</div>
                          </div>
                        </div>
                      </td>
                      <td>{course.instructor}</td>
                      <td>{course.category}</td>
                      <td>
                        <div className={`badge ${
                          course.status === 'active' ? 'badge-success' : 
                          course.status === 'completed' ? 'badge-info' : 
                          'badge-warning'
                        }`}>
                          {course.status}
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button 
                            className="btn btn-sm btn-outline"
                            onClick={() => setEditingCourse(course)}
                            disabled={!!editingCourse || isCreating}
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className="btn btn-sm btn-outline btn-error"
                            onClick={() => handleDeleteCourse(course.id)}
                            disabled={loading}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-lg">No courses found</p>
              {searchTerm && (
                <button 
                  className="btn btn-outline mt-4"
                  onClick={() => setSearchTerm('')}
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCoursesPage;
