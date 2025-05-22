import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Collapse } from "react-collapse";
import Toast from "./Toast.jsx";
import {
    BriefcaseIcon,
    ClipboardDocumentCheckIcon,
    EnvelopeIcon,
    GlobeAltIcon,
    HeartIcon
} from "@heroicons/react/24/outline/index.js";

import { AnimatePresence, motion } from 'framer-motion';


const JobOffersEmployer = () => {
    const [selectedStatus, setSelectedStatus] = useState('PENDING'); // Default selected
    const [message, setMessage] = useState('');
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        fetchOffers();
    }, []);

    const fetchOffers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:9090/api/job-offer/empOffers', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch offers');
            }

            const data = await response.json();
            console.log(data);
            setOffers(data);
        } catch (err) {
            setMessage('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };
    const [showToast, setShowToast] = useState(false);
    const handleCloseToast = () => {
        setShowToast(false);
    };

    const handleInterview = async (interviewData) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.put(
                'http://localhost:9090/api/job-adv/interview',
                interviewData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            setMessage('Interview scheduled successfully.');
            setShowToast(true);
        } catch (error) {
            console.error("Offer handling error:", error);
            setMessage('Error: ' + (error.response?.data || error.message));
            setShowToast(true);
        }
    };

    const buttonStyle = {
        padding: '8px 12px',
        backgroundColor: '#151717',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '20px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    };

    const JobCard = ({ job }) => {
        const [interviewType, setInterviewType] = useState('');
        const [interviewDate, setInterviewDate] = useState('');
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [notes, setNotes] = useState('');

        const [isAccordionOpen, setIsAccordionOpen] = useState(false);
        const { candidate } = job; // Assuming candidate is part of the job object
        const { status } = job;
        const { jobadv } = job;
        const { offerId } = job;
        const { applicationId } = job;
        const interviewStatus = 'WAITING';

        return (
            <div
                style={{
                    position: 'relative',
                    border: '1px solid #bdc3c7',
                    borderRadius: '8px',
                    padding: '10px',
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transform: 'scale(1)',
                    width: 'calc(50% - 16px)',
                    marginBottom: '16px',
                    height: isAccordionOpen ? '700px' : '550px',
                    overflowY: 'auto',
                    margin: '1px'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.005)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >



                <div
                    style={{ borderRadius: "15px", padding: "10px" }}
                    className="flex max-w-6xl mx-auto rounded-lg overflow-hidden shadow-lg bg-white">

                    <div
                        style={{
                            backgroundColor: "#f8f9f9",
                            borderRadius: "15px",
                            padding: "10px"
                        }}
                        className="w-full bg-gray-100 p-4 rounded-lg">
                        {/* İç Beyaz Kutu */}
                        <div style={{ borderRadius: "15px", padding: "10px" }}
                            className="bg-white p-8 rounded-lg space-y-6 shadow-md">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <BriefcaseIcon
                                    className="text-blue-600"
                                    style={{ width: '20px', height: '20px' }} />Job Advertisement:  <strong>{jobadv || ''}</strong>
                            </h3>
                            <div>
                                <div
                                    className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm flex items-center space-x-6">
                                    {/* Profil Fotoğrafı */}
                                    <img
                                        src={`http://localhost:9090${candidate?.profileDetails?.profilePicture}`}
                                        alt="Profile"
                                        style={{ width: '120px', height: '120px', objectFit: 'cover' }}
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
                                        {status === "ACCEPTED" && (
                                            <div>
                                                <p>
                                                    <strong>Phone
                                                        Number:</strong> {candidate?.contactInformation?.phoneNumber || '-'}
                                                </p>
                                                <p>
                                                    <strong>Country:</strong> {candidate?.contactInformation?.country?.name || '-'}
                                                </p>
                                                <p>
                                                    <strong>City:</strong> {candidate?.contactInformation?.city?.name || '-'}
                                                </p></div>
                                        )}


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
                <br />

                {isAccordionOpen && (

                    <div className="max-h-[500px] overflow-y-auto">

                        <div className="w-full px-5 py-10">
                            <div
                                className="max-w-[1000px] mx-auto bg-gray-100 rounded-xl p-10 space-y-10 shadow-md">

                                <div
                                    style={{ borderRadius: "15px", padding: "10px" }}
                                    className="flex max-w-6xl mx-auto rounded-lg overflow-hidden shadow-lg bg-white">


                                    <div
                                        style={{
                                            backgroundColor: "#f8f9f9",
                                            borderRadius: "15px",
                                            padding: "10px"
                                        }}
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
                                                    {candidate?.projects?.length > 0 && candidate?.projects[0].projectName ? (
                                                        candidate?.projects.map((project, idx) => (
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
                                                                <p>
                                                                    <strong>Privacy:</strong> {project.isPrivate ? 'Private' : 'Public'}
                                                                </p>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="text-gray-500">No projects added.</p>
                                                    )}
                                                </div>
                                            </div>

                                            {status === "ACCEPTED" && (

                                                <div>
                                                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                                        <EnvelopeIcon className="text-blue-600"
                                                            style={{
                                                                width: '20px',
                                                                height: '20px'
                                                            }} />
                                                        References
                                                    </h3>
                                                    <div
                                                        className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                                                        {candidate?.references && candidate?.references.length > 0 && candidate?.references[0].referenceName ? (
                                                            candidate?.references.map((ref, idx) => (
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

                                            <div className="flex justify-between mt-6">
                                                {status === 'ACCEPTED' && (
                                                    <div>
                                                        <button
                                                            onClick={() => setIsModalOpen(true)}
                                                            className="bg-black text-white px-4 py-2 rounded"
                                                        >
                                                            Schedule Interview
                                                        </button>


                                                        <AnimatePresence>
                                                            {isModalOpen && (
                                                                <>
                                                                    {/* Modal Kutusu */}
                                                                    <motion.div
                                                                        initial={{ scale: 0.8, opacity: 0, y: 50 }}
                                                                        animate={{ scale: 1, opacity: 1, y: -500 }}
                                                                        exit={{ scale: 0.8, opacity: 0, y: 50 }}
                                                                        transition={{ duration: 0.3 }}
                                                                        style={{
                                                                            position: 'relative',
                                                                            bottom: '0', // Alt kenardan biraz yukarıda
                                                                            left: '50%',
                                                                            transform: 'translateX(-50%)',
                                                                            backgroundColor: 'white',
                                                                            padding: '20px',
                                                                            borderRadius: '8px',
                                                                            width: '360px',
                                                                            zIndex: 1001,
                                                                            boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                                                                        }}
                                                                    >

                                                                        <h2 className="text-xl font-semibold mb-4">Schedule
                                                                            Interview</h2>

                                                                        <label>Interview Type:</label>
                                                                        <select
                                                                            value={interviewType}
                                                                            onChange={(e) => setInterviewType(e.target.value)}
                                                                            className="w-full mb-3 border rounded px-2 py-1 bg-white text-black"
                                                                        >
                                                                            <option value="" disabled>Interview Type</option>
                                                                            <option value="ONLINE">ONLINE</option>
                                                                            <option value="PHONE">PHONE</option>
                                                                            <option value="IN_PERSON">IN PERSON</option>
                                                                            <option value="GROUP">GROUP</option>
                                                                            <option value="TECHNICAL">TECHNICAL</option>
                                                                            <option value="HR">HR</option>
                                                                            <option value="ASSESSMENT_CENTER">ASSESSMENT
                                                                                CENTER
                                                                            </option>
                                                                        </select>

                                                                        <label>Interview Date:</label>
                                                                        <input
                                                                            type="datetime-local"
                                                                            value={interviewDate}
                                                                            onChange={(e) => setInterviewDate(e.target.value)}
                                                                            className="w-full mb-3 border rounded px-2 py-1  bg-white text-black"
                                                                        />

                                                                        <label>Notes:</label>
                                                                        <textarea
                                                                            value={notes}
                                                                            onChange={(e) => setNotes(e.target.value)}
                                                                            className="w-full mb-4 border rounded px-2 py-1  bg-white text-black"
                                                                            rows={3}
                                                                        />

                                                                        <div className="flex justify-end gap-3">
                                                                            <button
                                                                                onClick={() => setIsModalOpen(false)}
                                                                                className="bg-black text-white px-4 py-2 rounded"
                                                                            >
                                                                                Cancel
                                                                            </button>

                                                                            <button
                                                                                onClick={async () => {
                                                                                    await handleInterview({
                                                                                        candidateId: candidate.id,
                                                                                        offerId,
                                                                                        applicationId,
                                                                                        interviewDateTime: interviewDate,
                                                                                        interviewType,
                                                                                        notes,
                                                                                        interviewStatus
                                                                                    });

                                                                                    setIsModalOpen(false);
                                                                                }}
                                                                                className="bg-black text-white px-4 py-2 rounded"
                                                                            >
                                                                                Confirm
                                                                            </button>

                                                                        </div>
                                                                    </motion.div>

                                                                </>
                                                            )}
                                                        </AnimatePresence>

                                                    </div>

                                                )}

                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                )}

            </div>
        );
    };


    const filteredApplications = offers.filter(job => job.status === selectedStatus);

    return (
        <div
            className="min-h-screen text-black p-4"
            style={{ display: 'flex', flexDirection: 'row', backgroundColor: 'white' }}
        >
            {/* Sol Panel */}
            <div style={{
                width: '250px',
                marginRight: '20px',
                paddingRight: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                borderRight: '2px solid #ccc',
                overflowY: 'auto', // Sol menüde taşan içeriği kaydırılabilir yapar
                maxHeight: '100vh',// İlk çizgi

            }}>

                <h3 className="text-xl font-bold mb-4">Offer Status</h3>
                <div className="space-y-2">
                    {['PENDING', 'ACCEPTED', 'REJECTED'].map(status => (
                        <button
                            style={{margin:'5px'}}
                            key={status}
                            onClick={() => setSelectedStatus(status)}
                            className={`w-full py-2 px-4 rounded text-left font-semibold transition ${selectedStatus === status
                                ? 'bg-black text-white'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Sağ İçerik Paneli */}
            <div
                className="flex-1 overflow-x-hidden"
                style={{
                    minWidth: 0,
                    paddingLeft: '16px',
                    paddingRight: '16px',
                    flexGrow: 1,
                }}
            >
                {loading ? (
                    <p className="text-center mt-10 text-gray-600">Loading offers...</p>
                ) : filteredApplications.length > 0 ? (
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'flex-start',
                            gap: '16px',
                        }}
                    >
                        {filteredApplications.map(job => (
                            <JobCard key={job.id} job={job} />
                        ))}
                    </div>
                ) : (
                    <p className="text-red-600 mt-10 text-lg">No offers found for this status.</p>
                )}
            </div>

            <Toast message={message} show={showToast} onClose={handleCloseToast} />
        </div>
    );

};

export default JobOffersEmployer;
