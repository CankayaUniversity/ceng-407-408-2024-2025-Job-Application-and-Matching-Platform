import React, { useState } from 'react';
import JobSeekerMyJobs from "./JobSeekerMyJobs.jsx";

const EmployerProfile = () => {
  const [selectedSidebar, setSelectedSidebar] = useState('Company Description');
  const [isEditing, setIsEditing] = useState(false);

  const handleSidebarClick = (sidebar) => {
    setSelectedSidebar(sidebar);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const renderContent = () => {
    switch (selectedSidebar) {
      case 'Company Description':
        return (
            <div>
              {isEditing ? (
                  <textarea defaultValue="Enter company description here..." rows="4" style={{ width: '100%' }} />
              ) : (
                  <p>Company Description: This is a description of the company.</p>
              )}
            </div>
        );
      case 'Contact Information':
        return (
            <div>
              {isEditing ? (
                  <textarea defaultValue="Enter contact information here..." rows="4" style={{ width: '100%' }} />
              ) : (
                  <p>Contact Information: Phone number, email, and office address.</p>
              )}
            </div>
        );
      case 'Company Information':
        return (
            <div>
              {isEditing ? (
                  <textarea defaultValue="Enter company information here..." rows="4" style={{ width: '100%' }} />
              ) : (
                  <p>Company Information: Details about the company's history, vision, and mission.</p>
              )}
            </div>
        );
      case 'Company Profile':
        return (
            <div>
              {isEditing ? (
                  <textarea defaultValue="Enter company profile details here..." rows="4" style={{ width: '100%' }} />
              ) : (
                  <p>Company Profile: Overview of the company's culture, values, and workforce.</p>
              )}
            </div>
        );
      default:
        return null;
    }
  };

  return (
      <div style={{ display: 'flex', padding: '20px' }}>
        {/* Sidebar */}
        <div
            style={{
              width: '250px',
              borderRight: '1px solid #ddd',
              paddingRight: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
        >
          <h3>Sidebar Menu</h3>
          {['Company Description', 'Contact Information', 'Company Information', 'Company Profile'].map((sidebar) => (
              <button
                  key={sidebar}
                  onClick={() => handleSidebarClick(sidebar)}
                  style={{
                    padding: '10px',
                    backgroundColor: selectedSidebar === sidebar ? '#151717' : '#ecf0f1',
                    color: selectedSidebar === sidebar ? 'white' : '#2c3e50',
                    border: 'none',
                    borderRadius: '5px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
              >
                {sidebar}
              </button>
          ))}
        </div>

        {/* Content Area */}
        <div
            style={{
              flexGrow: 1,
              padding: '20px',
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
        >
          <h2>{selectedSidebar}</h2>
          <div>{renderContent()}</div>

          {/* Edit/Cancel Buttons */}
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
            {isEditing ? (
                <button
                    onClick={handleCancelClick}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#ecf0f1',
                      color: '#2c3e50',
                      border: 'none',
                      borderRadius: '5px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      marginRight: '10px',
                    }}
                >
                  Cancel
                </button>
            ) : (
                <button
                    onClick={handleEditClick}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#151717',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                    }}
                >
                  Edit
                </button>
            )}
          </div>
        </div>
      </div>
  );
};

export default EmployerProfile;
