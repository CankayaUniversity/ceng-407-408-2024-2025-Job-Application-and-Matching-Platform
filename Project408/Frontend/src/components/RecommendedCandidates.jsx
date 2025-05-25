import React, { useEffect, useState } from 'react';
import { getRecommendedCandidates } from './RecommendationService';
import {useLocation} from "react-router-dom";
import {
    BriefcaseIcon,
    ClipboardDocumentCheckIcon,
    EnvelopeIcon,
    GlobeAltIcon,
    HeartIcon
} from "@heroicons/react/24/outline/index.js";
import {motion} from "framer-motion";

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
                padding: '10px',
                backgroundColor: '#ffffff',
                color: '#000000',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                textAlign: 'center',
                transform: 'scale(1)',
                width: 'calc(33% - 16px)',
                marginBottom: '16px',
                height: isAccordionOpen ? '700px' : '400px',
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
                style={{borderRadius: "15px", padding: "10px"}}
                className="flex max-w-6xl mx-auto rounded-lg overflow-hidden shadow-lg bg-white">

                <div
                    style={{backgroundColor: "#f8f9f9", borderRadius: "15px", padding: "10px"}}
                    className="w-full bg-gray-100 p-4 rounded-lg">
                    {/* İç Beyaz Kutu */}
                    <div style={{borderRadius: "15px", padding: "10px"}}
                         className="bg-white p-8 rounded-lg space-y-6 shadow-md">
                        <div>
                            <div
                                className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm flex items-center space-x-6">
                                {/* Profil Fotoğrafı */}
                                <img
                                    src={`http://localhost:9090${candidate?.profileDetails?.profilePicture}`}
                                    alt="Profile"
                                    style={{width: '120px', height: '120px', objectFit: 'cover'}}
                                    className="rounded-full border-2 border-white"
                                />
                                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                                {/* Bilgi listesi */}
                                <div className="space-y-4 text-md">
                                    <h3>
                                        {candidate?.firstName || '-'} {candidate?.lastName || '-'}
                                    </h3>

                                    <p>
                                        <strong>About
                                            Me:</strong> {candidate?.profileDetails?.aboutMe || '-'}
                                    </p>


                                </div>
                            </div>

                        </div>

                    </div>

                    <div style={{
                        marginTop: '10px',
                        display: 'flex',
                        gap: '8px',
                        justifyContent: 'center'
                    }}>
                        <button onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                                style={buttonStyle}>
                            {isAccordionOpen ? '🔽 Hide' : '🔼 Show Details'}
                        </button>
                    </div>
                </div>


            </div>

            {isAccordionOpen && (

                <div
                    style={{ backgroundColor: "#f8f9f9", borderRadius: "15px", padding: "10px" }}
                    className="w-full bg-gray-100 p-4 rounded-lg">
                    {/* İç Beyaz Kutu */}
                    <div style={{ borderRadius: "15px", padding: "10px" }}
                         className="bg-white p-8 rounded-lg space-y-6 shadow-md">

                        <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <ClipboardDocumentCheckIcon className="text-blue-600"
                                                            style={{
                                                                width: '20px',
                                                                height: '20px'
                                                            }} />
                                Profile Details
                            </h3>
                            <div
                                className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm ">
                                <p>
                                    <strong>Nationality:</strong> {candidate?.profileDetails?.nationality
                                    ?.replaceAll("_", " ")
                                    ?.toLowerCase()
                                    ?.replace(/\b\w/g, c => c.toUpperCase()) || '-'}</p>
                                <p><strong>Birth
                                    Date:</strong> {candidate?.profileDetails?.birthDate || '-'}
                                </p>
                                <p>
                                    <strong>Gender:</strong> {candidate?.profileDetails?.gender
                                    ?.replaceAll("_", " ")
                                    ?.toLowerCase()
                                    ?.replace(/\b\w/g, c => c.toUpperCase()) || '-'}</p>

                                {candidate?.profileDetails?.gender === "MALE" && (
                                    <p><strong>Military
                                        Status:</strong> {candidate?.profileDetails?.militaryStatus?.replaceAll("_", " ")
                                        ?.toLowerCase()
                                        ?.replace(/\b\w/g, c => c.toUpperCase()) || '-'}
                                    </p>
                                )}

                                {candidate?.profileDetails?.militaryStatus === "DEFERRED" && (
                                    <p><strong>Military Deferment
                                        Date:</strong> {candidate?.profileDetails?.militaryDefermentDate || '-'}
                                    </p>
                                )}

                                <p><strong>Disability
                                    Status:</strong> {candidate?.profileDetails?.disabilityStatus?.replaceAll("_", " ")
                                    ?.toLowerCase()
                                    ?.replace(/\b\w/g, c => c.toUpperCase()) || '-'}</p>
                                <p><strong>Marital
                                    Status:</strong> {candidate?.profileDetails?.maritalStatus
                                    ?.replaceAll("_", " ")
                                    ?.toLowerCase()
                                    ?.replace(/\b\w/g, c => c.toUpperCase()) || '-'}</p>

                                <p><strong>Currently
                                    Working:</strong> {candidate?.profileDetails?.currentEmploymentStatus ? 'Yes' : 'No'}
                                </p>
                                <p><strong>Driving
                                    License:</strong> {candidate?.profileDetails?.drivingLicense ? 'Yes' : 'No'}
                                </p>
                                <p><strong>Profile
                                    Privacy:</strong> {candidate?.profileDetails?.isPrivateProfile ? 'Private' : 'Public'}
                                </p>

                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <ClipboardDocumentCheckIcon className="text-blue-600"
                                                            style={{
                                                                width: '20px',
                                                                height: '20px'
                                                            }} />
                                Social Links
                            </h3>
                            <div
                                className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                                <p>
                                    <strong>Github:</strong> {candidate?.socialLinks?.githubUrl || '-'}
                                </p>
                                <p>
                                    <strong>LinkedIn:</strong> {candidate?.socialLinks?.linkedinUrl || '-'}
                                </p>
                                <p>
                                    <strong>Website:</strong> {candidate?.socialLinks?.websiteUrl || '-'}
                                </p>
                                <p>
                                    <strong>Blog:</strong> {candidate?.socialLinks?.blogUrl || '-'}
                                </p>
                                <p><strong>Other
                                    Links:</strong> {candidate?.socialLinks?.otherLinksUrl || '-'}
                                </p>
                                <p><strong>Other Links
                                    Description:</strong> {candidate?.socialLinks?.otherLinksDescription || '-'}
                                </p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <ClipboardDocumentCheckIcon className="text-blue-600"
                                                            style={{
                                                                width: '20px',
                                                                height: '20px'
                                                            }} />
                                Job Preferences
                            </h3>
                            <div
                                className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                                {candidate?.jobPreferences?.preferredPositions && candidate?.jobPreferences?.preferredPositions.length > 0 ? (
                                    <>
                                        <p>
                                            <strong>Preferred Positions:</strong>{' '}
                                            {candidate?.jobPreferences.preferredPositions
                                                .map(pos =>
                                                    pos.positionType
                                                        ? pos.positionType.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
                                                        : pos.customJobPosition?.positionName || '-'
                                                )
                                                .join(', ')}
                                        </p>
                                        <p>
                                            <strong>Preferred Work Type:</strong>{' '}
                                            {candidate?.jobPreferences?.preferredWorkType
                                                ? candidate?.jobPreferences.preferredWorkType.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
                                                : '-'}
                                        </p>
                                        <p>
                                            <strong>Work Hours:</strong>{' '}
                                            {candidate?.jobPreferences?.minWorkHour !== undefined && candidate?.jobPreferences?.maxWorkHour !== undefined
                                                ? `${candidate?.jobPreferences.minWorkHour} - ${candidate?.jobPreferences.maxWorkHour}`
                                                : '-'}
                                        </p>
                                        <p>
                                            <strong>Can Travel:</strong>{' '}
                                            {candidate?.jobPreferences?.canTravel ? 'Yes' : 'No'}
                                        </p>
                                        <p>
                                            <strong>Expected Salary:</strong>{' '}
                                            {candidate?.jobPreferences?.expectedSalary || '-'}
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-gray-500">No job preferences
                                        added.</p>
                                )}
                            </div>
                        </div>


                        {/* Language Proficiency Section */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <GlobeAltIcon className="text-blue-600"
                                              style={{ width: '20px', height: '20px' }} />
                                Language Proficiency
                            </h3>
                            <div
                                className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                                {candidate?.languageProficiency && candidate?.languageProficiency.length > 0 && candidate?.languageProficiency[0].language ? (
                                    candidate?.languageProficiency.map((lang, idx) => (
                                        <div key={idx} className="border-b pb-2 mb-2">
                                            <p>
                                                <strong>Language:</strong> {lang.language || '-'}
                                            </p>
                                            <p>
                                                <strong>Reading:</strong> {lang.readingLevel ? lang.readingLevel.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) : '-'}
                                            </p>
                                            <p>
                                                <strong>Writing:</strong> {lang.writingLevel ? lang.writingLevel.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) : '-'}
                                            </p>
                                            <p>
                                                <strong>Speaking:</strong> {lang.speakingLevel ? lang.speakingLevel.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) : '-'}
                                            </p>
                                            <p>
                                                <strong>Listening:</strong> {lang.listeningLevel ? lang.listeningLevel.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) : '-'}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No language proficiency
                                        added.</p>
                                )}
                            </div>
                        </div>
                        {/* Hobbies Section */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <HeartIcon className="text-blue-600"
                                           style={{ width: '20px', height: '20px' }} />
                                Hobbies
                            </h3>
                            <div
                                className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                                {candidate?.hobbies && candidate?.hobbies.length > 0 && candidate?.hobbies[0].hobbyName ? (
                                    candidate?.hobbies.map((hobby, idx) => (
                                        <div key={idx} className="border-b pb-2 mb-2">
                                            <p>
                                                <strong>Hobby:</strong> {hobby.hobbyName || '-'}
                                            </p>
                                            <p>
                                                <strong>Description:</strong> {hobby.description || '-'}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No hobbies added.</p>
                                )}
                            </div>
                        </div>


                        {/* Education will be added */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <ClipboardDocumentCheckIcon className="text-blue-600"
                                                            style={{
                                                                width: '20px',
                                                                height: '20px'
                                                            }} />
                                Education
                            </h3>

                            <div
                                className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm space-y-4">

                                {/* Associate */}
                                {candidate?.education?.associateDepartment?.name && (
                                    <div>
                                        <h4 className="font-semibold mb-1">Associate
                                            Degree</h4>
                                        <p>
                                            <strong>Department:</strong> {candidate?.education.associateDepartment?.name || '-'}
                                        </p>
                                        <p>
                                            <strong>University:</strong> {candidate?.education.associateDepartment?.university?.name || '-'}
                                        </p>
                                        <p>
                                            <strong>City:</strong> {candidate?.education.associateDepartment?.university?.city?.name || '-'}
                                        </p>
                                        <p><strong>Start
                                            Date:</strong> {candidate?.education.associateStartDate || '-'}
                                        </p>
                                        <p>
                                            <strong>End
                                                Date:</strong> {candidate?.education.associateIsOngoing ? 'Ongoing' : (candidate?.education.associateEndDate || '-')}
                                        </p>
                                    </div>
                                )}


                                {/* Bachelor */}
                                {candidate?.education?.bachelorDepartment?.name && (
                                    <div>
                                        <h4 className="font-semibold mb-1">Bachelor
                                            Degree</h4>
                                        <p>
                                            <strong>Department:</strong> {candidate?.education.bachelorDepartment?.name || '-'}
                                        </p>
                                        <p>
                                            <strong>University:</strong> {candidate?.education.bachelorDepartment?.university?.name || '-'}
                                        </p>
                                        <p>
                                            <strong>City:</strong> {candidate?.education.bachelorDepartment?.university?.city?.name || '-'}
                                        </p>
                                        <p><strong>Start
                                            Date:</strong> {candidate?.education.bachelorStartDate || '-'}
                                        </p>
                                        <p><strong>End
                                            Date:</strong> {candidate?.education.bachelorIsOngoing ? 'Ongoing' : (candidate?.education.bachelorEndDate || '-')}
                                        </p>
                                    </div>
                                )}

                                {/* Master */}
                                {candidate?.education?.masterDepartment?.name && (
                                    <div>
                                        <h4 className="font-semibold mb-1">Master
                                            Degree</h4>
                                        <p>
                                            <strong>Department:</strong> {candidate?.education.masterDepartment?.name || '-'}
                                        </p>
                                        <p>
                                            <strong>University:</strong> {candidate?.education.masterDepartment?.university?.name || '-'}
                                        </p>
                                        <p>
                                            <strong>City:</strong> {candidate?.education.masterDepartment?.university?.city?.name || '-'}
                                        </p>
                                        <p><strong>Start
                                            Date:</strong> {candidate?.education.masterStartDate || '-'}
                                        </p>
                                        <p><strong>End
                                            Date:</strong> {candidate?.education.masterIsOngoing ? 'Ongoing' : (candidate?.education.masterEndDate || '-')}
                                        </p>
                                        <p><strong>Thesis
                                            Title:</strong> {candidate?.education.masterThesisTitle || '-'}
                                        </p>
                                        <p><strong>Thesis
                                            Description:</strong> {candidate?.education.masterThesisDescription || '-'}
                                        </p>
                                        <p><strong>Thesis
                                            URL:</strong> {candidate?.education.masterThesisUrl || '-'}
                                        </p>
                                    </div>
                                )}

                                {/* Doctorate */}
                                {candidate?.education?.doctorateDepartment?.name && (
                                    <div>
                                        <h4 className="font-semibold mb-1">Doctorate
                                            Degree</h4>
                                        <p>
                                            <strong>Department:</strong> {candidate?.education.doctorateDepartment?.name || '-'}
                                        </p>
                                        <p>
                                            <strong>University:</strong> {candidate?.education.doctorateDepartment?.university?.name || '-'}
                                        </p>
                                        <p>
                                            <strong>City:</strong> {candidate?.education.doctorateDepartment?.university?.city?.name || '-'}
                                        </p>
                                        <p><strong>Start
                                            Date:</strong> {candidate?.education.doctorateStartDate || '-'}
                                        </p>
                                        <p><strong>End
                                            Date:</strong> {candidate?.education.doctorateIsOngoing ? 'Ongoing' : (candidate?.education.doctorateEndDate || '-')}
                                        </p>
                                        <p><strong>Thesis
                                            Title:</strong> {candidate?.education.doctorateThesisTitle || '-'}
                                        </p>
                                        <p><strong>Thesis
                                            Description:</strong> {candidate?.education.doctorateThesisDescription || '-'}
                                        </p>
                                        <p><strong>Thesis
                                            URL:</strong> {candidate?.education.doctorateThesisUrl || '-'}
                                        </p>
                                    </div>
                                )}

                                {/* Double Major */}
                                {candidate?.education?.doubleMajorDepartment?.name && (
                                    <div>
                                        <h4 className="font-semibold mb-1">Double
                                            Major</h4>
                                        <p>
                                            <strong>Department:</strong> {candidate?.education.doubleMajorDepartment?.name || '-'}
                                        </p>
                                        <p>
                                            <strong>University:</strong> {candidate?.education.doubleMajorDepartment?.university?.name || '-'}
                                        </p>
                                        <p>
                                            <strong>City:</strong> {candidate?.education.doubleMajorDepartment?.university?.city?.name || '-'}
                                        </p>
                                        <p><strong>Start
                                            Date:</strong> {candidate?.education.doubleMajorStartDate || '-'}
                                        </p>
                                        <p><strong>End
                                            Date:</strong> {candidate?.education.doubleMajorIsOngoing ? 'Ongoing' : (candidate?.education.doubleMajorEndDate || '-')}
                                        </p>
                                    </div>
                                )}

                                {/* Minor */}
                                {candidate?.education?.minorDepartment?.name && (
                                    <div>
                                        <h4 className="font-semibold mb-1">Minor</h4>
                                        <p>
                                            <strong>Department:</strong> {candidate?.education.minorDepartment?.name || '-'}
                                        </p>
                                        <p>
                                            <strong>University:</strong> {candidate?.education.minorDepartment?.university?.name || '-'}
                                        </p>
                                        <p>
                                            <strong>City:</strong> {candidate?.education.minorDepartment?.university?.city?.name || '-'}
                                        </p>
                                        <p><strong>Start
                                            Date:</strong> {candidate?.education.minorStartDate || '-'}
                                        </p>
                                        <p><strong>End
                                            Date:</strong> {candidate?.education.minorIsOngoing ? 'Ongoing' : (candidate?.education.minorEndDate || '-')}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <ClipboardDocumentCheckIcon className="text-blue-600"
                                                            style={{
                                                                width: '20px',
                                                                height: '20px'
                                                            }} />
                                Certifications
                            </h3>
                            <div
                                className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                                {candidate?.certifications?.length > 0 && candidate?.certifications[0].certificationName ? (
                                    candidate?.certifications.map((cert, idx) => (
                                        <div key={idx} className="border-b pb-2 mb-2">
                                            <p><strong>Certification
                                                Name:</strong> {cert.certificationName}
                                            </p>
                                            <p><strong>Issued
                                                By:</strong> {cert.issuedBy || '-'}</p>
                                            <p><strong>Validity
                                                Date:</strong> {cert.certificateValidityDate || '-'}
                                            </p>
                                            <p>
                                                <strong>Certificate Link: </strong>
                                                {cert.certificationUrl ? (
                                                    <a href={cert.certificationUrl}
                                                       target="_blank"
                                                       rel="noopener noreferrer"
                                                       className="text-blue-600 underline">
                                                        View Certificate
                                                    </a>
                                                ) : (
                                                    '-'
                                                )}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No certifications
                                        added.</p>
                                )}
                            </div>
                        </div>

                        {/* Work Experiences */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <BriefcaseIcon className="text-blue-600"
                                               style={{ width: '20px', height: '20px' }} />
                                Work Experiences
                            </h3>
                            <div
                                className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                                {candidate?.workExperiences?.length > 0 && candidate?.workExperiences[0].companyName ? (
                                    candidate?.workExperiences.map((exp, idx) => (
                                        <div key={idx} className="border-b pb-2 mb-2">
                                            <p><strong>Company
                                                Name:</strong> {exp.companyName || '-'}
                                            </p>
                                            <p><strong>Job
                                                Title:</strong> {exp.jobTitle || '-'}
                                            </p>
                                            <p>
                                                <strong>Industry:</strong> {exp.industry || '-'}
                                            </p>
                                            <p><strong>Job
                                                Description:</strong> {exp.jobDescription || '-'}
                                            </p>
                                            <p><strong>Employment
                                                Type:</strong> {exp.employmentType ? exp.employmentType.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) : '-'}
                                            </p>
                                            <p>
                                                <strong>Period:</strong> {exp.startDate || '-'} - {exp.isGoing ? 'Present' : (exp.endDate || '-')}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No work experiences
                                        added.</p>
                                )}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <ClipboardDocumentCheckIcon className="text-blue-600"
                                                            style={{
                                                                width: '20px',
                                                                height: '20px'
                                                            }} />
                                Exams and Achievements
                            </h3>
                            <div
                                className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                                {candidate?.examsAndAchievements?.length > 0 && candidate?.examsAndAchievements[0].examName ? (
                                    candidate?.examsAndAchievements.map((exam, idx) => (
                                        <div key={idx} className="border-b pb-2 mb-2">
                                            <p><strong>Exam
                                                Name:</strong> {exam.examName || '-'}
                                            </p>
                                            <p>
                                                <strong>Year:</strong> {exam.examYear || '-'}
                                            </p>
                                            <p>
                                                <strong>Score:</strong> {exam.examScore || '-'}
                                            </p>
                                            <p>
                                                <strong>Rank:</strong> {exam.examRank || '-'}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No exams or
                                        achievements
                                        added.</p>
                                )}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <ClipboardDocumentCheckIcon className="text-blue-600"
                                                            style={{
                                                                width: '20px',
                                                                height: '20px'
                                                            }} />
                                Uploaded Documents
                            </h3>
                            <div
                                className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                                {candidate?.uploadedDocuments?.length > 0 && candidate?.uploadedDocuments[0].documentName ? (
                                    candidate?.uploadedDocuments.map((doc, idx) => (
                                        <div key={idx} className="border-b pb-2 mb-2">
                                            <p><strong>Document
                                                Name:</strong> {doc.documentName}</p>
                                            <p>
                                                <strong>Type:</strong> {doc.documentType || '-'}
                                            </p>
                                            <p>
                                                <strong>Category:</strong> {doc.documentCategory || '-'}
                                            </p>
                                            <p>
                                                <strong>Document Link:</strong>{' '}
                                                {doc.documentUrl ? (
                                                    <a href={doc.documentUrl}
                                                       target="_blank"
                                                       rel="noopener noreferrer"
                                                       className="text-blue-600 underline">
                                                        View Document
                                                    </a>
                                                ) : (
                                                    '-'
                                                )}
                                            </p>
                                            <p>
                                                <strong>Privacy:</strong> {doc.isPrivate ? 'Private' : 'Public'}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No documents
                                        uploaded.</p>
                                )}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <ClipboardDocumentCheckIcon className="text-blue-600"
                                                            style={{
                                                                width: '20px',
                                                                height: '20px'
                                                            }} />
                                Skills
                            </h3>
                            <div
                                className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                                {candidate?.skills?.length > 0 && candidate?.skills[0].skillName ? (
                                    candidate?.skills.map((skill, idx) => (
                                        <div key={idx} className="border-b pb-2 mb-2">
                                            <p>
                                                <strong>Name:</strong> {skill.skillName || '-'}
                                            </p>
                                            <p>
                                                <strong>Level:</strong> {skill.skillLevel || '-'}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No skills added.</p>
                                )}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <ClipboardDocumentCheckIcon className="text-blue-600"
                                                            style={{
                                                                width: '20px',
                                                                height: '20px'
                                                            }} />
                                Projects
                            </h3>
                            <div
                                className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                                {candidate.projects?.length > 0 && candidate.projects.some(p => !p.isPrivate) ? (
                                    candidate.projects
                                        .filter(project => !project.isPrivate) // sadece public projeler
                                        .map((project, idx) => (
                                            <div key={idx} className="border-b pb-2 mb-2">
                                                <p><strong>Project Name:</strong> {project.projectName}</p>
                                                <p><strong>Description:</strong> {project.projectDescription || '-'}
                                                </p>
                                                <p><strong>Start Date:</strong> {project.projectStartDate || '-'}
                                                </p>
                                                <p><strong>End
                                                    Date:</strong> {project.projectStatus === 'ONGOING' ? 'Ongoing' : (project.projectEndDate || '-')}
                                                </p>
                                                <p><strong>Status:</strong> {project.projectStatus || '-'}</p>
                                                <p><strong>Company:</strong> {project.company || '-'}</p>
                                                <p><strong>Privacy:</strong> Public</p>
                                            </div>
                                        ))
                                ) : (
                                    <p className="text-gray-500">No projects added.</p>
                                )}
                            </div>

                        </div>



                    </div>
                </div>


            )}

        </div>
    );
  };

    if (loading) {
        return <div style={{textAlign: 'center', padding: '20px'}}>Loading candidate recommendations...</div>;
    }

    if (error) {
        return <div style={{textAlign: 'center', padding: '20px', color: 'red'}}>{error}</div>;
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
                <h3 style={{color: '#555'}}>No candidate recommendations available</h3>
                <p>Our AI is still analyzing profiles to find the best matches for this job.</p>
            </div>
        );
    }

    return (
        <div style={{width: '100%'}}>
            <h2 style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center'}}>
                Recommended Candidates <span role="img" aria-label="ai">🤖</span>
            </h2>
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '16px',
                justifyContent: 'center',
            }}>
                {recommendedCandidates.map(candidate => (
                    <CandidateCard key={candidate.id} candidate={candidate}/>
                ))}
            </div>
        </div>
    );
};

export default RecommendedCandidates; 