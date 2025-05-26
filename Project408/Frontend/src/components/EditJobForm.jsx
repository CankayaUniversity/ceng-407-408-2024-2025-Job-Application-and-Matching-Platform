import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

export default function EditJobForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    deadline: '',
    minSalary: '',
    maxSalary: '',
    minWorkHours: '',
    maxWorkHours: '',
    experienceYears: '',
    workType: 'ONSITE', // Default values
    employmentType: 'FULL_TIME',
    countryId: 1, // Default country ID - this should be dynamic
    degreeType: 'BACHELOR',
    jobExperience: 'ENTRY',
    militaryStatus: 'NOT_APPLICABLE',
    technicalSkills: [],
    socialSkills: []
  });

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:9090/api/job-adv/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch job details');
      }

      const data = await response.json();
      
      // Format and set form data
      setFormData({
        title: data.title || '',
        description: data.description || '',
        location: data.location || '',
        deadline: data.deadline ? new Date(data.deadline).toISOString().split('T')[0] : '',
        minSalary: data.minSalary || '',
        maxSalary: data.maxSalary || '',
        minWorkHours: data.jobCondition?.minWorkHours || '',
        maxWorkHours: data.jobCondition?.maxWorkHours || '',
        experienceYears: data.jobQualification?.experienceYears || '',
        workType: data.jobCondition?.workType || 'ONSITE',
        employmentType: data.jobCondition?.employmentType || 'FULL_TIME',
        countryId: data.jobCondition?.country?.id || 1,
        degreeType: data.jobQualification?.degreeType || 'BACHELOR',
        jobExperience: data.jobQualification?.jobExperience || 'ENTRY',
        militaryStatus: data.jobQualification?.militaryStatus || 'NOT_APPLICABLE',
        technicalSkills: data.jobQualification?.technicalSkills?.map(skill => skill.positionName) || [],
        socialSkills: data.jobQualification?.socialSkills?.map(skill => skill.positionName) || []
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillChange = (e, index, type) => {
    const value = e.target.value;
    setFormData(prev => {
      const skills = [...prev[type]];
      skills[index] = value;
      return {
        ...prev,
        [type]: skills
      };
    });
  };

  const addSkill = (type) => {
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], '']
    }));
  };

  const removeSkill = (index, type) => {
    setFormData(prev => {
      const skills = [...prev[type]];
      skills.splice(index, 1);
      return {
        ...prev,
        [type]: skills
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:9090/api/job-adv/update/${id}`, {
        method: 'PUT',
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
        setSuccess(true);
        setTimeout(() => {
          navigate('/employer/jobs');
        }, 2000);
      } else {
        const errorData = await response.text();
        setError(errorData || 'Failed to update job posting');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Edit Job Posting</h1>
        <button
          onClick={() => navigate('/employer/jobs')}
          className="inline-flex items-center text-gray-700 hover:text-gray-900"
        >
          <FaArrowLeft className="mr-2" /> Back to Jobs
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 mb-6 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-600 p-4 mb-6 rounded-md">
          Job posting updated successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
              Job Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="location">
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              required
              value={formData.location}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
            Job Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            required
            value={formData.description}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        {/* Salary and Work Hours */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="minSalary">
              Min Salary (USD)
            </label>
            <input
              id="minSalary"
              name="minSalary"
              type="number"
              value={formData.minSalary}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="maxSalary">
              Max Salary (USD)
            </label>
            <input
              id="maxSalary"
              name="maxSalary"
              type="number"
              value={formData.maxSalary}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="minWorkHours">
              Min Work Hours (Weekly)
            </label>
            <input
              id="minWorkHours"
              name="minWorkHours"
              type="number"
              value={formData.minWorkHours}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="maxWorkHours">
              Max Work Hours (Weekly)
            </label>
            <input
              id="maxWorkHours"
              name="maxWorkHours"
              type="number"
              value={formData.maxWorkHours}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Job Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="workType">
              Work Type
            </label>
            <select
              id="workType"
              name="workType"
              value={formData.workType}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="ONSITE">On-site</option>
              <option value="REMOTE">Remote</option>
              <option value="HYBRID">Hybrid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="employmentType">
              Employment Type
            </label>
            <select
              id="employmentType"
              name="employmentType"
              value={formData.employmentType}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
              <option value="TEMPORARY">Temporary</option>
              <option value="VOLUNTEER">Volunteer</option>
              <option value="INTERNSHIP">Internship</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="experienceYears">
              Required Experience (Years)
            </label>
            <input
              id="experienceYears"
              name="experienceYears"
              type="number"
              value={formData.experienceYears}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="deadline">
              Application Deadline
            </label>
            <input
              id="deadline"
              name="deadline"
              type="date"
              required
              value={formData.deadline}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Technical Skills */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Technical Skills
            </label>
            <button
              type="button"
              onClick={() => addSkill('technicalSkills')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              + Add Skill
            </button>
          </div>
          
          {formData.technicalSkills.map((skill, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={skill}
                onChange={(e) => handleSkillChange(e, index, 'technicalSkills')}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="e.g. React, Java, Python"
              />
              <button
                type="button"
                onClick={() => removeSkill(index, 'technicalSkills')}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Social Skills */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Social Skills
            </label>
            <button
              type="button"
              onClick={() => addSkill('socialSkills')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              + Add Skill
            </button>
          </div>
          
          {formData.socialSkills.map((skill, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={skill}
                onChange={(e) => handleSkillChange(e, index, 'socialSkills')}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="e.g. Communication, Teamwork"
              />
              <button
                type="button"
                onClick={() => removeSkill(index, 'socialSkills')}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/employer/jobs')}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            {submitting ? 'Updating...' : 'Update Job Posting'}
          </button>
        </div>
      </form>
    </div>
  );
} 