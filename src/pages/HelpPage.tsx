import React, { useState } from 'react';
import { HelpCircle, CheckCircle, Send } from 'lucide-react';

const HelpPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setFormError('Please fill in all fields');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormError('Please enter a valid email address');
      return;
    }
    
    // Clear any previous errors
    setFormError('');
    
    // In a real app, you would send the form data to a server here
    console.log('Form submitted:', formData);
    
    // Show success message
    setFormSubmitted(true);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-8">
        <HelpCircle size={24} className="text-primary" />
        <h1 className="text-2xl font-bold">Help Center</h1>
      </div>
      
      {/* FAQs */}
      <div className="bg-base-100 rounded-box p-6 shadow-lg mb-8">
        <h2 className="text-xl font-bold mb-6">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          <div className="collapse collapse-plus bg-base-200">
            <input type="radio" name="faq-accordion" /> 
            <div className="collapse-title font-medium">
              How do I reset my password?
            </div>
            <div className="collapse-content">
              <p>To reset your password, click on the "Forgot Password" link on the login page. You'll receive an email with instructions to create a new password.</p>
            </div>
          </div>
          
          <div className="collapse collapse-plus bg-base-200">
            <input type="radio" name="faq-accordion" /> 
            <div className="collapse-title font-medium">
              How do I download course materials?
            </div>
            <div className="collapse-content">
              <p>Course materials can be downloaded from the Resources tab on each course page. Look for the download button next to each resource.</p>
            </div>
          </div>
          
          <div className="collapse collapse-plus bg-base-200">
            <input type="radio" name="faq-accordion" /> 
            <div className="collapse-title font-medium">
              Can I access courses on mobile devices?
            </div>
            <div className="collapse-content">
              <p>Yes, our platform is fully responsive and works on all mobile devices. You can access your courses through any modern web browser.</p>
            </div>
          </div>
          
          <div className="collapse collapse-plus bg-base-200">
            <input type="radio" name="faq-accordion" /> 
            <div className="collapse-title font-medium">
              How do I track my progress?
            </div>
            <div className="collapse-content">
              <p>Your progress is automatically tracked as you complete lessons. You can view your overall progress on the course detail page or in the Progress tab.</p>
            </div>
          </div>
          
          <div className="collapse collapse-plus bg-base-200">
            <input type="radio" name="faq-accordion" /> 
            <div className="collapse-title font-medium">
              How do I get a certificate?
            </div>
            <div className="collapse-content">
              <p>Certificates are issued automatically upon completion of all course modules. You can download your certificates from your profile page.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Redesigned Contact Form */}
      <div className="bg-base-100 rounded-box p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Send size={20} className="text-primary" />
          Still Need Help?
        </h2>
        
        {formSubmitted ? (
          <div className="bg-success/10 border border-success/30 rounded-lg p-6 text-center">
            <CheckCircle size={48} className="mx-auto mb-4 text-success" />
            <h3 className="text-lg font-bold mb-2">Request Submitted Successfully!</h3>
            <p className="mb-6 text-base-content/80">
              Thank you for reaching out. Our support team will get back to you within 24 hours.
            </p>
            <button 
              className="btn btn-outline btn-success"
              onClick={() => setFormSubmitted(false)}
            >
              Send Another Request
            </button>
          </div>
        ) : (
          <div className="bg-base-200/50 rounded-lg p-6">
            {formError && (
              <div className="alert alert-error mb-6">
                <span>{formError}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Your Name</span>
                  </label>
                  <input 
                    type="text" 
                    name="name"
                    placeholder="Enter your name" 
                    className="input input-bordered w-full" 
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Email Address</span>
                  </label>
                  <input 
                    type="email" 
                    name="email"
                    placeholder="Enter your email" 
                    className="input input-bordered w-full" 
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-medium">What can we help you with?</span>
                  </label>
                  <select 
                    className="select select-bordered w-full"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>Select a topic</option>
                    <option value="Technical Issue">Technical Issue</option>
                    <option value="Billing Question">Billing Question</option>
                    <option value="Course Content">Course Content</option>
                    <option value="Account Access">Account Access</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-medium">Your Message</span>
                  </label>
                  <textarea 
                    className="textarea textarea-bordered h-32" 
                    placeholder="Please describe your issue in detail..."
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button type="submit" className="btn btn-primary">
                  <Send size={16} />
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpPage;
