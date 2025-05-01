import React, { useState } from 'react';

const SidebarContentPage = () => {
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

export default SidebarContentPage;
TAMAM COK İYİ ŞİMDİ SİDEBARLARIN İÇİNİ SOL TARAFDA Company Information Contact InformationWeb PresenceCompany Description  OLACAK ŞEKİLDE SİDEBAR YERLEŞTİRİR MİSİN VE ONLARI SECİNCE DE SAĞDE GERKLİ İÇERİKLER ÇIKSIN import { useState, useEffect } from 'react';
import { FaEdit, FaSave, FaTimes, FaBuilding, FaPhone, FaGlobe, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

export default function EmployerProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    const id=localStorage.getItem('id');
    if (!token) {
      console.log('User not logged in');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(http://localhost:9090/employer/profile/${id}, {
      headers: {
        'Authorization': Bearer ${token}
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile data');
    }
    const data = await response.json();
    console.log(data)
    setProfile(data);
    setEditedProfile(data);
    setError('');
  } catch (err) {
    setError('Error loading profile: ' + err.message);
  } finally {
    setLoading(false);
  }
};

const handleInputChange = (e) => {
  const { name, value } = e.target;
  setEditedProfile(prev => ({
    ...prev,
    [name]: value
  }));
};

const handleAddressChange = (e) => {
  const { name, value } = e.target;
  setEditedProfile(prev => ({
    ...prev,
    address: {
      ...prev.address,
      [name]: value
    }
  }));
};

const handleSave = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:9090/api/employer/profile', {
      method: 'PUT',
      headers: {
        'Authorization': Bearer ${token},
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editedProfile)
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    const updatedData = await response.json();
    setProfile(updatedData);
    setIsEditing(false);
    setError('');
  } catch (err) {
    setError('Error updating profile: ' + err.message);
  }
};

const handleCancel = () => {
  setEditedProfile(profile);
  setIsEditing(false);
};

if (loading) {
  return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
  );
}

if (!profile) {
  return (
      <div className="text-center py-12 bg-gray-50 rounded-md">
        <p className="text-gray-500">No profile data found</p>
      </div>
  );
}

