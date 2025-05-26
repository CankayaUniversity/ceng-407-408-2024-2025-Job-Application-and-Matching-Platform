import React, { useEffect, useState } from 'react';
import CreateJobForm from './components/CreateJobForm';

const EmployerDashboard = () => {
  const [candidate, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [message, setMessage] = useState('');
  const [filters, setFilters] = useState({
    position: '',
    workType: '',
    minSalary: '',
    education: '',
    active: true // Default to show only active users
  });


  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = (activeStatus = true) => {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    if (!token) {
      console.log('User not logged in');
      return;
    }

    fetch(`http://localhost:9090/employer/getCandidates?active=${activeStatus}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          setCandidates(data);
          setFilteredCandidates(data);
        })
        .catch(err => console.error("Candidates", err));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };

  const handleActivityChange = (e) => {
    const isActive = e.target.value === 'active';
    setFilters(prevFilters => ({ ...prevFilters, active: isActive }));
    fetchCandidates(isActive); // Fetch candidates with the selected activity status
  };

  const filterCandidates = () => {
    let filtered = candidate;

    if (filters.position) {
      filtered = filtered.filter(candidate =>
          candidate.jobPreferences?.preferredPositions?.some(position =>
              position.positionType?.toLowerCase().includes(filters.position.toLowerCase())
          )
      );
    }

    if (filters.workType) {
      filtered = filtered.filter(candidate =>
          candidate.jobPreferences?.preferredWorkType?.toLowerCase().includes(filters.workType.toLowerCase())
      );
    }

    if (filters.minSalary) {
      filtered = filtered.filter(candidate =>
          candidate.jobPreferences?.expectedSalary >= parseInt(filters.minSalary)
      );
    }


    if (filters.education) {
      filtered = filtered.filter(candidate =>
          candidate.education?.degreeType?.toLowerCase().includes(filters.education.toLowerCase())
      );
    }

    setFilteredCandidates(filtered);
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

  const inputStyle = {
    padding: '8px 12px',
    border: '1px solid #bdc3c7',
    borderRadius: '8px',
    fontSize: '12px',
    width: '180px',
    backgroundColor: '#fdfdfd',
    color: '#100e0e',
  };

  const selectStyle = {
    ...inputStyle,
    appearance: 'menulist'
  };

  const JobCard = ({ candidate }) => {
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);

    return (
        <div
            style={{
              border: '1px solid #bdc3c7',
              borderRadius: '8px',
              padding: '10px',
              backgroundColor: '#ffffff',
              color: '#000000',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              textAlign: 'center',
              transform: 'scale(1)',
              width: 'calc(33.33% - 16px)',
              marginBottom: '16px',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <div>
            <h3 style={{ margin: '0', fontSize: '20px', fontWeight: 'bold' }}>
              {candidate?.firstName} - {candidate?.firstName}
            </h3>
            <p style={{ fontSize: '16px', color: '#383e3e', marginBottom: '5px' }}>
              🏢 {candidate?.profileDetails?.aboutMe}
            </p>
            <p style={{ fontSize: '16px', color: '#383e3e', marginBottom: '5px' }}>
              💼 {candidate?.jobPreferences?.preferredWorkType || "Unknown"}
            </p>
            <p style={{ fontSize: '16px', color: '#383e3e', marginBottom: '5px' }}>
              💰 {candidate?.jobPreferences?.expectedSalary} ₺
            </p>
          </div>

          <div style={{ marginTop: '10px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <button onClick={() => setIsAccordionOpen(!isAccordionOpen)} style={buttonStyle}>
              {isAccordionOpen ? '🔽 Hide' : '🔼 Show Details'}
            </button>
          </div>

          {isAccordionOpen && (
              <div style={{ marginTop: '10px', lineHeight: '1.4', fontSize: '14px' }}>
                <p><strong>🕒 Duration:</strong> {candidate?.jobPreferences?.minWorkHour} - {candidate?.jobPreferences?.maxWorkHour} hours/week</p>
                <p><strong>🧳 Travel Permission:</strong> {candidate?.jobPreferences?.canTravel ? "Yes" : "No"}</p>
                <p><strong>🗣️ Languages:</strong> {candidate?.languageProficiency?.map(lang => lang.language).join(', ')}</p>
                <p><strong>🤝 Social Skills:</strong> {candidate?.socialSkills?.map(skill => skill.skillName).join(', ')}</p>
                <p><strong>🧠 Technical Skills:</strong> {candidate?.skills?.map(skill => skill.skillName).join(', ')}</p>
                <p><strong>📌 Position Types:</strong> {candidate?.jobPreferences?.preferredPositions?.map(pos => pos.positionType).filter(Boolean).join(', ')}</p>
                <p><strong>🌟 Custom Positions:</strong> {candidate?.jobPreferences?.preferredPositions?.map(pos => pos.customJobPosition?.positionName).filter(name => name).join(', ')}</p>
                <p><strong>🎓 Education Type:</strong> {candidate?.education?.educationType || "Not specified"}</p>

              </div>
          )}
        </div>
    );
  };

  return (
      <div style={{
        backgroundColor: '#ffffff',
        padding: '20px',
        minHeight: '100vh',
        color: '#000000',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'column',
        maxWidth: '100vw',
        margin: '0 auto',
      }}>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginBottom: '20px',
          marginTop: '20px'
        }}>
          <h2 style={{ textAlign: 'center', fontSize: '30px' }}>Candidates</h2>
          {message && <p style={{ color: '#cc304b', textAlign: 'center', fontSize: '14px' }}>{message}</p>}
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            marginBottom: '16px',
            flexWrap: 'wrap'
          }}>
            <input type="text" name="position" value={filters.position} onChange={handleFilterChange}
                   placeholder="Position" style={inputStyle} />
            <input type="text" name="workType" value={filters.workType} onChange={handleFilterChange}
                   placeholder="Work Type" style={inputStyle} />
            <input type="number" name="minSalary" value={filters.minSalary} onChange={handleFilterChange}
                   placeholder="Expected Salary" style={inputStyle} />
            <input type="text" name="education" value={filters.education} onChange={handleFilterChange}
                   placeholder="Education" style={inputStyle} />
            <select name="activityStatus" onChange={handleActivityChange} style={selectStyle} value={filters.active ? 'active' : 'inactive'}>
              <option value="active">Active Users</option>
              <option value="inactive">All Users (Including Inactive)</option>
            </select>
          </div>
          <div style={{ textAlign: 'center' }}>
            <button onClick={filterCandidates} style={{ ...buttonStyle, marginTop: '8px' }}>Filter</button>
          </div>
        </div>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          width: '100%',
          justifyContent: 'center',
        }}>
          {filteredCandidates.map(candidate => (
              <JobCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      </div>
  );
};

export default EmployerDashboard;
