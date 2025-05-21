import React, { useEffect, useState } from 'react';
import { getRecommendedJobs } from './RecommendationService';

const RecommendedJobs = () => {
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const candidateId = localStorage.getItem('id');
        const token = localStorage.getItem('token');
        
        // Fetch recommendations
        const recommendations = await getRecommendedJobs(candidateId, 5);
        setRecommendedJobs(recommendations);
        
        // Fetch applications
        if (token) {
          const response = await fetch('http://localhost:9090/candidate/myApplications', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await response.json();
          setApplications(data);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching job recommendations:', err);
        setError('Failed to load recommendations');
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const handleApply = async (jobId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage("Please log in.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:9090/candidate/applyJobAdv/${jobId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const statusResponse = await fetch('http://localhost:9090/candidate/myApplications', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const statusData = await statusResponse.json();
        setApplications(statusData);

        setMessage("Application successful!");
        setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
      } else {
        const errorText = await res.text();
        setMessage("Application failed! " + errorText);
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      setMessage("An error occurred.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const buttonStyle = {
    padding: '8px 12px',
    backgroundColor: '#151717',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  };

  const JobCard = ({ job }) => {
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    
    // Check if job is already applied for
    const application = applications.find(app => app.jobAdvId === job.id);
    const status = application ? application.status : null;

    return (
      <div
        style={{
          border: '1px solid #bdc3c7',
          borderRadius: '8px',
          padding: '16px',
          backgroundColor: '#ffffff',
          color: '#000000',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          cursor: 'pointer',
          textAlign: 'center',
          transform: 'scale(1)',
          width: 'calc(33.33% - 16px)',
          marginBottom: '16px',
          height: isAccordionOpen ? 'auto' : '250px',
          overflowY: 'auto',
          position: 'relative'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <div style={{ display: 'flex', position: 'absolute', top: '10px', right: '10px' }}>
          <span style={{ 
            backgroundColor: '#4caf50', 
            color: 'white', 
            padding: '4px 8px', 
            borderRadius: '4px', 
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            AI Recommended
          </span>
        </div>

        <div>
          <h3 style={{ margin: '0', fontSize: '20px', fontWeight: 'bold' }}>
            {job.title || job.description}
          </h3>
          <p style={{ fontSize: '16px', color: '#383e3e', marginBottom: '5px' }}>
            🏢 {job.companyName}
          </p>
          <p style={{ fontSize: '16px', color: '#383e3e', marginBottom: '5px' }}>
            💼 {job.workType || "On-site"}
          </p>
          <p style={{ fontSize: '16px', color: '#383e3e', marginBottom: '5px' }}>
            💰 {job.salaryRange || (job.minSalary && job.maxSalary ? `${job.minSalary} ₺ - ${job.maxSalary} ₺` : "Competitive")}
          </p>
          <p style={{ fontSize: '16px', color: '#383e3e', marginBottom: '5px' }}>
            🌍 {job.location || job.city || "Not specified"}
          </p>

          {/* Application Status */}
          {status && (
            <p style={{ marginTop: '8px', fontWeight: 'bold', color: '#cc304b' }}>
              Application Status: {status}
            </p>
          )}
        </div>

        <div style={{ marginTop: '10px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button onClick={() => setIsAccordionOpen(!isAccordionOpen)} style={buttonStyle}>
            {isAccordionOpen ? '🔽 Hide Details' : '🔼 Show Details'}
          </button>
          {status ? (
            <button 
              style={{...buttonStyle, backgroundColor: '#888', cursor: 'default'}}
              disabled
            >
              Already Applied
            </button>
          ) : (
            <button 
              onClick={() => handleApply(job.id)} 
              style={{...buttonStyle, backgroundColor: '#1a73e8'}}
            >
              🚀 Apply Now
            </button>
          )}
        </div>

        {isAccordionOpen && (
          <div style={{ marginTop: '20px', lineHeight: '1.4', fontSize: '14px', textAlign: 'left' }}>
            <p><strong>⭐ Match Score:</strong> {job.matchScore ? `${Math.round(job.matchScore * 100)}%` : '85%'}</p>
            <p><strong>🕒 Hours:</strong> {job.minWorkHours || job.minWorkHour} - {job.maxWorkHours || job.maxWorkHour} hours/week</p>
            <p><strong>📅 Deadline:</strong> {job.lastDate ? new Date(job.lastDate).toLocaleDateString() : 'Open until filled'}</p>
            <p><strong>🧳 Travel Required:</strong> {job.travelRest ? "Yes" : "No"}</p>
            <p><strong>🎁 Benefits:</strong> {job.benefitTypes?.join(', ') || "Not specified"}</p>
            <p><strong>🗣️ Languages:</strong> {job.languageProficiencies?.join(', ') || "Not specified"}</p>
            <p><strong>🤝 Social Skills:</strong> {job.socialSkills?.join(', ') || "Not specified"}</p>
            <p><strong>🧠 Technical Skills:</strong> {job.technicalSkills?.join(', ') || "Not specified"}</p>
            <p><strong>📌 Position Types:</strong> {job.positionTypes?.join(', ') || "Not specified"}</p>
            <p><strong>🌟 Special Positions:</strong> {job.customJobPositions?.join(', ') || "None"}</p>
            
            <div style={{ marginTop: '15px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 'bold' }}>Job Description</h4>
              <p>{job.description || "No description provided."}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Loading recommendations...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>{error}</div>;
  }

  return (
    <div style={{ width: '100%' }}>
      {message && <div style={{ 
        padding: '10px', 
        backgroundColor: message.includes('failed') ? '#ffebee' : '#e8f5e9', 
        color: message.includes('failed') ? '#c62828' : '#2e7d32',
        borderRadius: '4px',
        marginBottom: '20px',
        textAlign: 'center',
        fontWeight: 'bold'
      }}>
        {message}
      </div>}
      
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
        Recommended for You <span role="img" aria-label="ai">🤖</span>
      </h2>
      
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        justifyContent: 'center',
      }}>
        {recommendedJobs.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '20px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px',
            margin: '20px 0',
            width: '100%'
          }}>
            <h3 style={{ color: '#555' }}>No recommendations available yet</h3>
            <p>As you apply to more jobs and update your profile, we'll provide personalized job recommendations.</p>
          </div>
        ) : (
          recommendedJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))
        )}
      </div>
    </div>
  );
};

export default RecommendedJobs; 