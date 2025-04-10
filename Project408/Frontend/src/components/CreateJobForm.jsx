import { useState, useEffect } from 'react';
import { FaTimesCircle } from 'react-icons/fa';

export default function CreateJobForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    description: '',
    minSalary: '',
    maxSalary: '',
    deadline: '',
    travelRest: false,
    license: false,
    workType: '',
    employmentType: '',
    countryId: '',
    minWorkHours: '',
    maxWorkHours: '',
    degreeType: '',
    jobExperience: '',
    experienceYears: '',
    militaryStatus: '',
    technicalSkills: [],
    socialSkills: [],
    languageProficiencyIds: [],
    jobPositionIds: []
  });

  const [countries, setCountries] = useState([]);
  const [jobPositions, setJobPositions] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newTechnicalSkill, setNewTechnicalSkill] = useState('');
  const [newSocialSkill, setNewSocialSkill] = useState('');

  // Work Types from the enum
  const workTypes = ['OFFICE', 'REMOTE', 'HYBRID'];
  
  // Employment Types from the enum
  const employmentTypes = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE'];
  
  // Degree Types from the enum
  const degreeTypes = ['HIGH_SCHOOL', 'ASSOCIATE', 'BACHELOR', 'MASTER', 'DOCTORATE', 'NONE'];
  
  // Job Experience from the enum
  const jobExperiences = ['JUNIOR', 'MID_LEVEL', 'SENIOR', 'LEAD', 'MANAGER', 'EXECUTIVE'];
  
  // Military Status from the enum
  const militaryStatuses = ['COMPLETED', 'EXEMPT', 'POSTPONED', 'NOT_APPLICABLE'];

  useEffect(() => {
    // Dummy data for development, would be replaced with real API calls
    setCountries([
      { id: 1, name: 'Turkey' },
      { id: 2, name: 'United States' },
      { id: 3, name: 'Germany' }
    ]);
    
    setJobPositions([
      { id: 1, name: 'Software Developer' },
      { id: 2, name: 'UI/UX Designer' },
      { id: 3, name: 'Project Manager' }
    ]);
    
    setLanguages([
      { id: 1, name: 'English' },
      { id: 2, name: 'Turkish' },
      { id: 3, name: 'German' }
    ]);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectMultiple = (e) => {
    const { name, options } = e.target;
    const selectedValues = Array.from(options)
      .filter(option => option.selected)
      .map(option => parseInt(option.value));
    
    setFormData(prev => ({
      ...prev,
      [name]: selectedValues
    }));
  };

  const addTechnicalSkill = () => {
    if (newTechnicalSkill.trim() !== '') {
      setFormData(prev => ({
        ...prev,
        technicalSkills: [...prev.technicalSkills, newTechnicalSkill.trim()]
      }));
      setNewTechnicalSkill('');
    }
  };

  const removeTechnicalSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      technicalSkills: prev.technicalSkills.filter((_, i) => i !== index)
    }));
  };

  const addSocialSkill = () => {
    if (newSocialSkill.trim() !== '') {
      setFormData(prev => ({
        ...prev,
        socialSkills: [...prev.socialSkills, newSocialSkill.trim()]
      }));
      setNewSocialSkill('');
    }
  };

  const removeSocialSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      socialSkills: prev.socialSkills.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:9090/api/job-adv/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          minSalary: parseFloat(formData.minSalary),
          maxSalary: parseFloat(formData.maxSalary),
          minWorkHours: parseInt(formData.minWorkHours),
          maxWorkHours: parseInt(formData.maxWorkHours),
          experienceYears: parseInt(formData.experienceYears),
          countryId: parseInt(formData.countryId)
        })
      });
      
      if (response.ok) {
        onSuccess?.();
        onClose?.();
      } else {
        const errorData = await response.text();
        setError(errorData || 'Failed to create job posting');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md">
          {error}
        </div>
      )}
      
      <div>
        <h3 className="text-lg font-medium mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Description*
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Describe the job role and responsibilities"
            />
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Positions*
              </label>
              <select
                name="jobPositionIds"
                multiple
                value={formData.jobPositionIds}
                onChange={handleSelectMultiple}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 h-24"
              >
                {jobPositions.map(position => (
                  <option key={position.id} value={position.id}>
                    {position.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Hold Ctrl/Cmd to select multiple positions
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Salary (USD)
                </label>
                <input
                  type="number"
                  name="minSalary"
                  value={formData.minSalary}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="e.g. 50000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Salary (USD)
                </label>
                <input
                  type="number"
                  name="maxSalary"
                  value={formData.maxSalary}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="e.g. 80000"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Job Conditions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Work Type*
            </label>
            <select
              name="workType"
              value={formData.workType}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Select work type</option>
              {workTypes.map(type => (
                <option key={type} value={type}>
                  {type.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employment Type*
            </label>
            <select
              name="employmentType"
              value={formData.employmentType}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Select employment type</option>
              {employmentTypes.map(type => (
                <option key={type} value={type}>
                  {type.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country*
            </label>
            <select
              name="countryId"
              value={formData.countryId}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Select country</option>
              {countries.map(country => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Work Hours
              </label>
              <input
                type="number"
                name="minWorkHours"
                value={formData.minWorkHours}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="e.g. 20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Work Hours
              </label>
              <input
                type="number"
                name="maxWorkHours"
                value={formData.maxWorkHours}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="e.g. 40"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deadline
            </label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="travelRest"
                name="travelRest"
                checked={formData.travelRest}
                onChange={handleChange}
                className="h-4 w-4 border-gray-300 rounded text-blue-600"
              />
              <label htmlFor="travelRest" className="ml-2 text-sm text-gray-700">
                Travel Required
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="license"
                name="license"
                checked={formData.license}
                onChange={handleChange}
                className="h-4 w-4 border-gray-300 rounded text-blue-600"
              />
              <label htmlFor="license" className="ml-2 text-sm text-gray-700">
                License Required
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Qualifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Degree Type
            </label>
            <select
              name="degreeType"
              value={formData.degreeType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Select degree type</option>
              {degreeTypes.map(type => (
                <option key={type} value={type}>
                  {type.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Experience
            </label>
            <select
              name="jobExperience"
              value={formData.jobExperience}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Select experience level</option>
              {jobExperiences.map(exp => (
                <option key={exp} value={exp}>
                  {exp.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Years of Experience
            </label>
            <input
              type="number"
              name="experienceYears"
              value={formData.experienceYears}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="e.g. 3"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Military Status
            </label>
            <select
              name="militaryStatus"
              value={formData.militaryStatus}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Select military status</option>
              {militaryStatuses.map(status => (
                <option key={status} value={status}>
                  {status.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Languages
            </label>
            <select
              name="languageProficiencyIds"
              multiple
              value={formData.languageProficiencyIds}
              onChange={handleSelectMultiple}
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-20"
            >
              {languages.map(lang => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Hold Ctrl/Cmd to select multiple languages
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Technical Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Technical Skills
          </label>
          <div className="flex mb-2">
            <input
              type="text"
              value={newTechnicalSkill}
              onChange={(e) => setNewTechnicalSkill(e.target.value)}
              className="flex-1 border border-gray-300 rounded-l-md px-3 py-2"
              placeholder="e.g. Java"
            />
            <button
              type="button"
              onClick={addTechnicalSkill}
              className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.technicalSkills.map((skill, index) => (
              <div key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center">
                {skill}
                <button
                  type="button"
                  onClick={() => removeTechnicalSkill(index)}
                  className="ml-2 text-blue-500 hover:text-blue-700"
                >
                  <FaTimesCircle />
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Social Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Social Skills
          </label>
          <div className="flex mb-2">
            <input
              type="text"
              value={newSocialSkill}
              onChange={(e) => setNewSocialSkill(e.target.value)}
              className="flex-1 border border-gray-300 rounded-l-md px-3 py-2"
              placeholder="e.g. Team Work"
            />
            <button
              type="button"
              onClick={addSocialSkill}
              className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.socialSkills.map((skill, index) => (
              <div key={index} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center">
                {skill}
                <button
                  type="button"
                  onClick={() => removeSocialSkill(index)}
                  className="ml-2 text-green-500 hover:text-green-700"
                >
                  <FaTimesCircle />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button 
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          disabled={loading}
        >
          Cancel
        </button>
        <button 
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Job'}
        </button>
      </div>
    </form>
  );
} 