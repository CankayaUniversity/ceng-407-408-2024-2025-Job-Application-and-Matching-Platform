import React, { useEffect, useState } from 'react';
import {useLocation, useParams} from 'react-router-dom';
import axios from 'axios';
import { Collapse } from 'react-collapse';
import Toast from "./Toast.jsx";
import {
    BriefcaseIcon,
    ClipboardDocumentCheckIcon,
    EnvelopeIcon,
    GlobeAltIcon,
    HeartIcon
} from "@heroicons/react/24/outline/index.js";
import {FlagIcon} from "@heroicons/react/16/solid/index.js";
import {Textarea} from "./ui/TextArea.jsx";
import {Button} from "./ui/Button.jsx";
import {buttonStyle} from "../styles/inlineStyles.jsx"; // react-collapse ile açılıp kapanabilen alanlar

function CandidateList() {
    const [applications, setApplications] = useState([]);
    const [expandedIndex, setExpandedIndex] = useState(null); // Hangi başvuru detayının açıldığını takip eder
    const token = localStorage.getItem('token');
    const location = useLocation();
    const selectedJob = location.state?.selectedJob;

    useEffect(() => {
        if (selectedJob) {
            fetchApplications(selectedJob);
        }

    }, [selectedJob]);

    const fetchApplications = async (selectedJob) => {
        console.log('selectedJob ' + JSON.stringify(selectedJob));

        try {
            const response = await axios.get(`http://localhost:9090/api/job-adv/application/${selectedJob.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },

            });
            setApplications(response.data);
            console.log("Başvurular:", response.data);
        } catch (error) {
            console.error('Başvurular çekilirken hata oluştu:', error);
        }
    };

    const toggleExpand = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index); // Aynı başlık tekrar tıklanırsa kapanır
    };
    const [message, setMessage] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const handleCloseToast = () => {
        setShowToast(false);
    };
    const handleOffer = async (applicationId) => {
        const token = localStorage.getItem('token');
        const offerDetails = {
            salaryOffer: selectedJob.maxSalary,
            workHours: selectedJob.maxWorkHours ,
            startDate: selectedJob.lastDate,
            location:selectedJob.workType,
            benefits: selectedJob.benefitTypes.map(b => b.benefitType).join(", ")
        };
        console.log(offerDetails);
        try {
            const response = await axios.post(
                `http://localhost:9090/api/job-adv/application/${applicationId}`,
                offerDetails,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log(response.data); // Should print: "Offer successfully sent."
            setMessage(response.data); // Success message from backend
            setShowToast(true);

        } catch (error) {
            if (error.response && error.response.data) {
                // Message from backend for errors (e.g., 400 Bad Request)
                setMessage(error.response.data);
            } else {
                setMessage("An unexpected error occurred.");
            }
            setShowToast(true);
        }

    };
    const [reportingCandidateId, setReportingCandidateId] = useState(null);
    const [reportReason, setReportReason] = useState('');
    const [reportStatusMsg, setReportStatusMsg] = useState('');

    const openReportForm = (postId) => {
        setReportingCandidateId(postId);
        setReportReason('');
        setReportStatusMsg('');
    };

    const cancelReport = () => {
        setReportingCandidateId(null);
        setReportReason('');
        setReportStatusMsg('');
    };

    const submitReport = () => {
        if (!reportReason.trim()) {
            setReportStatusMsg('Please enter a reason for reporting.');
            return;
        }

        axios.post(`http://localhost:9090/candidate/report-user/${reportingCandidateId}`, { reason: reportReason }, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(() => {
                setReportStatusMsg('Report submitted successfully.');
                setTimeout(() => cancelReport(), 2000);
            })
            .catch(err => {
                setReportStatusMsg('Failed to submit report.');
                console.error(err);
            });
    };
    const handleDecline = async (applicationId) => {
        const token = localStorage.getItem('token');

        try {
            const response = await axios.put(
                `http://localhost:9090/api/job-adv/decline/${applicationId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            setMessage(response.data); // "Offer status updated successfully."
            setShowToast(true);

        } catch (error) {
            if (error.response && error.response.data) {
                setMessage(error.response.data); // "Cannot decline. No offer has been sent..."
            } else {
                setMessage("An unexpected error occurred.");
            }
            setShowToast(true);
        }

    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Applications</h2>
            {applications.length > 0 ? (
                applications.map((app, index) => (
                    <div key={index} className="border p-4 mb-4 rounded shadow bg-gray-100">

                        <div className="flex items-center justify-between mb-4">
                            <h4
                                onClick={() => toggleExpand(index)}
                                className="cursor-pointer text-xl font-semibold text-black"
                            >
                                {app.candidate?.firstName} {app.candidate?.lastName} Application's
                            </h4>

                            <button
                                onClick={() => setReportingCandidateId(app?.candidate?.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    backgroundColor: 'darkred',
                                    color: 'white',
                                    padding: '8px 16px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    cursor: 'pointer',
                                }}
                                title="Report this job"
                            >
                                <FlagIcon style={{width: '20px', height: '20px', color: 'white'}}/>
                                <span style={{fontSize: '14px'}}>Report</span>
                            </button>

                            {reportingCandidateId === app?.candidate?.id && (
                                <div className="mt-4 border p-4 rounded bg-red-50">
                                    <Textarea
                                        placeholder="Reason for reporting this blog..."
                                        rows={3}
                                        value={reportReason}
                                        onChange={(e) => setReportReason(e.target.value)}
                                    />
                                    <div className="flex gap-2 mt-2">
                                        <Button style={buttonStyle} onClick={submitReport}>Submit Report</Button>
                                        <Button style={buttonStyle} onClick={cancelReport}>Cancel</Button>
                                    </div>
                                    {reportStatusMsg && (
                                        <p className="mt-2 text-sm text-red-700">{reportStatusMsg}</p>
                                    )}
                                </div>
                            )}

                        </div>


                        <Collapse isOpened={expandedIndex === index}>
                            <div className="min-h-screen bg-gray-100 p-8">
                                <div className="w-full px-4 py-10">
                                    <div
                                        className="max-w-[1900px] mx-auto bg-gray-100 rounded-xl p-10 space-y-10 shadow-md">

                                        <div
                                            style={{borderRadius: "15px", padding: "10px"}}
                                            className="flex max-w-6xl mx-auto rounded-lg overflow-hidden shadow-lg bg-white">
                                            {/* Sol Lacivert Sidebar */}
                                            <div
                                                style={{
                                                    backgroundColor: "#f8f9f9",
                                                    borderRadius: "15px",
                                                    padding: "10px"
                                                }}
                                                className="w-1/4 bg-gray-100 p-4 rounded-lg">
                                                {/* Lacivert içerik kutusu */}
                                                <div
                                                    style={{
                                                        backgroundColor: "#000842",
                                                        borderRadius: "15px",
                                                        padding: "10px"
                                                    }}
                                                    className="bg-blue-900 text-white p-6 rounded-lg space-y-4 flex flex-col items-center shadow-md">
                                                    {/* Profil Foto */}
                                                    <img
                                                        src={`http://localhost:9090${app.candidate?.profileDetails?.profilePicture}`}
                                                        alt="Profile"
                                                        style={{width: '150px', height: '150px'}}
                                                        className="rounded-full border-4 border-white"
                                                    />

                                                    {/* Bilgi listesi */}
                                                    <div className="space-y-4 text-md w-full h-1/4">
                                                        <p><strong>About
                                                            Me:</strong> {app.candidate?.profileDetails?.aboutMe || '-'}
                                                        </p>
                                                        <p>
                                                            <strong>Nationality:</strong> {app.candidate?.profileDetails?.nationality
                                                            ?.replaceAll("_", " ")
                                                            ?.toLowerCase()
                                                            ?.replace(/\b\w/g, c => c.toUpperCase()) || '-'}</p>
                                                        <p><strong>Birth
                                                            Date:</strong> {app.candidate?.profileDetails?.birthDate || '-'}
                                                        </p>
                                                        <p>
                                                            <strong>Gender:</strong> {app.candidate?.profileDetails?.gender
                                                            ?.replaceAll("_", " ")
                                                            ?.toLowerCase()
                                                            ?.replace(/\b\w/g, c => c.toUpperCase()) || '-'}</p>

                                                        {app.candidate?.profileDetails?.gender === "MALE" && (
                                                            <p><strong>Military
                                                                Status:</strong> {app.candidate?.profileDetails?.militaryStatus?.replaceAll("_", " ")
                                                                ?.toLowerCase()
                                                                ?.replace(/\b\w/g, c => c.toUpperCase()) || '-'}</p>
                                                        )}

                                                        {app.candidate?.profileDetails?.militaryStatus === "DEFERRED" && (
                                                            <p><strong>Military Deferment
                                                                Date:</strong> {app.candidate?.profileDetails?.militaryDefermentDate || '-'}
                                                            </p>
                                                        )}

                                                        <p><strong>Disability
                                                            Status:</strong> {app.candidate?.profileDetails?.disabilityStatus?.replaceAll("_", " ")
                                                            ?.toLowerCase()
                                                            ?.replace(/\b\w/g, c => c.toUpperCase()) || '-'}</p>
                                                        <p><strong>Marital
                                                            Status:</strong> {app.candidate?.profileDetails?.maritalStatus
                                                            ?.replaceAll("_", " ")
                                                            ?.toLowerCase()
                                                            ?.replace(/\b\w/g, c => c.toUpperCase()) || '-'}</p>

                                                        <p><strong>Currently
                                                            Working:</strong> {app.candidate?.profileDetails?.currentEmploymentStatus ? 'Yes' : 'No'}
                                                        </p>
                                                        <p><strong>Driving
                                                            License:</strong> {app.candidate?.profileDetails?.drivingLicense ? 'Yes' : 'No'}
                                                        </p>
                                                        <p><strong>Profile
                                                            Privacy:</strong> {app.candidate?.profileDetails?.privateProfile ? 'Private' : 'Public'}
                                                        </p>

                                                        {!app.candidate?.profileDetails?.privateProfile
                                                            && (
                                                                <>
                                                                    <p><strong>Phone
                                                                        Number:</strong> {app.candidate?.contactInformation?.phoneNumber || '-'}
                                                                    </p>
                                                                    <p>
                                                                        <strong>Country:</strong> {app.candidate?.contactInformation?.country?.name || '-'}
                                                                    </p>
                                                                    <p>
                                                                        <strong>City:</strong> {app.candidate?.contactInformation?.city?.name || '-'}
                                                                    </p>
                                                                </>
                                                            )}

                                                        <p>
                                                            <strong>Github:</strong> {app.candidate?.socialLinks?.githubUrl || '-'}
                                                        </p>
                                                        <p>
                                                            <strong>LinkedIn:</strong> {app.candidate?.socialLinks?.linkedinUrl || '-'}
                                                        </p>
                                                        <p>
                                                            <strong>Website:</strong> {app.candidate?.socialLinks?.websiteUrl || '-'}
                                                        </p>
                                                        <p>
                                                            <strong>Blog:</strong> {app.candidate?.socialLinks?.blogUrl || '-'}
                                                        </p>
                                                        <p><strong>Other
                                                            Links:</strong> {app.candidate?.socialLinks?.otherLinksUrl || '-'}
                                                        </p>
                                                        <p><strong>Other Links
                                                            Description:</strong> {app.candidate?.socialLinks?.otherLinksDescription || '-'}
                                                        </p>
                                                    </div>
                                                    <div style={{textAlign: 'right'}}>

                                                        <button
                                                            style={{backgroundColor: '#0C21C1', borderColor: '#0C21C2'}}
                                                            onClick={() => handleOffer(app.applicationId)}
                                                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                                        >
                                                            Make Offer
                                                        </button>
                                                        <Toast message={message} show={showToast}
                                                               onClose={handleCloseToast}/>
                                                        &nbsp; &nbsp; &nbsp;
                                                        <button
                                                            style={{backgroundColor: '#0C21C1', borderColor: '#0C21C2'}}
                                                            onClick={() => handleDecline(app.applicationId)}
                                                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                                        >
                                                            Decline
                                                        </button>
                                                        <Toast message={message} show={showToast}
                                                               onClose={handleCloseToast}/>

                                                    </div>


                                                </div>
                                            </div>


                                            {/* Sağ Taraftaki Bilgi Alanları */}
                                            <div
                                                style={{
                                                    backgroundColor: "#f8f9f9",
                                                    borderRadius: "15px",
                                                    padding: "10px"
                                                }}
                                                className="w-2/3 bg-gray-100 p-4 rounded-lg">
                                                {/* İç Beyaz Kutu */}
                                                <div style={{borderRadius: "15px", padding: "10px"}}
                                                     className="bg-white p-8 rounded-lg space-y-6 shadow-md">

                                                    <div>
                                                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                                            <ClipboardDocumentCheckIcon className="text-blue-600"
                                                                                        style={{
                                                                                            width: '20px',
                                                                                            height: '20px'
                                                                                        }}/>
                                                            Job Preferences
                                                        </h3>
                                                        <div
                                                            className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                                                            {app.candidate?.jobPreferences?.preferredPositions && app.candidate?.jobPreferences?.preferredPositions.length > 0 ? (
                                                                <>
                                                                    <p>
                                                                        <strong>Preferred Positions:</strong>{' '}
                                                                        {app.candidate?.jobPreferences.preferredPositions
                                                                            .map(pos =>
                                                                                pos.positionType
                                                                                    ? pos.positionType.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
                                                                                    : pos.customJobPosition?.positionName || '-'
                                                                            )
                                                                            .join(', ')}
                                                                    </p>
                                                                    <p>
                                                                        <strong>Preferred Work Type:</strong>{' '}
                                                                        {app.candidate?.jobPreferences?.preferredWorkType
                                                                            ? app.candidate?.jobPreferences.preferredWorkType.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
                                                                            : '-'}
                                                                    </p>
                                                                    <p>
                                                                        <strong>Work Hours:</strong>{' '}
                                                                        {app.candidate?.jobPreferences?.minWorkHour !== undefined && app.candidate?.jobPreferences?.maxWorkHour !== undefined
                                                                            ? `${app.candidate?.jobPreferences.minWorkHour} - ${app.candidate?.jobPreferences.maxWorkHour}`
                                                                            : '-'}
                                                                    </p>
                                                                    <p>
                                                                        <strong>Can Travel:</strong>{' '}
                                                                        {app.candidate?.jobPreferences?.canTravel ? 'Yes' : 'No'}
                                                                    </p>
                                                                    <p>
                                                                        <strong>Expected Salary:</strong>{' '}
                                                                        {app.candidate?.jobPreferences?.expectedSalary || '-'}
                                                                    </p>
                                                                </>
                                                            ) : (
                                                                <p className="text-gray-500">No job preferences
                                                                    added.</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* References Section */}

                                                    {!app.candidate?.profileDetails?.privateProfile
                                                        && (
                                                            <div>
                                                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                                                    <EnvelopeIcon className="text-blue-600"
                                                                                  style={{
                                                                                      width: '20px',
                                                                                      height: '20px'
                                                                                  }}/>
                                                                    References
                                                                </h3>
                                                                <div
                                                                    className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                                                                    {app.candidate?.references && app.candidate?.references.length > 0 && app.candidate?.references[0].referenceName ? (
                                                                        app.candidate?.references.map((ref, idx) => (
                                                                            <div key={idx}
                                                                                 className="border-b pb-2 mb-2">
                                                                                <p>
                                                                                    <strong>Name:</strong> {ref.referenceName || '-'}
                                                                                </p>
                                                                                <p>
                                                                                    <strong>Company:</strong> {ref.referenceCompany || '-'}
                                                                                </p>
                                                                                <p><strong>Job
                                                                                    Title:</strong> {ref.referenceJobTitle || '-'}
                                                                                </p>
                                                                                <p><strong>Contact
                                                                                    Info:</strong> {ref.referenceContactInfo || '-'}
                                                                                </p>
                                                                                <p><strong>Years
                                                                                    Worked:</strong> {ref.referenceYearsWorked || '-'}
                                                                                </p>
                                                                            </div>
                                                                        ))
                                                                    ) : (
                                                                        <p className="text-gray-500">No references
                                                                            added.</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}


                                                    {/* Language Proficiency Section */}
                                                    <div>
                                                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                                            <GlobeAltIcon className="text-blue-600"
                                                                          style={{width: '20px', height: '20px'}}/>
                                                            Language Proficiency
                                                        </h3>
                                                        <div
                                                            className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                                                            {app.candidate?.languageProficiency && app.candidate?.languageProficiency.length > 0 && app.candidate?.languageProficiency[0].language ? (
                                                                app.candidate?.languageProficiency.map((lang, idx) => (
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
                                                                       style={{width: '20px', height: '20px'}}/>
                                                            Hobbies
                                                        </h3>
                                                        <div
                                                            className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                                                            {app.candidate?.hobbies && app.candidate?.hobbies.length > 0 && app.candidate?.hobbies[0].hobbyName ? (
                                                                app.candidate?.hobbies.map((hobby, idx) => (
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
                                                                                        }}/>
                                                            Education
                                                        </h3>

                                                        <div
                                                            className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm space-y-4">

                                                            {/* Associate */}
                                                            {app.candidate?.education?.associateDepartment?.name && (
                                                                <div>
                                                                    <h4 className="font-semibold mb-1">Associate
                                                                        Degree</h4>
                                                                    <p>
                                                                        <strong>Department:</strong> {app.candidate?.education.associateDepartment?.name || '-'}
                                                                    </p>
                                                                    <p>
                                                                        <strong>University:</strong> {app.candidate?.education.associateDepartment?.university?.name || '-'}
                                                                    </p>
                                                                    <p>
                                                                        <strong>City:</strong> {app.candidate?.education.associateDepartment?.university?.city?.name || '-'}
                                                                    </p>
                                                                    <p><strong>Start
                                                                        Date:</strong> {app.candidate?.education.associateStartDate || '-'}
                                                                    </p>
                                                                    <p>
                                                                        <strong>End
                                                                            Date:</strong> {app.candidate?.education.associateIsOngoing ? 'Ongoing' : (app.candidate?.education.associateEndDate || '-')}
                                                                    </p>
                                                                </div>
                                                            )}


                                                            {/* Bachelor */}
                                                            {app.candidate?.education?.bachelorDepartment?.name && (
                                                                <div>
                                                                    <h4 className="font-semibold mb-1">Bachelor
                                                                        Degree</h4>
                                                                    <p>
                                                                        <strong>Department:</strong> {app.candidate?.education.bachelorDepartment?.name || '-'}
                                                                    </p>
                                                                    <p>
                                                                        <strong>University:</strong> {app.candidate?.education.bachelorDepartment?.university?.name || '-'}
                                                                    </p>
                                                                    <p>
                                                                        <strong>City:</strong> {app.candidate?.education.bachelorDepartment?.university?.city?.name || '-'}
                                                                    </p>
                                                                    <p><strong>Start
                                                                        Date:</strong> {app.candidate?.education.bachelorStartDate || '-'}
                                                                    </p>
                                                                    <p><strong>End
                                                                        Date:</strong> {app.candidate?.education.bachelorIsOngoing ? 'Ongoing' : (app.candidate?.education.bachelorEndDate || '-')}
                                                                    </p>
                                                                </div>
                                                            )}

                                                            {/* Master */}
                                                            {app.candidate?.education?.masterDepartment?.name && (
                                                                <div>
                                                                    <h4 className="font-semibold mb-1">Master
                                                                        Degree</h4>
                                                                    <p>
                                                                        <strong>Department:</strong> {app.candidate?.education.masterDepartment?.name || '-'}
                                                                    </p>
                                                                    <p>
                                                                        <strong>University:</strong> {app.candidate?.education.masterDepartment?.university?.name || '-'}
                                                                    </p>
                                                                    <p>
                                                                        <strong>City:</strong> {app.candidate?.education.masterDepartment?.university?.city?.name || '-'}
                                                                    </p>
                                                                    <p><strong>Start
                                                                        Date:</strong> {app.candidate?.education.masterStartDate || '-'}
                                                                    </p>
                                                                    <p><strong>End
                                                                        Date:</strong> {app.candidate?.education.masterIsOngoing ? 'Ongoing' : (app.candidate?.education.masterEndDate || '-')}
                                                                    </p>
                                                                    <p><strong>Thesis
                                                                        Title:</strong> {app.candidate?.education.masterThesisTitle || '-'}
                                                                    </p>
                                                                    <p><strong>Thesis
                                                                        Description:</strong> {app.candidate?.education.masterThesisDescription || '-'}
                                                                    </p>
                                                                    <p><strong>Thesis
                                                                        URL:</strong> {app.candidate?.education.masterThesisUrl || '-'}
                                                                    </p>
                                                                </div>
                                                            )}

                                                            {/* Doctorate */}
                                                            {app.candidate?.education?.doctorateDepartment?.name && (
                                                                <div>
                                                                    <h4 className="font-semibold mb-1">Doctorate
                                                                        Degree</h4>
                                                                    <p>
                                                                        <strong>Department:</strong> {app.candidate?.education.doctorateDepartment?.name || '-'}
                                                                    </p>
                                                                    <p>
                                                                        <strong>University:</strong> {app.candidate?.education.doctorateDepartment?.university?.name || '-'}
                                                                    </p>
                                                                    <p>
                                                                        <strong>City:</strong> {app.candidate?.education.doctorateDepartment?.university?.city?.name || '-'}
                                                                    </p>
                                                                    <p><strong>Start
                                                                        Date:</strong> {app.candidate?.education.doctorateStartDate || '-'}
                                                                    </p>
                                                                    <p><strong>End
                                                                        Date:</strong> {app.candidate?.education.doctorateIsOngoing ? 'Ongoing' : (app.candidate?.education.doctorateEndDate || '-')}
                                                                    </p>
                                                                    <p><strong>Thesis
                                                                        Title:</strong> {app.candidate?.education.doctorateThesisTitle || '-'}
                                                                    </p>
                                                                    <p><strong>Thesis
                                                                        Description:</strong> {app.candidate?.education.doctorateThesisDescription || '-'}
                                                                    </p>
                                                                    <p><strong>Thesis
                                                                        URL:</strong> {app.candidate?.education.doctorateThesisUrl || '-'}
                                                                    </p>
                                                                </div>
                                                            )}

                                                            {/* Double Major */}
                                                            {app.candidate?.education?.doubleMajorDepartment?.name && (
                                                                <div>
                                                                    <h4 className="font-semibold mb-1">Double Major</h4>
                                                                    <p>
                                                                        <strong>Department:</strong> {app.candidate?.education.doubleMajorDepartment?.name || '-'}
                                                                    </p>
                                                                    <p>
                                                                        <strong>University:</strong> {app.candidate?.education.doubleMajorDepartment?.university?.name || '-'}
                                                                    </p>
                                                                    <p>
                                                                        <strong>City:</strong> {app.candidate?.education.doubleMajorDepartment?.university?.city?.name || '-'}
                                                                    </p>
                                                                    <p><strong>Start
                                                                        Date:</strong> {app.candidate?.education.doubleMajorStartDate || '-'}
                                                                    </p>
                                                                    <p><strong>End
                                                                        Date:</strong> {app.candidate?.education.doubleMajorIsOngoing ? 'Ongoing' : (app.candidate?.education.doubleMajorEndDate || '-')}
                                                                    </p>
                                                                </div>
                                                            )}

                                                            {/* Minor */}
                                                            {app.candidate?.education?.minorDepartment?.name && (
                                                                <div>
                                                                    <h4 className="font-semibold mb-1">Minor</h4>
                                                                    <p>
                                                                        <strong>Department:</strong> {app.candidate?.education.minorDepartment?.name || '-'}
                                                                    </p>
                                                                    <p>
                                                                        <strong>University:</strong> {app.candidate?.education.minorDepartment?.university?.name || '-'}
                                                                    </p>
                                                                    <p>
                                                                        <strong>City:</strong> {app.candidate?.education.minorDepartment?.university?.city?.name || '-'}
                                                                    </p>
                                                                    <p><strong>Start
                                                                        Date:</strong> {app.candidate?.education.minorStartDate || '-'}
                                                                    </p>
                                                                    <p><strong>End
                                                                        Date:</strong> {app.candidate?.education.minorIsOngoing ? 'Ongoing' : (app.candidate?.education.minorEndDate || '-')}
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
                                                                                        }}/>
                                                            Certifications
                                                        </h3>
                                                        <div
                                                            className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                                                            {app.candidate?.certifications?.length > 0 && app.candidate?.certifications[0].certificationName ? (
                                                                app.candidate?.certifications.map((cert, idx) => (
                                                                    <div key={idx} className="border-b pb-2 mb-2">
                                                                        <p><strong>Certification
                                                                            Name:</strong> {cert.certificationName}</p>
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
                                                                           style={{width: '20px', height: '20px'}}/>
                                                            Work Experiences
                                                        </h3>
                                                        <div
                                                            className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                                                            {app.candidate?.workExperiences?.length > 0 && app.candidate?.workExperiences[0].companyName ? (
                                                                app.candidate?.workExperiences.map((exp, idx) => (
                                                                    <div key={idx} className="border-b pb-2 mb-2">
                                                                        <p><strong>Company
                                                                            Name:</strong> {exp.companyName || '-'}
                                                                        </p>
                                                                        <p><strong>Job
                                                                            Title:</strong> {exp.jobTitle || '-'}</p>
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
                                                                                        }}/>
                                                            Exams and Achievements
                                                        </h3>
                                                        <div
                                                            className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                                                            {app.candidate?.examsAndAchievements?.length > 0 && app.candidate?.examsAndAchievements[0].examName ? (
                                                                app.candidate?.examsAndAchievements.map((exam, idx) => (
                                                                    <div key={idx} className="border-b pb-2 mb-2">
                                                                        <p><strong>Exam
                                                                            Name:</strong> {exam.examName || '-'} </p>
                                                                        <p><strong>Year:</strong> {exam.examYear || '-'}
                                                                        </p>
                                                                        <p>
                                                                            <strong>Score:</strong> {exam.examScore || '-'}
                                                                        </p>
                                                                        <p><strong>Rank:</strong> {exam.examRank || '-'}
                                                                        </p>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <p className="text-gray-500">No exams or achievements
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
                                                                                        }}/>
                                                            Uploaded Documents
                                                        </h3>
                                                        <div
                                                            className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                                                            {app.candidate?.uploadedDocuments?.length > 0 && app.candidate?.uploadedDocuments[0].documentName ? (
                                                                app.candidate?.uploadedDocuments.map((doc, idx) => (
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
                                                                <p className="text-gray-500">No documents uploaded.</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                                            <ClipboardDocumentCheckIcon className="text-blue-600"
                                                                                        style={{
                                                                                            width: '20px',
                                                                                            height: '20px'
                                                                                        }}/>
                                                            Skills
                                                        </h3>
                                                        <div
                                                            className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                                                            {app.candidate?.skills?.length > 0 && app.candidate?.skills[0].skillName ? (
                                                                app.candidate?.skills.map((skill, idx) => (
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
                                                                                        }}/>
                                                            Projects
                                                        </h3>

                                                        <div
                                                            className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                                                            {app.candidate?.projects?.length > 0 && app.candidate?.projects.some(p => !p.isPrivate) ? (
                                                                app.candidate?.projects
                                                                    .filter(project => !project.isPrivate) // sadece public projeler
                                                                    .map((project, idx) => (
                                                                        <div key={idx} className="border-b pb-2 mb-2">
                                                                            <p><strong>Project
                                                                                Name:</strong> {project.projectName}</p>
                                                                            <p>
                                                                                <strong>Description:</strong> {project.projectDescription || '-'}
                                                                            </p>
                                                                            <p><strong>Start
                                                                                Date:</strong> {project.projectStartDate || '-'}
                                                                            </p>
                                                                            <p><strong>End
                                                                                Date:</strong> {project.projectStatus === 'ONGOING' ? 'Ongoing' : (project.projectEndDate || '-')}
                                                                            </p>
                                                                            <p>
                                                                                <strong>Status:</strong> {project.projectStatus || '-'}
                                                                            </p>
                                                                            <p>
                                                                                <strong>Company:</strong> {project.company || '-'}
                                                                            </p>
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
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Collapse>

                    </div>
                ))
            ) : (
                <p>No application found.</p>
            )}
        </div>
    );
}

export default CandidateList;


// 5. <h2 className="text-2xl font-bold mb-4">Başvurular (İlan ID: {selectedJobAdvId})</h2>
// {applications.length > 0 ? (

//     applications.map((app, index) => (
//
//             <p><strong>Ad Soyad:</strong> {app.candidate?.firstName} {app.candidate?.lastName}</p>
//             <p><strong>Eğitim Bilgileri:</strong>
//                 {app.candidate?.education ? (
//                     <div>
//                         {app.candidate.education.degreeType &&
//                             <p><strong>Derece Tipi:</strong> {app.candidate.education.degreeType}
//                             </p>}
//                         {app.candidate.education.associateDepartment && <p><strong>Associate
//                             Bölümü:</strong> {app.candidate.education.associateDepartment}</p>}
//                         {app.candidate.education.associateStartDate && <p><strong>Başlangıç
//                             Tarihi:</strong> {app.candidate.education.associateStartDate}</p>}
//                         {app.candidate.education.associateEndDate && <p><strong>Bitiş
//                             Tarihi:</strong> {app.candidate.education.associateEndDate}</p>}
//                         {app.candidate.education.associateIsOngoing && <p><strong>Devam
//                             Ediyor:</strong> {app.candidate.education.associateIsOngoing ? 'Evet' : 'Hayır'}
//                         </p>}
//
//                         {app.candidate.education.bachelorDepartment && <p><strong>Bachelor
//                             Bölümü:</strong> {app.candidate.education.bachelorDepartment}</p>}
//                         {app.candidate.education.bachelorStartDate && <p><strong>Başlangıç
//                             Tarihi:</strong> {app.candidate.education.bachelorStartDate}</p>}
//                         {app.candidate.education.bachelorEndDate && <p><strong>Bitiş
//                             Tarihi:</strong> {app.candidate.education.bachelorEndDate}</p>}
//                         {app.candidate.education.bachelorIsOngoing && <p><strong>Devam
//                             Ediyor:</strong> {app.candidate.education.bachelorIsOngoing ? 'Evet' : 'Hayır'}
//                         </p>}
//
//                         {app.candidate.education.masterDepartment && <p><strong>Master
//                             Bölümü:</strong> {app.candidate.education.masterDepartment}</p>}
//                         {app.candidate.education.masterStartDate && <p><strong>Başlangıç
//                             Tarihi:</strong> {app.candidate.education.masterStartDate}</p>}
//                         {app.candidate.education.masterEndDate && <p><strong>Bitiş
//                             Tarihi:</strong> {app.candidate.education.masterEndDate}</p>}
//                         {app.candidate.education.masterIsOngoing && <p><strong>Devam
//                             Ediyor:</strong> {app.candidate.education.masterIsOngoing ? 'Evet' : 'Hayır'}
//                         </p>}
//                         {app.candidate.education.masterThesisTitle && <p><strong>Tez
//                             Başlığı:</strong> {app.candidate.education.masterThesisTitle}</p>}
//                         {app.candidate.education.masterThesisDescription && <p><strong>Tez
//                             Açıklaması:</strong> {app.candidate.education.masterThesisDescription}
//                         </p>}
//                         {app.candidate.education.masterThesisUrl &&
//                             <p><strong>Tez Linki:</strong> {app.candidate.education.masterThesisUrl}
//                             </p>}
//
//                         {app.candidate.education.doctorateDepartment && <p><strong>Doktora
//                             Bölümü:</strong> {app.candidate.education.doctorateDepartment}</p>}
//                         {app.candidate.education.doctorateStartDate && <p><strong>Başlangıç
//                             Tarihi:</strong> {app.candidate.education.doctorateStartDate}</p>}
//                         {app.candidate.education.doctorateEndDate && <p><strong>Bitiş
//                             Tarihi:</strong> {app.candidate.education.doctorateEndDate}</p>}
//                         {app.candidate.education.doctorateIsOngoing && <p><strong>Devam
//                             Ediyor:</strong> {app.candidate.education.doctorateIsOngoing ? 'Evet' : 'Hayır'}
//                         </p>}
//                         {app.candidate.education.doctorateThesisTitle && <p><strong>Tez
//                             Başlığı:</strong> {app.candidate.education.doctorateThesisTitle}</p>}
//                         {app.candidate.education.doctorateThesisDescription && <p><strong>Tez
//                             Açıklaması:</strong> {app.candidate.education.doctorateThesisDescription}
//                         </p>}
//                         {app.candidate.education.doctorateThesisUrl && <p><strong>Tez
//                             Linki:</strong> {app.candidate.education.doctorateThesisUrl}</p>}
//
//                         {app.candidate.education.isDoubleMajor && app.candidate.education.doubleMajorDepartment && (
//                             <div>
//                                 <p><strong>Çift Anadal
//                                     Bölümü:</strong> {app.candidate.education.doubleMajorDepartment}
//                                 </p>
//                                 {app.candidate.education.doubleMajorStartDate && <p><strong>Başlangıç
//                                     Tarihi:</strong> {app.candidate.education.doubleMajorStartDate}
//                                 </p>}
//                                 {app.candidate.education.doubleMajorEndDate && <p><strong>Bitiş
//                                     Tarihi:</strong> {app.candidate.education.doubleMajorEndDate}
//                                 </p>}
//                                 <p><strong>Devam
//                                     Ediyor:</strong> {app.candidate.education.doubleMajorIsOngoing ? 'Evet' : 'Hayır'}
//                                 </p>
//                             </div>
//                         )}
//
//                         {app.candidate.education.isMinor && app.candidate.education.minorDepartment && (
//                             <div>
//                                 <p><strong>Yan Dal
//                                     Bölümü:</strong> {app.candidate.education.minorDepartment}</p>
//                                 {app.candidate.education.minorStartDate && <p><strong>Başlangıç
//                                     Tarihi:</strong> {app.candidate.education.minorStartDate}</p>}
//                                 {app.candidate.education.minorEndDate && <p><strong>Bitiş
//                                     Tarihi:</strong> {app.candidate.education.minorEndDate}</p>}
//                                 <p><strong>Devam
//                                     Ediyor:</strong> {app.candidate.education.minorIsOngoing ? 'Evet' : 'Hayır'}
//                                 </p>
//                             </div>
//                         )}
//                     </div>
//                 ) : (
//                     <p>Bilgi yok</p>
//                 )}
//             </p>
//
//             <p><strong>Sertifikalar:</strong>
//                 {app.candidate?.certifications && app.candidate.certifications.length > 0 ? (
//                     app.candidate.certifications.map((certification, index) => (
//                         <div key={index}>
//                             {certification.certificationName &&
//                                 <p><strong>Sertifika Adı:</strong> {certification.certificationName}
//                                 </p>}
//                             {certification.certificationUrl &&
//                                 <p><strong>Sertifika Linki:</strong> <a
//                                     href={certification.certificationUrl} target="_blank"
//                                     rel="noopener noreferrer">Bağlantı</a></p>}
//                             {certification.certificateValidityDate && <p><strong>Geçerlilik
//                                 Tarihi:</strong> {certification.certificateValidityDate}</p>}
//                             {certification.issuedBy &&
//                                 <p><strong>Verilen Kurum:</strong> {certification.issuedBy}</p>}
//                         </div>
//                     ))
//                 ) : (
//                     <p>Bilgi yok</p>
//                 )}
//             </p>
//
//             <p><strong>İş Deneyimleri:</strong>
//                 {app.candidate?.workExperiences && app.candidate.workExperiences.length > 0 ? (
//                     app.candidate.workExperiences.map((experience, index) => (
//                         <div key={index}>
//                             {experience.companyName &&
//                                 <p><strong>Şirket Adı:</strong> {experience.companyName}</p>}
//                             {experience.industry &&
//                                 <p><strong>Sektör:</strong> {experience.industry}</p>}
//                             {experience.jobTitle &&
//                                 <p><strong>Pozisyon:</strong> {experience.jobTitle}</p>}
//                             {experience.jobDescription &&
//                                 <p><strong>İş Tanımı:</strong> {experience.jobDescription}</p>}
//                             {experience.employmentType &&
//                                 <p><strong>Çalışma Türü:</strong> {experience.employmentType}</p>}
//                             {experience.startDate &&
//                                 <p><strong>Başlangıç Tarihi:</strong> {experience.startDate}</p>}
//                             {experience.endDate &&
//                                 <p><strong>Bitiş Tarihi:</strong> {experience.endDate}</p>}
//                             <p><strong>Devam
//                                 Ediyor:</strong> {experience.isGoing ? 'Evet' : 'Hayır'}</p>
//                         </div>
//                     ))
//                 ) : (
//                     <p>Bilgi yok</p>
//                 )}
//             </p>
//
//             <p><strong>Sınavlar ve Başarılar:</strong>
//                 {app.candidate?.examsAndAchievements && app.candidate.examsAndAchievements.length > 0 ? (
//                     app.candidate.examsAndAchievements.map((achievement, index) => (
//                         <div key={index}>
//                             {achievement.examName &&
//                                 <p><strong>Sınav Adı:</strong> {achievement.examName}</p>}
//                             {achievement.examYear &&
//                                 <p><strong>Sınav Yılı:</strong> {achievement.examYear}</p>}
//                             {achievement.examScore &&
//                                 <p><strong>Sınav Puanı:</strong> {achievement.examScore}</p>}
//                             {achievement.examRank &&
//                                 <p><strong>Sınav Sıralaması:</strong> {achievement.examRank}</p>}
//                         </div>
//                     ))
//                 ) : (
//                     <p>Bilgi yok</p>
//                 )}
//             </p>
//
//             <p><strong>Yüklenen Belgeler:</strong>
//                 {app.candidate?.uploadedDocuments && app.candidate.uploadedDocuments.length > 0 ? (
//                     app.candidate.uploadedDocuments.map((document, index) => (
//                         <div key={index}>
//                             {document.documentName &&
//                                 <p><strong>Belge Adı:</strong> {document.documentName}</p>}
//                             {document.documentType &&
//                                 <p><strong>Belge Türü:</strong> {document.documentType}</p>}
//                             {document.documentCategory &&
//                                 <p><strong>Belge Kategorisi:</strong> {document.documentCategory}
//                                 </p>}
//                             {document.documentUrl &&
//                                 <p><strong>Belge Linki:</strong> <a href={document.documentUrl}
//                                                                     target="_blank"
//                                                                     rel="noopener noreferrer">Bağlantı</a>
//                                 </p>}
//                             <p><strong>Özel:</strong> {document.isPrivate ? 'Evet' : 'Hayır'}</p>
//                         </div>
//                     ))
//                 ) : (
//                     <p>Bilgi yok</p>
//                 )}
//             </p>
//
//             <p><strong>Yetenekler:</strong>
//                 {app.candidate?.skills && app.candidate.skills.length > 0 ? (
//                     app.candidate.skills.map((skill, index) => (
//                         <div key={index}>
//                             {skill.skillName &&
//                                 <p><strong>Yetenek Adı:</strong> {skill.skillName}</p>}
//                             {skill.skillLevel &&
//                                 <p><strong>Yetenek Seviyesi:</strong> {skill.skillLevel}</p>}
//                         </div>
//                     ))
//                 ) : (
//                     <p>Bilgi yok</p>
//                 )}
//             </p>
//
//             <p><strong>Projeler:</strong>
//                 {app.candidate?.projects && app.candidate.projects.length > 0 ? (
//                     app.candidate.projects.map((project, index) => (
//                         <div key={index}>
//                             {project.projectName &&
//                                 <p><strong>Proje Adı:</strong> {project.projectName}</p>}
//                             {project.projectDescription &&
//                                 <p><strong>Proje Açıklaması:</strong> {project.projectDescription}
//                                 </p>}
//                             {project.projectStartDate &&
//                                 <p><strong>Başlangıç Tarihi:</strong> {project.projectStartDate}
//                                 </p>}
//                             {project.projectEndDate &&
//                                 <p><strong>Bitiş Tarihi:</strong> {project.projectEndDate}</p>}
//                             {project.projectStatus &&
//                                 <p><strong>Proje Durumu:</strong> {project.projectStatus}</p>}
//                             <p><strong>Özel:</strong> {project.isPrivate ? 'Evet' : 'Hayır'}</p>
//                             {project.company && <p><strong>Şirket:</strong> {project.company}</p>}
//                         </div>
//                     ))
//                 ) : (
//                     <p>Bilgi yok</p>
//                 )}
//             </p>
//
//             {app.contactPermission && (
//                 <div>
//                     <p><strong>Referanslar:</strong>
//                         {app.candidate?.references && app.candidate.references.length > 0 ? (
//                             app.candidate.references.map((reference, index) => (
//                                 <div key={index}>
//                                     {reference.referenceName && <p><strong>Referans Adı:</strong> {reference.referenceName}</p>}
//                                     {reference.referenceCompany && <p><strong>Şirket:</strong> {reference.referenceCompany}</p>}
//                                     {reference.referenceJobTitle && <p><strong>Pozisyon:</strong> {reference.referenceJobTitle}</p>}
//                                     {reference.referenceContactInfo && <p><strong>İletişim Bilgileri:</strong> {reference.referenceContactInfo}</p>}
//                                     {reference.referenceYearsWorked && <p><strong>Çalışılan Yıl:</strong> {reference.referenceYearsWorked}</p>}
//                                 </div>
//                             ))
//                         ) : (
//                             <p>Bilgi yok</p>
//                         )}
//                     </p>
//
//                     <p><strong>İletişim Bilgileri:</strong>
//                         {app.candidate?.contactInformation ? (
//                             <div>
//                                 {app.candidate.contactInformation.phoneNumber && <p><strong>Telefon:</strong> {app.candidate.contactInformation.phoneNumber}</p>}
//                                 {app.candidate.contactInformation.country && <p><strong>Ülke:</strong> {app.candidate.contactInformation.country}</p>}
//                                 {app.candidate.contactInformation.city && <p><strong>Şehir:</strong> {app.candidate.contactInformation.city}</p>}
//                             </div>
//                         ) : (
//                             <p>Bilgi yok</p>
//                         )}
//                     </p>
//                 </div>
//             )}
//             {app.referencePermission ? (
//                 <p><strong>İletişim Bilgileri:</strong> {app.candidate?.contactInformation || 'Bilgi yok'}</p>
//             ) : (
//                 <p><em>İletişim bilgileri adaya teklif kabul ettirilmeden görünmez.</em></p>
//             )}
//  ))
// ) : (
//     <p>Başvuru bulunamadı.</p>
// )}
// </div>
