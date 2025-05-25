import React, { useEffect, useState } from 'react';
import { getRecommendedJobs } from './RecommendationService';
import {BriefcaseIcon, ClipboardDocumentCheckIcon} from "@heroicons/react/24/outline/index.js";
import {FlagIcon} from "@heroicons/react/16/solid/index.js";

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
        console.log(recommendations)

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
              padding: '10px',
              backgroundColor: '#ffffff',
              color: '#000000',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              textAlign: 'center',
              transform: 'scale(1)',
              width: 'calc(33.33% - 16px)',
              marginBottom: '16px',
              height: isAccordionOpen ? '700px' : '550px',
              overflowY: 'auto',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <div style={{display: 'flex', position: 'absolute', top: '10px', right: '10px'}}>
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


          <div
              style={{backgroundColor: "#f8f9f9", borderRadius: "15px", padding: "10px"}}
              className="w-full bg-gray-100 p-4 rounded-lg">
            {/* İç Beyaz Kutu */}
            <div style={{borderRadius: "15px", padding: "10px"}}
                 className="bg-white p-8 rounded-lg space-y-6 shadow-md">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BriefcaseIcon
                        className="text-blue-600"
                        style={{width: '20px', height: '20px'}}
                    />
                    {job?.companyName || '-'}
                  </div>

                  {/*/!* Report butonu *!/*/}
                  {/*<button*/}
                  {/*    onClick={() => setReportJobId(job?.id)}*/}
                  {/*    title="Report this job"*/}
                  {/*    style={{*/}
                  {/*      backgroundColor: '#8B0000',*/}
                  {/*      borderColor: '#5e0000',*/}
                  {/*      color: 'white',*/}
                  {/*      padding: '6px 10px',*/}
                  {/*      borderRadius: '4px',*/}
                  {/*      fontSize: '14px',*/}
                  {/*      display: 'flex',*/}
                  {/*      alignItems: 'center',*/}
                  {/*      gap: '4px',*/}
                  {/*    }}*/}
                  {/*>*/}
                  {/*  <FlagIcon style={{width: '16px', height: '16px'}}/>*/}
                  {/*  <span className="hidden sm:inline">Report</span>*/}
                  {/*</button>*/}

                </h3>
                <div className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">

                  <p className="text-sm">
                                    <span
                                        className="font-medium text-gray-700"> <strong> Description: </strong> </span>{' '}
                    <span
                        className="text-gray-600">{job?.description || '-'}</span>
                  </p>
                  <p className="text-sm">
                                    <span
                                        className="font-medium text-gray-700"> <strong>Job Position: </strong> </span>{' '}<span
                      className="text-gray-600">{
                    job.jobPositions?.[0]?.positionType === 'OTHER'
                        ? job.jobPositions?.[0]?.customJobPosition?.positionName || '-'
                        : job.jobPositions?.[0]?.positionType
                        ?.replaceAll("_", " ")
                        ?.toLowerCase()
                        ?.replace(/\b\w/g, c => c.toUpperCase()) || '-'
                  }
                                    </span>
                  </p>


                  <p className="text-sm">
                                    <span
                                        className="font-medium text-gray-700"> <strong> Salary Range: </strong> </span>{' '}
                    <span
                        className="text-gray-600">{job?.minSalary} - {job?.maxSalary}</span>
                  </p>
                  <p className="text-sm">
                                    <span
                                        className="font-medium text-gray-700"> <strong> Last Date: </strong> </span>{' '}
                    <span
                        className="text-gray-600">{job?.lastDate || '-'}</span>
                  </p>

                  <p className="text-sm">
                                    <span
                                        className="font-medium text-gray-700"><strong> Travel Rest: </strong> </span>{' '}
                    <span
                        className="text-gray-600">{job.travelRest ? 'Yes' : 'No'}</span>
                  </p>
                  <p className="text-sm">
                                    <span
                                        className="font-medium text-gray-700"><strong>License: </strong></span>{' '}
                    <span
                        className="text-gray-600">{job.license ? 'Yes' : 'No'}</span>
                  </p>

                </div>
              </div>
            </div>
          </div>

          <div style={{
            marginTop: '10px',
            display: 'flex',
            gap: '8px',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <button
                onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                style={buttonStyle}
            >
              {isAccordionOpen ? '🔽 Hide' : '🔼 Show Details'}
            </button>

            <span style={{
              padding: '8px 12px',
              backgroundColor: status === 'PENDING' ? '#ffc107' : (status === 'ACCEPTED' || status === 'INTERVIEW' ? '#28a745' : '#dc3545'),
              color: status === 'PENDING' ? 'black' : 'white',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
                        {status ? status.replace("_", " ") : 'Not Applied'}
                    </span>
          </div>

          {isAccordionOpen && (
              <div style={{marginTop: '10px', lineHeight: '1.4', fontSize: '14px'}}>
                <div
                    style={{backgroundColor: "#f8f9f9", borderRadius: "15px", padding: "10px"}}
                    className="w-full bg-gray-100 p-4 rounded-lg">
                  {/* İç Beyaz Kutu */}
                  <div style={{borderRadius: "15px", padding: "10px"}}
                       className="bg-white p-8 rounded-lg space-y-6 shadow-md">

                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <ClipboardDocumentCheckIcon className="text-blue-600"
                                                    style={{width: '20px', height: '20px'}}/>Job
                        Conditions</h3>
                      <div
                          className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                        <p className="text-sm">
                                            <span
                                                className="font-medium text-gray-700"><strong>Work Type: </strong></span>{' '}
                          <span
                              className="text-gray-600">{
                              job.workType
                                  ?.replaceAll("_", " ")
                                  ?.toLowerCase()
                                  ?.replace(/\b\w/g, c => c.toUpperCase()) || '-'}</span>
                        </p>
                        <p className="text-sm">
                                            <span
                                                className="font-medium text-gray-700"><strong>Employment Type: </strong></span>{' '}
                          <span
                              className="text-gray-600">{job.employmentType?.replaceAll("_", " ")
                              ?.toLowerCase()
                              ?.replace(/\b\w/g, c => c.toUpperCase()) || '-'}</span>
                        </p>

                        <p className="text-sm">
                                            <span
                                                className="font-medium text-gray-700"><strong>Country: </strong></span>{' '}
                          <span className="text-gray-600">{job?.country || '-'}</span>
                        </p>
                        <p className="text-sm">
                                            <span
                                                className="font-medium text-gray-700"><strong>City: </strong></span>{' '}
                          <span className="text-gray-600">{job?.city || '-'}</span>
                        </p>


                        <p className="text-sm">
                                            <span
                                                className="font-medium text-gray-700"><strong>Work Hours: </strong></span>{' '}
                          <span
                              className="text-gray-600">{job.minWorkHours} - {job.maxWorkHours}</span>
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <ClipboardDocumentCheckIcon className="text-blue-600"
                                                    style={{width: '20px', height: '20px'}}/>Job
                        Qualification
                      </h3>
                      <div
                          className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                        <p className="text-sm">
                                            <span
                                                className="font-medium text-gray-700"><strong>Degree Type: </strong></span>{' '}
                          <span
                              className="text-gray-600">{job.degreeType?.replaceAll("_", " ")
                              ?.toLowerCase()
                              ?.replace(/\b\w/g, c => c.toUpperCase()) || '-'}</span>
                        </p>
                        <p className="text-sm">
                                            <span
                                                className="font-medium text-gray-700"><strong>Job Experience: </strong></span>{' '}
                          <span
                              className="text-gray-600">{job.jobExperience?.replaceAll("_", " ")
                              ?.toLowerCase()
                              ?.replace(/\b\w/g, c => c.toUpperCase()) || '-'}</span>
                        </p>
                        <p className="text-sm">
                                            <span
                                                className="font-medium text-gray-700"><strong>Experience Years: </strong></span>{' '}
                          <span
                              className="text-gray-600">{job.experienceYears || '-'}</span>
                        </p>
                        <p className="text-sm">
                                            <span
                                                className="font-medium text-gray-700"><strong>Military Status: </strong></span>{' '}
                          <span
                              className="text-gray-600">{job.militaryStatus?.replaceAll("_", " ")
                              ?.toLowerCase()
                              ?.replace(/\b\w/g, c => c.toUpperCase()) || '-'}</span>
                        </p>

                      </div>
                    </div>


                    <div>
                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <BriefcaseIcon className="text-purple-600"
                                         style={{width: '20px', height: '20px'}}
                          />
                          Benefits
                        </h3>

                        {job.benefitTypes && job.benefitTypes?.length > 0 ? (
                            job.benefitTypes?.map((benefit, idx) => (
                                <div key={idx}
                                     className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                                  <p><strong>Benefit
                                    Type: </strong> {benefit.benefitType || '-'}
                                  </p>
                                  <p>
                                    <strong>Description: </strong> {benefit.description || '-'}
                                  </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No Benefits added.</p>
                        )}
                      </div>


                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <BriefcaseIcon className="text-purple-600"
                                         style={{width: '20px', height: '20px'}}
                          />
                          Technical Skills
                        </h3>

                        {job.technicalSkills && job.technicalSkills.length > 0 ? (
                            job.technicalSkills.map((technicalSkills, idx) => (
                                <div key={idx}
                                     className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                                  <p><strong>Position
                                    Name: </strong> {technicalSkills.positionName || '-'}
                                  </p>
                                  <p>
                                    <strong>Skill
                                      Level: </strong> {technicalSkills.skillLevel || '-'}
                                  </p>
                                  <p>
                                    <strong>Description: </strong> {technicalSkills.description || '-'}
                                  </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No Technical Skills added.</p>
                        )}
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <BriefcaseIcon className="text-purple-600"
                                         style={{width: '20px', height: '20px'}}
                          />
                          Social Skills
                        </h3>

                        {job.socialSkills && job.socialSkills.length > 0 ? (
                            job.socialSkills.map((socialSkills, idx) => (
                                <div key={idx}
                                     className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                                  <p><strong>Position
                                    Name: </strong> {socialSkills.positionName || '-'}
                                  </p>
                                  <p>
                                    <strong>Skill
                                      Level: </strong> {socialSkills.skillLevel || '-'}
                                  </p>
                                  <p>
                                    <strong>Description: </strong> {socialSkills.description || '-'}
                                  </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No Social Skills added.</p>
                        )}
                      </div>

                      {/* Languages */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <BriefcaseIcon className="text-purple-600"
                                         style={{width: '20px', height: '20px'}}
                          />
                          Language Proficiency
                        </h3>

                        {job.languageProficiencies && job.languageProficiencies.length > 0 ? (
                            job.languageProficiencies.map((languageProficiency, idx) => (
                                <div key={idx}
                                     className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                                  <p><strong>Reading
                                    Level: </strong> {languageProficiency.readingLevel || '-'}
                                  </p>
                                  <p><strong>Writing
                                    Level: </strong> {languageProficiency.writingLevel || '-'}
                                  </p>
                                  <p><strong>Speaking
                                    Level: </strong> {languageProficiency.speakingLevel || '-'}
                                  </p>
                                  <p><strong>Listening
                                    Level: </strong> {languageProficiency.listeningLevel || '-'}
                                  </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No Language added.</p>
                        )}
                      </div>


                    </div>


                  </div>
                </div>

                {status ? (
                    <p style={{marginTop: '8px', fontWeight: 'bold', color: '#cc304b'}}>
                      Application Status: {status}
                    </p>
                ) : (
                    <button
                        onClick={() => handleApply(job.id)}
                        style={{...buttonStyle, marginTop: '12px'}}
                    >
                      🚀 Apply
                    </button>

                )}
              </div>
          )}
        </div>
    );
  };

  if (loading) {
    return <div style={{textAlign: 'center', padding: '20px'}}>Loading recommendations...</div>;
  }

  if (error) {
    return <div style={{textAlign: 'center', padding: '20px', color: 'red'}}>{error}</div>;
  }

  return (
      <div style={{width: '100%'}}>
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
        <br/>
        <h2 style={{fontSize: '30px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center'}}>
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
                <h3 style={{color: '#555'}}>No recommendations available yet</h3>
                <p>As you apply to more jobs and update your profile, we'll provide personalized job
                  recommendations.</p>
              </div>
          ) : (
              recommendedJobs.map(job => (
                  <JobCard key={job.id} job={job}/>
              ))
          )}
        </div>
      </div>
  );
};

export default RecommendedJobs;