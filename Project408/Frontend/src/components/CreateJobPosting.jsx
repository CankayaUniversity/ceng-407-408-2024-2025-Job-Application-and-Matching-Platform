import { useState } from 'react';
import { FaPaperPlane, FaTimes, FaPlus, FaMapMarkerAlt, FaCalendarAlt, FaMoneyBillWave, FaBriefcase, FaClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function CreateJobPosting() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    responsibilities: '',
    location: '',
    employmentType: 'FULL_TIME',
    workType: 'ONSITE',
    experienceLevel: 'ENTRY_LEVEL',
    salaryMin: '',
    salaryMax: '',
    deadline: '',
    minWorkHours: '',
    maxWorkHours: '',
    experienceYears: '',
    technicalSkills: [],
    socialSkills: []
  });

  const [skillInput, setSkillInput] = useState('');
  const [socialSkillInput, setSocialSkillInput] = useState('');

  // Work Types 
  const workTypes = [
    { value: 'ONSITE', label: 'On-site' },
    { value: 'REMOTE', label: 'Remote' },
    { value: 'HYBRID', label: 'Hybrid' }
  ];
  
  // Employment Types
  const employmentTypes = [
    { value: 'FULL_TIME', label: 'Full-time' },
    { value: 'PART_TIME', label: 'Part-time' },
    { value: 'CONTRACT', label: 'Contract' },
    { value: 'TEMPORARY', label: 'Temporary' },
    { value: 'INTERNSHIP', label: 'Internship' }
  ];
  
  // Experience Levels
  const experienceLevels = [
    { value: 'ENTRY_LEVEL', label: 'Entry Level (0-2 years)' },
    { value: 'MID_LEVEL', label: 'Mid Level (2-5 years)' },
    { value: 'SENIOR', label: 'Senior (5+ years)' },
    { value: 'EXECUTIVE', label: 'Executive' }
  ];

  const formTabs = [
    'Basic Information',
    'Details & Conditions',
    'Skills & Requirements'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSkillAdd = () => {
    if (skillInput.trim() && !formData.technicalSkills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        technicalSkills: [...formData.technicalSkills, skillInput.trim()]
      });
      setSkillInput('');
    }
  };

  const handleSocialSkillAdd = () => {
    if (socialSkillInput.trim() && !formData.socialSkills.includes(socialSkillInput.trim())) {
      setFormData({
        ...formData,
        socialSkills: [...formData.socialSkills, socialSkillInput.trim()]
      });
      setSocialSkillInput('');
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setFormData({
      ...formData,
      technicalSkills: formData.technicalSkills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleSocialSkillRemove = (skillToRemove) => {
    setFormData({
      ...formData,
      socialSkills: formData.socialSkills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSkillAdd();
    }
  };

  const handleSocialSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSocialSkillAdd();
    }
  };

  const goToNextTab = () => {
    if (activeTab < formTabs.length - 1) {
      setActiveTab(activeTab + 1);
      window.scrollTo(0, 0);
    }
  };

  const goToPrevTab = () => {
    if (activeTab > 0) {
      setActiveTab(activeTab - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Validate form
      if (!formData.title || !formData.description || !formData.location || !formData.deadline) {
        throw new Error('Lütfen tüm zorunlu alanları doldurun');
      }
      
      // Format data for API
      const jobPostingData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        workType: formData.workType,
        employmentType: formData.employmentType,
        experienceYears: formData.experienceYears ? parseInt(formData.experienceYears) : 0,
        deadline: new Date(formData.deadline).toISOString(),
        minSalary: formData.salaryMin ? parseFloat(formData.salaryMin) : null,
        maxSalary: formData.salaryMax ? parseFloat(formData.salaryMax) : null,
        minWorkHours: formData.minWorkHours ? parseInt(formData.minWorkHours) : null,
        maxWorkHours: formData.maxWorkHours ? parseInt(formData.maxWorkHours) : null,
        technicalSkills: formData.technicalSkills,
        socialSkills: formData.socialSkills,
        countryId: 1, // Default country ID
        degreeType: 'BACHELOR', // Default degree type
        jobExperience: formData.experienceLevel === 'ENTRY_LEVEL' ? 'JUNIOR' : 
                      formData.experienceLevel === 'MID_LEVEL' ? 'MID_LEVEL' : 'SENIOR'
      };
      
      const token = localStorage.getItem('token');
      
      console.log('Sending job posting data:', jobPostingData);
      
      const response = await fetch('http://localhost:9090/api/job-adv/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(jobPostingData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || 'İş ilanı oluşturulurken bir hata oluştu');
        } catch (jsonError) {
          throw new Error(`İş ilanı oluşturulurken bir hata oluştu (${response.status}: ${errorText.substring(0, 100)}...)`);
        }
      }
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/employer/jobs');
      }, 2000);
      
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderTab = () => {
    switch (activeTab) {
      case 0:
        return (
          <div className="space-y-6 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
                Job Title*
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Senior Frontend Developer"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
                Job Description*
              </label>
              <textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                placeholder="Provide a detailed description of the job role..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="requirements">
                  Requirements
                </label>
                <textarea
                  id="requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="List the job requirements..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="responsibilities">
                  Responsibilities
                </label>
                <textarea
                  id="responsibilities"
                  name="responsibilities"
                  value={formData.responsibilities}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="List the job responsibilities..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                ></textarea>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-grow">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="location">
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-blue-500" />
                    Location*
                  </div>
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., New York, NY or Remote"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="flex-grow">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="deadline">
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-2 text-blue-500" />
                    Application Deadline*
                  </div>
                </label>
                <input
                  id="deadline"
                  name="deadline"
                  type="date"
                  required
                  value={formData.deadline}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="employmentType">
                  <div className="flex items-center">
                    <FaBriefcase className="mr-2 text-blue-500" />
                    Employment Type
                  </div>
                </label>
                <select
                  id="employmentType"
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  {employmentTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="workType">
                  <div className="flex items-center">
                    <FaClock className="mr-2 text-blue-500" />
                    Work Type
                  </div>
                </label>
                <select
                  id="workType"
                  name="workType"
                  value={formData.workType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  {workTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center">
                    <FaMoneyBillWave className="mr-2 text-blue-500" />
                    Salary Range (USD)
                  </div>
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex-grow">
                    <input
                      type="number"
                      name="salaryMin"
                      placeholder="Min"
                      value={formData.salaryMin}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <span className="text-gray-500">to</span>
                  <div className="flex-grow">
                    <input
                      type="number"
                      name="salaryMax"
                      placeholder="Max"
                      value={formData.salaryMax}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center">
                    <FaClock className="mr-2 text-blue-500" />
                    Work Hours (Weekly)
                  </div>
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex-grow">
                    <input
                      type="number"
                      name="minWorkHours"
                      placeholder="Min"
                      value={formData.minWorkHours}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <span className="text-gray-500">to</span>
                  <div className="flex-grow">
                    <input
                      type="number"
                      name="maxWorkHours"
                      placeholder="Max"
                      value={formData.maxWorkHours}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="experienceLevel">
                  Experience Level
                </label>
                <select
                  id="experienceLevel"
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  {experienceLevels.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="experienceYears">
                  Experience Years (Required)
                </label>
                <input
                  type="number"
                  id="experienceYears"
                  name="experienceYears"
                  value={formData.experienceYears}
                  onChange={handleInputChange}
                  placeholder="e.g., 2"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Technical Skills
              </label>
              <div className="flex items-center space-x-2 mb-3">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  placeholder="e.g., React, Node.js, Python"
                  className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <button 
                  type="button" 
                  onClick={handleSkillAdd}
                  className="flex-shrink-0 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <FaPlus />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.technicalSkills.map((skill, index) => (
                  <div 
                    key={index} 
                    className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
                  >
                    <span className="mr-1">{skill}</span>
                    <button 
                      type="button" 
                      onClick={() => handleSkillRemove(skill)}
                      className="text-blue-600 hover:text-blue-800 focus:outline-none"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Social Skills
              </label>
              <div className="flex items-center space-x-2 mb-3">
                <input
                  type="text"
                  value={socialSkillInput}
                  onChange={(e) => setSocialSkillInput(e.target.value)}
                  onKeyDown={handleSocialSkillKeyDown}
                  placeholder="e.g., Communication, Teamwork, Leadership"
                  className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <button 
                  type="button" 
                  onClick={handleSocialSkillAdd}
                  className="flex-shrink-0 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <FaPlus />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.socialSkills.map((skill, index) => (
                  <div 
                    key={index} 
                    className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full"
                  >
                    <span className="mr-1">{skill}</span>
                    <button 
                      type="button" 
                      onClick={() => handleSocialSkillRemove(skill)}
                      className="text-green-600 hover:text-green-800 focus:outline-none"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-5xl mx-auto my-8">
      {success ? (
        <div className="p-8 text-center">
          <div className="rounded-full bg-green-50 w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-green-600 mb-3">Job Successfully Posted!</h2>
          <p className="text-gray-600 mb-6 text-lg">Your job posting has been successfully created and is now live.</p>
          <p className="text-sm text-gray-500">Redirecting to your job listings...</p>
        </div>
      ) : (
        <div>
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
            <h2 className="text-2xl font-bold text-white">Create New Job Posting</h2>
            <p className="text-blue-100 mt-1">Fill in the details below to create a new job listing</p>
          </div>
          
          <div className="border-b border-gray-200">
            <div className="flex">
              {formTabs.map((tab, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`flex-1 py-4 px-2 text-center transition-colors ${
                    activeTab === index
                      ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span className="hidden md:inline">{tab}</span>
                  <span className="md:hidden">
                    {index === 0 ? 'Basic' : index === 1 ? 'Details' : 'Skills'}
                  </span>
                  <span className={`ml-2 w-6 h-6 inline-flex items-center justify-center rounded-full text-sm ${
                    activeTab > index 
                      ? 'bg-green-100 text-green-600' 
                      : activeTab === index 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-gray-100 text-gray-600'
                  }`}>
                    {activeTab > index ? '✓' : index + 1}
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="p-6">
            {error && (
              <div className="bg-red-50 text-red-700 p-4 mb-6 rounded-lg flex items-start">
                <div className="mr-3 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Error</h3>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {renderTab()}
              
              <div className="mt-8 flex items-center justify-between pt-5 border-t border-gray-200">
                <button
                  type="button"
                  onClick={goToPrevTab}
                  disabled={activeTab === 0}
                  className={`px-5 py-2.5 rounded-lg transition-colors ${
                    activeTab === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Previous
                </button>
                
                {activeTab === formTabs.length - 1 ? (
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="mr-2" />
                        Post Job
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={goToNextTab}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    Next
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 