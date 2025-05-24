import React, { useEffect, useState } from 'react';
import { getRecommendedCandidates } from './RecommendationService';
import {useLocation} from "react-router-dom";

const RecommendedCandidates = () => {
    const location = useLocation();
    const jobId = location.state?.jobId;

  const [recommendedCandidates, setRecommendedCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!jobId) {
      setError('No job selected for recommendations');
      setLoading(false);
      return;
    }
    
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const recommendations = await getRecommendedCandidates(jobId, 5);
        setRecommendedCandidates(recommendations);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching candidate recommendations:', err);
        setError('Failed to load recommendations');
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [jobId]);

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

  const CandidateCard = ({ candidate }) => {
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);

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
            {candidate.firstName} {candidate.lastName}
          </h3>
          <p style={{ fontSize: '16px', color: '#383e3e', marginBottom: '5px' }}>
            🏢 {candidate.jobTitle || candidate.profileDetails?.jobTitle || "Professional"}
          </p>
          <p style={{ fontSize: '16px', color: '#383e3e', marginBottom: '5px' }}>
            💼 {candidate.jobPreferences?.preferredWorkType || "Full-time"}
          </p>
          <p style={{ fontSize: '16px', color: '#383e3e', marginBottom: '5px' }}>
            💰 Expected: {candidate.jobPreferences?.expectedSalary || "Negotiable"}
          </p>
        </div>

        <div style={{ marginTop: '10px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button onClick={() => setIsAccordionOpen(!isAccordionOpen)} style={buttonStyle}>
            {isAccordionOpen ? '🔽 Hide Details' : '🔼 Show Details'}
          </button>
          <button 
            onClick={() => window.location.href = `/candidates/${candidate.id}`} 
            style={{...buttonStyle, backgroundColor: '#1a73e8'}}
          >
            View Profile
          </button>
        </div>

        {isAccordionOpen && (
          <div style={{ marginTop: '20px', lineHeight: '1.4', fontSize: '14px', textAlign: 'left' }}>
            <p><strong>⭐ Match Score:</strong> {candidate.matchScore ? `${Math.round(candidate.matchScore * 100)}%` : '85%'}</p>
            <p><strong>🕒 Hours:</strong> {candidate.jobPreferences?.minWorkHour} - {candidate.jobPreferences?.maxWorkHour} hours/week</p>
            <p><strong>🧳 Travel Permission:</strong> {candidate.jobPreferences?.canTravel ? "Yes" : "No"}</p>
            <p><strong>🗣️ Languages:</strong> {candidate.languageProficiency?.map(lang => lang.language).join(', ') || "Not specified"}</p>
            <p><strong>🤝 Social Skills:</strong> {candidate.socialSkills?.map(skill => skill.skillName).join(', ') || "Not specified"}</p>
            <p><strong>🧠 Technical Skills:</strong> {candidate.skills?.map(skill => skill.skillName).join(', ') || "Not specified"}</p>
            <p><strong>📌 Position Types:</strong> {candidate.jobPreferences?.preferredPositions?.map(pos => pos.positionType).filter(Boolean).join(', ') || "Not specified"}</p>
            <p><strong>🌟 Custom Positions:</strong> {candidate.jobPreferences?.preferredPositions?.map(pos => pos.customJobPosition?.positionName).filter(name => name).join(', ') || "None"}</p>
            <p><strong>🎓 Education Type:</strong> {candidate.education?.educationType || "Not specified"}</p>
            
            <div style={{ marginTop: '15px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 'bold' }}>About Candidate</h4>
              <p>{candidate.profileDetails?.aboutMe || "No additional information provided."}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Loading candidate recommendations...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>{error}</div>;
  }

  if (recommendedCandidates.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '20px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h3 style={{ color: '#555' }}>No candidate recommendations available</h3>
        <p>Our AI is still analyzing profiles to find the best matches for this job.</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
        Recommended Candidates <span role="img" aria-label="ai">🤖</span>
      </h2>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        justifyContent: 'center',
      }}>
        {recommendedCandidates.map(candidate => (
          <CandidateCard key={candidate.id} candidate={candidate} />
        ))}
      </div>
    </div>
  );
};

export default RecommendedCandidates; 