return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {error && (
          <div className="bg-red-50 text-red-600 p-4 mb-6">
            {error}
          </div>
      )}

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Company Profile</h2>
          {!isEditing ? (
              <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center"
              >
                <FaEdit className="mr-2" /> Edit Profile
              </button>
          ) : (
              <div className="flex space-x-2">
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center"
                >
                  <FaSave className="mr-2" /> Save
                </button>
                <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 flex items-center"
                >
                  <FaTimes className="mr-2" /> Cancel
                </button>
              </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <FaBuilding className="text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-700">Company Information</h3>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                        <input
                            type="text"
                            name="companyName"
                            value={editedProfile.companyName || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                        <input
                            type="text"
                            name="industry"
                            value={editedProfile.industry || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
                        <select
                            name="employeeCount"
                            value={editedProfile.employeeCount || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select company size</option>
                          <option value="1-10">1-10 employees</option>
                          <option value="11-50">11-50 employees</option>
                          <option value="51-200">51-200 employees</option>
                          <option value="201-500">201-500 employees</option>
                          <option value="501-1000">501-1000 employees</option>
                          <option value="1001+">1001+ employees</option>
                        </select>
                      </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">Company Name:</span>{' '}
                        <span className="text-gray-600">{profile.companyName || 'Not specified'}</span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">Industry:</span>{' '}
                        <span className="text-gray-600">{profile.industry || 'Not specified'}</span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">Size:</span>{' '}
                        <span className="text-gray-600">{profile.employeeCount || 'Not specified'}</span>
                      </p>
                    </div>
                )}
              </div>
            </div>

            {/*<div className="mb-6">*/}
            {/*  <div className="flex items-center mb-2">*/}
            {/*    <FaMapMarkerAlt className="text-blue-600 mr-2" />*/}
            {/*    <h3 className="text-lg font-semibold text-gray-700">Address</h3>*/}
            {/*  </div>*/}
            {/*  <div className="bg-gray-50 p-4 rounded-md">*/}
            {/*    {isEditing ? (*/}
            {/*      <div className="space-y-4">*/}
            {/*        <div>*/}
            {/*          <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>*/}
            {/*          <input*/}
            {/*            type="text"*/}
            {/*            name="street"*/}
            {/*            value={editedProfile.address?.street || ''}*/}
            {/*            onChange={handleAddressChange}*/}
            {/*            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"*/}
            {/*          />*/}
            {/*        </div>*/}
            {/*        <div className="grid grid-cols-2 gap-4">*/}
            {/*          <div>*/}
            {/*            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>*/}
            {/*            <input*/}
            {/*              type="text"*/}
            {/*              name="city"*/}
            {/*              value={editedProfile.address?.city || ''}*/}
            {/*              onChange={handleAddressChange}*/}
            {/*              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"*/}
            {/*            />*/}
            {/*          </div>*/}
            {/*          <div>*/}
            {/*            <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>*/}
            {/*            <input*/}
            {/*              type="text"*/}
            {/*              name="zipCode"*/}
            {/*              value={editedProfile.address?.zipCode || ''}*/}
            {/*              onChange={handleAddressChange}*/}
            {/*              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"*/}
            {/*            />*/}
            {/*          </div>*/}
            {/*        </div>*/}
            {/*        <div>*/}
            {/*          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>*/}
            {/*          <input*/}
            {/*            type="text"*/}
            {/*            name="country"*/}
            {/*            value={editedProfile.address?.country || ''}*/}
            {/*            onChange={handleAddressChange}*/}
            {/*            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"*/}
            {/*          />*/}
            {/*        </div>*/}
            {/*      </div>*/}
            {/*    ) : (*/}
            {/*      <div className="space-y-2">*/}
            {/*        <p className="text-sm">*/}
            {/*          <span className="font-medium text-gray-700">Street:</span>{' '}*/}
            {/*          <span className="text-gray-600">{profile.address?.street || 'Not specified'}</span>*/}
            {/*        </p>*/}
            {/*        <p className="text-sm">*/}
            {/*          <span className="font-medium text-gray-700">City:</span>{' '}*/}
            {/*          <span className="text-gray-600">{profile.address?.city || 'Not specified'}</span>*/}
            {/*        </p>*/}
            {/*        <p className="text-sm">*/}
            {/*          <span className="font-medium text-gray-700">Zip Code:</span>{' '}*/}
            {/*          <span className="text-gray-600">{profile.address?.zipCode || 'Not specified'}</span>*/}
            {/*        </p>*/}
            {/*        <p className="text-sm">*/}
            {/*          <span className="font-medium text-gray-700">Country:</span>{' '}*/}
            {/*          <span className="text-gray-600">{profile.address?.country || 'Not specified'}</span>*/}
            {/*        </p>*/}
            {/*      </div>*/}
            {/*    )}*/}
            {/*  </div>*/}
            {/*</div>*/}
          </div>

          <div>
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <FaEnvelope className="text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-700">Contact Information</h3>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={editedProfile.email || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                            type="tel"
                            name="phoneNumber
"
                            value={editedProfile.phoneNumber
                                || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">Email:</span>{' '}
                        <span className="text-gray-600">{profile.email || 'Not specified'}</span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">Phone:</span>{' '}
                        <span className="text-gray-600">{profile.phoneNumber
                            || 'Not specified'}</span>
                      </p>
                    </div>
                )}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center mb-2">
                <FaGlobe className="text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-700">Web Presence</h3>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                        <input
                            type="url"
                            name="website"
                            value={editedProfile.websiteUrl
                                || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                    </div>
                ) : (
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">Website:</span>{' '}
                        {profile.websiteUrl
                            ? (
                                <a href={profile.websiteUrl
                                } target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                  {profile.websiteUrl
                                  }
                                </a>
                            ) : (
                                <span className="text-gray-600">Not specified</span>
                            )}
                      </p>
                    </div>
                )}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-700">Company Description</h3>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                {isEditing ? (
                    <div>
                    <textarea
                        name="vision"
                        value={editedProfile.vision || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        rows="6"
                    ></textarea>
                    </div>
                ) : (
                    <div>
                      <p className="text-sm text-gray-600">
                        {profile.vision || 'No company description provided.'}
                      </p>
                    </div>
                )}
                {isEditing ? (
                    <div>
                    <textarea
                        name="mission"
                        value={editedProfile.mission || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        rows="6"
                    ></textarea>
                    </div>
                ) : (
                    <div>
                      <p className="text-sm text-gray-600">
                        {profile.mission || 'No company description provided.'}
                      </p>
                    </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
);
}