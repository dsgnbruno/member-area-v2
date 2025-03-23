import React, { useState } from 'react';
import { Settings, User } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile'>('profile');
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-8">
        <Settings size={24} className="text-primary" />
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar - Simplified */}
        <div className="lg:col-span-1">
          <div className="bg-base-100 rounded-box p-4 shadow-lg">
            <ul className="menu w-full">
              <li>
                <a 
                  className={activeTab === 'profile' ? 'active' : ''}
                  onClick={() => setActiveTab('profile')}
                >
                  <User size={18} />
                  Profile
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Main Content - Only Profile Settings */}
        <div className="lg:col-span-3">
          <div className="bg-base-100 rounded-box p-6 shadow-lg">
            {/* Profile Settings */}
            <div>
              <h2 className="text-xl font-bold mb-6">Profile Settings</h2>
              
              <div className="mb-8">
                <form className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Full Name</span>
                    </label>
                    <input type="text" placeholder="John Doe" className="input input-bordered w-full" />
                  </div>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Email Address</span>
                    </label>
                    <input type="email" placeholder="john@example.com" className="input input-bordered w-full" />
                  </div>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Bio</span>
                    </label>
                    <textarea className="textarea textarea-bordered h-24" placeholder="Tell us about yourself"></textarea>
                  </div>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Location</span>
                    </label>
                    <input type="text" placeholder="City, Country" className="input input-bordered w-full" />
                  </div>
                  
                  <button className="btn btn-primary">Save Changes</button>
                </form>
              </div>
              
              <div className="divider"></div>
              
              <h3 className="text-lg font-bold mb-4">Account Settings</h3>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Change Password</span>
                  </label>
                  <input type="password" placeholder="Current Password" className="input input-bordered w-full mb-2" />
                  <input type="password" placeholder="New Password" className="input input-bordered w-full mb-2" />
                  <input type="password" placeholder="Confirm New Password" className="input input-bordered w-full" />
                </div>
                
                <button className="btn btn-primary">Update Password</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
