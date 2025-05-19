import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {BriefcaseIcon, ClipboardDocumentCheckIcon} from "@heroicons/react/24/outline/index.js";

const ApplicationsPage = () => {
    const [jobAdvs, setJobAdvs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyJobAdvs();
    }, []);

    const fetchMyJobAdvs = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:9090/api/job-adv/my-jobadvs', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });
            setJobAdvs(response.data); // Job ilanlarını state'e yükle
            setLoading(false);
        } catch (error) {
            setError('İlanlar çekilirken hata oluştu.'); // Hata durumunda mesaj göster
            setLoading(false);
        }
    };

    const handleSelectJob = (job) => {
        console.log(job);
        setSelectedJob(job); // Seçilen ilanı set et
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
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    };

    const JobCard = ({ job }) => {
        const isSelected = selectedJob && selectedJob.id === job.id;

        return (
            <div
                style={{
                    border: '1px solid #bdc3c7',
                    borderRadius: '8px',
                    padding: '10px',
                    backgroundColor: isSelected ? '#2c2f34' : '#ecf0f1', // Seçilen kart siyah olacak
                    color: isSelected ? 'white' : '#2c3e50', // Seçilen kartta yazı beyaz olacak
                    cursor: 'pointer',
                    textAlign: 'center',
                    width: '100%',
                    marginBottom: '16px',
                }}
                onClick={() => handleSelectJob(job)} // İlan seçildiğinde detaylar sağda gösterilsin

            >
                <h3 style={{margin: '0', fontSize: '20px', fontWeight: 'bold'}}>{job.description}</h3>
                <p style={{
                    fontSize: '16px',
                    marginBottom: '5px'
                }}>🏢 {job.companyName || "Unknown Company"}</p>
                <p style={{
                    fontSize: '16px',
                    marginBottom: '5px'
                }}>💼 {job.workType || "Not Specified"}</p>
                <p style={{fontSize: '16px', marginBottom: '5px'}}>💰 {job.minSalary} ₺
                    - {job.maxSalary} ₺</p>
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
            flexDirection: 'row',
            maxWidth: '100vw',
            margin: '0 auto',
            overflowY: 'auto',
        }}>
            {/* Left Menu: Job Ad Listings */}
            <div style={{
                width: '300px',
                marginRight: '20px',
                paddingRight: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                borderRight: '2px solid #ccc',
                overflowY: 'auto', // Sol menüde taşan içeriği kaydırılabilir yapar
                maxHeight: '100vh',// İlk çizgi

            }}>
                <h3>My Jobs</h3>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    jobAdvs.map((job) => (
                        <JobCard key={job.id} job={job}/>
                    ))
                )}
                <div className="mt-4">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={() => navigate("/employer/create-job")}
                    >
                        Create Job Advertisement
                    </button>
                </div>
            </div>


            {/* Right Content: Job Details */}
            <div style={{
                flexGrow: 1,
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start', // İçeriği yukarıda tutmak için
            }}>
                {selectedJob ? (
                    <div>
                        <div
                            style={{backgroundColor: "#f8f9f9", borderRadius: "15px", padding: "10px"}}
                            className="w-2/3 bg-gray-100 p-4 rounded-lg">
                            {/* İç Beyaz Kutu */}
                            <div style={{borderRadius: "15px", padding: "10px"}}
                                 className="bg-white p-8 rounded-lg space-y-6 shadow-md">
                                <div>
                                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><BriefcaseIcon
                                        className="text-blue-600" style={{width: '20px', height: '20px'}}/> Job
                                        Advertisement
                                    </h3>
                                    <div className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                                        <p className="text-sm">
                                <span
                                    className="font-medium text-gray-700"> <strong> Job Description: </strong> </span>{' '}<span
                                            className="text-gray-600">{selectedJob?.description || '-'}</span>
                                        </p>

                                        <p className="text-sm">
                                            <span className="font-medium text-gray-700"> <strong>Job Position: </strong> </span>{' '}<span
                                            className="text-gray-600">{
                                            selectedJob.jobPositions?.[0]?.positionType === 'OTHER'
                                                ? selectedJob.jobPositions?.[0]?.customJobPosition?.positionName || '-'
                                                : selectedJob.jobPositions?.[0]?.positionType
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
                                                className="text-gray-600">{selectedJob?.minSalary} - {selectedJob?.maxSalary}</span>
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium text-gray-700"> <strong> Last Date: </strong> </span>{' '}
                                            <span
                                                className="text-gray-600">{selectedJob?.lastDate || '-'}</span>
                                        </p>

                                        <p className="text-sm">
                                            <span className="font-medium text-gray-700"><strong> Travel Rest: </strong> </span>{' '}
                                            <span
                                                className="text-gray-600">{selectedJob.travelRest ? 'Yes' : 'No'}</span>
                                        </p>
                                        <p className="text-sm">
                                            <span
                                                className="font-medium text-gray-700"><strong>License: </strong></span>{' '}
                                            <span
                                                className="text-gray-600">{selectedJob.license ? 'Yes' : 'No'}</span>
                                        </p>

                                    </div>
                                </div>


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
                                                selectedJob.workType
                                                    ?.replaceAll("_", " ")
                                                    ?.toLowerCase()
                                                    ?.replace(/\b\w/g, c => c.toUpperCase()) || '-'}</span>
                                        </p>
                                        <p className="text-sm">
                           <span
                               className="font-medium text-gray-700"><strong>Employment Type: </strong></span>{' '}
                                            <span
                                                className="text-gray-600">{selectedJob.employmentType?.replaceAll("_", " ")
                                                ?.toLowerCase()
                                                ?.replace(/\b\w/g, c => c.toUpperCase()) || '-'}</span>
                                        </p>

                                        <p className="text-sm">
                                            <span
                                                className="font-medium text-gray-700"><strong>Country: </strong></span>{' '}
                                            <span className="text-gray-600">{selectedJob?.country || '-'}</span>
                                        </p>
                                        <p className="text-sm">
                                            <span
                                                className="font-medium text-gray-700"><strong>City: </strong></span>{' '}
                                            <span className="text-gray-600">{selectedJob?.city|| '-'}</span>
                                        </p>


                                        <p className="text-sm">
                          <span
                              className="font-medium text-gray-700"><strong>Work Hours: </strong></span>{' '}
                                            <span
                                                className="text-gray-600">{selectedJob.minWorkHours} - {selectedJob.maxWorkHours}</span>
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
                                                className="text-gray-600">{selectedJob.degreeType?.replaceAll("_", " ")
                                                ?.toLowerCase()
                                                ?.replace(/\b\w/g, c => c.toUpperCase()) || '-'}</span>
                                        </p>
                                        <p className="text-sm">
                           <span
                               className="font-medium text-gray-700"><strong>Job Experience: </strong></span>{' '}
                                            <span
                                                className="text-gray-600">{selectedJob.jobExperience?.replaceAll("_", " ")
                                                ?.toLowerCase()
                                                ?.replace(/\b\w/g, c => c.toUpperCase()) || '-'}</span>
                                        </p>
                                        <p className="text-sm">
                          <span
                              className="font-medium text-gray-700"><strong>Experience Years: </strong></span>{' '}
                                            <span
                                                className="text-gray-600">{selectedJob.experienceYears || '-'}</span>
                                        </p>
                                        <p className="text-sm">
                          <span
                              className="font-medium text-gray-700"><strong>Military Status: </strong></span>{' '}
                                            <span
                                                className="text-gray-600">{selectedJob.militaryStatus?.replaceAll("_", " ")
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

                                        {selectedJob.benefitTypes && selectedJob.benefitTypes?.length > 0 ? (
                                            selectedJob.benefitTypes?.map((benefit, idx) => (
                                                <div key={idx}
                                                     className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                                                    <p><strong>Benefit Type: </strong> {benefit.benefitType || '-'}
                                                    </p>
                                                    <p><strong>Description: </strong> {benefit.description || '-'}</p>
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

                                        {selectedJob.technicalSkills && selectedJob.technicalSkills.length > 0 ? (
                                            selectedJob.technicalSkills.map((technicalSkills, idx) => (
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

                                        {selectedJob.socialSkills && selectedJob.socialSkills.length > 0 ? (
                                            selectedJob.socialSkills.map((socialSkills, idx) => (
                                                <div key={idx}
                                                     className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                                                    <p><strong>Position
                                                        Name: </strong> {socialSkills.positionName || '-'}
                                                    </p>
                                                    <p>
                                                        <strong>Skill Level: </strong> {socialSkills.skillLevel || '-'}
                                                    </p>
                                                    <p><strong>Description: </strong> {socialSkills.description || '-'}
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

                                        {selectedJob.languageProficiencies && selectedJob.languageProficiencies.length > 0 ? (
                                            selectedJob.languageProficiencies.map((languageProficiency, idx) => (
                                                <div key={idx}
                                                     className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                                                    <p><strong>Reading
                                                        Level: </strong> {languageProficiency.readingLevel || '-'}</p>
                                                    <p><strong>Writing
                                                        Level: </strong> {languageProficiency.writingLevel || '-'}</p>
                                                    <p><strong>Speaking
                                                        Level: </strong> {languageProficiency.speakingLevel || '-'}</p>
                                                    <p><strong>Listening
                                                        Level: </strong> {languageProficiency.listeningLevel || '-'}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500">No Language added.</p>
                                        )}
                                    </div>


                                </div>



                            </div>
                        </div>

                        {/* Başvuruları Görüntüle butonu */}
                        <div className="mt-4">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                onClick={() => navigate("/candidates", {state: {selectedJob}})}

                            >
                                View Applications
                            </button>
                        </div>
                    </div>
                ) : (
                    <p style={{color: '#7f8c8d'}}>Select an advertisement, details will be displayed here.</p>
                )}
            </div>
        </div>
    );
};

export default ApplicationsPage;
