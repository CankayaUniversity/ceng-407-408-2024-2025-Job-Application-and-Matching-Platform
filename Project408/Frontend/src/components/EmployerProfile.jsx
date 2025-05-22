import React, {useEffect, useState} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEdit, FaSave, FaTimes, FaPhone, FaGlobe } from "react-icons/fa";
import { BuildingOffice2Icon, GlobeAltIcon, PhoneIcon, EnvelopeIcon, BriefcaseIcon } from '@heroicons/react/24/outline';
import Toast from "./Toast.jsx";

const EmployerProfile = () => {
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);


    const [profile, setProfile] = useState({
        company: {

            companyName: '',
            vision:'',
            mission:'',
            industry: '',
            employeeCount: '',
            establishedDate:'',
            email: '',
            phoneNumber: '',
            websiteUrl: '',
            projects: [{
                projectName: '',
                projectDescription: '',
                projectStartDate: '',
                projectEndDate: '',
                projectStatus: '',
                isPrivate: false,
            }
            ],

        }
    });

    const [currentStep, setCurrentStep] = useState(1);
    const [direction, setDirection] = useState(1);
    const [formKey, setFormKey] = useState(0);
    const [message, setMessage] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const handleCloseToast = () => {
        setShowToast(false);
    };
    const cleanedCompany = {
        ...profile.company,
        projects: profile.company.projects.map(p => ({
            ...p,
            projectStatus: p.projectStatus === '' ? null : p.projectStatus
        }))
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        const id=localStorage.getItem('id');

        if (!token) {
            console.log("Kullanıcı giriş yapmamış");
            return;
        }

        fetch(`http://localhost:9090/employer/profile/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
            .then((res) => res.json())
            .then((data) => setProfile(data))
            .catch((err) => console.error("No Profile Data Found", err));
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            const id = localStorage.getItem('id');

            if (!token) {
                console.log("Kullanıcı giriş yapmamış");
                return;
            }
            console.log("giddeen" + JSON.stringify(profile.company));

            const response = await fetch(`http://localhost:9090/employer/updateProfile/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cleanedCompany)
            });

            if (!response.ok) {
                // Hata mesajını JSON olarak oku
                const errorData = await response.json();
                // Backend’de dönen errorMessage alanını alıyoruz
                throw new Error(errorData.errorMessage || 'Unknown error');
            }

            const data = await response.json();
            setMessage('Profile Updated Successfully!');
            setShowToast(true);

        } catch (error) {
            setMessage(error.message);
            setShowToast(true);
        }
    };

    // Panel open/close function
    const handleNextStep = () => {
        setDirection(1);
        setCurrentStep((prev) => prev + 1);
    };

    const handleBackStep = () => {
        setDirection(-1);
        setCurrentStep((prev) => prev - 1);
    };

    const handleProfileFieldChange = (path, value) => {

        setProfile(prev => {
            const updated = { ...prev };
            let target = updated;

            for (let i = 0; i < path.length - 1; i++) {
                const key = path[i];
                if (target[key] === null || typeof target[key] !== 'object') {
                    target[key] = {}; // null ya da undefined ise boş obje yap
                }
                target = target[key];
            }

            target[path[path.length - 1]] = value;
            return updated;
        });
    };

    const addProject = () => {
        setProfile(prevProfile => ({
            ...prevProfile,
            company: {
                ...prevProfile.company,
                projects: [
                    ...(prevProfile.company?.projects || []),
                    {
                        projectName: '',
                        projectDescription: '',
                        projectStartDate: '',
                        projectEndDate: '',
                        projectStatus: '',
                        isPrivate: false,
                    }
                ]
            }
        }));
    };





    const removeProject = (index) => {
        const updatedProjects = profile.company?.projects?.filter((_, idx) => idx !== index);
        setProfile(prevProfile => ({
            ...prevProfile,
            company: {
                ...prevProfile.company,
                projects: updatedProjects
            }
        }));
    };

    const handleCloseForm = () => {
        setDirection(1);
        setCurrentStep(1);
        setFormKey((prev) => prev + 1);  // Formu resetlemek için key değiştiriyoruz
        // Step'i başa alıyoruz
        setShowForm(false);  // Formu kapatıyoruz
    };


    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="w-full px-4 py-10">
                <div className="max-w-[1100px] mx-auto bg-gray-100 rounded-xl p-10 space-y-10 shadow-md">
                    <div className="bg-white shadow rounded-md overflow-hidden">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 mb-6">
                                {error}
                            </div>
                        )}

                        <div className="p-6">

                            {!showForm && (

                                <div
                                    style={{borderRadius: "15px", padding: "10px"}}
                                    className="flex max-w-6xl mx-auto rounded-lg overflow-hidden shadow-lg bg-white">
                                    {/* Sol Lacivert Sidebar */}
                                    <div
                                        style={{backgroundColor: "#f8f9f9", borderRadius: "15px", padding: "10px"}}
                                        className="w-1/3 bg-gray-100 p-4 rounded-lg">
                                        {/* Lacivert içerik kutusu */}
                                        <div
                                            style={{backgroundColor: "#000842", borderRadius: "15px", padding: "10px"}}
                                            className="bg-blue-900 text-white p-6 rounded-lg space-y-4 flex flex-col items-center shadow-md">
                                            {/* Profil Foto */}
                                            {/*<img src="/profile-placeholder.png" alt="Profile"*/}
                                            {/*     className="w-24 h-24 rounded-full border-4 border-white"/>*/}
                                            <h2 className="text-xl font-bold"> {profile.employerName || ''} {profile.employerLastName || ''}</h2>

                                            {/* Bilgi listesi */}
                                            <div className="space-y-2 text-sm w-full">
                                                <p><strong>Employer Name:</strong> {profile.employerName || '-'}</p>
                                                <p><strong>Employer Surname</strong> {profile.employerLastName || '-'}
                                                </p>

                                            </div>
                                        </div>
                                        <div className="text-center mt-3">
                                            <button
                                                style={{backgroundColor: '#0C21C1', borderColor: '#0C21C2'}}
                                                onClick={handleSubmit}
                                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                            >
                                                Save Changes
                                            </button>
                                        </div>
                                    </div>


                                    {/* Sağ Taraftaki Bilgi Alanları */}

                                    <div
                                        style={{backgroundColor: "#f8f9f9", borderRadius: "15px", padding: "10px"}}
                                        className="w-2/3 bg-gray-100 p-4 rounded-lg"
                                    >
                                        <div style={{borderRadius: "15px", padding: "10px"}}
                                             className="bg-white p-8 rounded-lg space-y-6 shadow-md">

                                            {/* Company Information */}
                                            <div>
                                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                                    <BuildingOffice2Icon
                                                        className="text-blue-600"
                                                        style={{ width: '40px', height: '40px' }}
                                                    />

                                                    Company Information
                                                </h3>

                                                <div
                                                    className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                                                    <p><strong>Company Name:</strong> <span
                                                        className="text-gray-600">{profile.company?.companyName || 'Not specified'}</span>
                                                    </p>
                                                    <p><strong>Company Vision:</strong> <span
                                                        className="text-gray-600">{profile.company?.vision || 'Not specified'}</span>
                                                    </p>
                                                    <p><strong>Company Mission:</strong> <span
                                                        className="text-gray-600">{profile.company?.mission || 'Not specified'}</span>
                                                    </p>
                                                    <p><strong>Industry:</strong> <span
                                                        className="text-gray-600">{profile.company?.industry || 'Not specified'}</span>
                                                    </p>
                                                    <p><strong>Size:</strong> <span
                                                        className="text-gray-600">{profile.company?.employeeCount || 'Not specified'}</span>
                                                    </p>
                                                    <p><strong>Established Date:</strong> <span
                                                        className="text-gray-600">{profile.company?.establishedDate || 'Not specified'}</span>
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Company Contact Information */}
                                            <div>
                                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                                    <PhoneIcon className="text-green-600"
                                                               style={{ width: '40px', height: '40px' }}
                                                    />

                                                    Contact Information
                                                </h3>

                                                <div className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                                                    <p>
                                                        <strong>Email:</strong> {profile.company?.email || 'Not specified'}
                                                    </p>
                                                    <p>
                                                        <strong>Phone:</strong> {profile.company?.phoneNumber || 'Not specified'}
                                                    </p>
                                                    <p>
                                                        <strong>Website:</strong> {profile.company?.websiteUrl || 'Not specified'}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Projects */}
                                            <div>
                                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                                    <BriefcaseIcon className="text-purple-600"
                                                                   style={{ width: '40px', height: '40px' }}
                                                    />
                                                    Projects
                                                </h3>

                                                {profile.company?.projects && profile.company.projects.length > 0 ? (
                                                    profile.company.projects.map((proj, idx) => (
                                                        <div key={idx}
                                                             className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                                                            <p><strong>Project Name:</strong> {proj.projectName || '-'}
                                                            </p>
                                                            <p>
                                                                <strong>Description:</strong> {proj.projectDescription || '-'}
                                                            </p>
                                                            <p><strong>Status:</strong> {proj.projectStatus || '-'}</p>
                                                            <p><strong>Start
                                                                Date:</strong> {proj.projectStartDate || '-'}</p>
                                                            <p><strong>End Date:</strong> {proj.projectEndDate || '-'}
                                                            </p>
                                                            <p><strong>Private:</strong> {proj.isPrivate ? 'Yes' : 'No'}
                                                            </p>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-gray-500">No projects added.</p>
                                                )}
                                            </div>

                                            {/* Update Button */}
                                            <div className="pt-4 text-right">
                                                <button
                                                    style={{backgroundColor: '#0C21C1', borderColor: '#0C21C1'}}
                                                    onClick={() => setShowForm(true)}
                                                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                                                >
                                                    Update Information
                                                </button>
                                            </div>

                                        </div>
                                    </div>


                                </div>


                            )}
                            <AnimatePresence mode="wait" custom={direction}>
                                {currentStep === 1 && showForm && (
                                    <motion.div
                                        key={currentStep}
                                        custom={direction} // ileri veya geri
                                        initial={{x: direction === 1 ? '100%' : '-100%', opacity: 0}}
                                        animate={{x: 0, opacity: 1}}
                                        exit={{x: direction === 1 ? '-100%' : '100%', opacity: 0}}
                                        transition={{type: 'tween', ease: 'easeInOut', duration: 0.4}}
                                    >

                                        <div className="bg-gray-50 p-4 rounded-md">

                                            <div className="flex justify-between items-center">
                                                <h3 className="text-xl font-semibold text-black mb-3">Company
                                                    Informations</h3>
                                                <button onClick={() => setShowForm(false)}
                                                        className="text-gray-500 hover:text-gray-700 mb-3">✕
                                                </button>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="relative w-full flex items-center space-x-4">
                                                    <div className="flex-1 mb-0">
                                                        <div
                                                            className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                                                            <label htmlFor="employeeCount"
                                                                   className="text-sm font-semibold text-gray-500">
                                                                Company
                                                                Name
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 mb-0">
                                                        <input
                                                            type="text"
                                                            name="companyName"
                                                            value={profile?.company?.companyName || ''}
                                                            onChange={(e) => handleProfileFieldChange(['company', 'companyName'], e.target.value)}

                                                            className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                                        />
                                                    </div>
                                                    </div>

                                                    <div className="relative w-full flex items-center space-x-4">
                                                    <textarea
                                                        placeholder="Company Vision"
                                                        name="vision"
                                                        value={profile?.company?.vision || ''}
                                                        onChange={(e) => handleProfileFieldChange(['company', 'vision'], e.target.value)}

                                                        className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                                    />
                                                    </div>

                                                    <div className="relative w-full flex items-center space-x-4">

                                                        <textarea
                                                            placeholder="Company Mission"
                                                            name="mission"
                                                            value={profile?.company?.mission || ''}
                                                            onChange={(e) => handleProfileFieldChange(['company', 'mission'], e.target.value)}

                                                            className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                                        />

                                                    </div>

                                                    <div className="relative w-full flex items-center space-x-4">
                                                        <div className="flex-1 mb-0">
                                                            <div
                                                                className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                                                                <label htmlFor="employeeCount"
                                                                       className="text-sm font-semibold text-gray-500">
                                                                    Industry
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 mb-0">
                                                            <input
                                                                type="text"
                                                                name="industry"
                                                                value={profile?.company?.industry || ''}
                                                                onChange={(e) => handleProfileFieldChange(['company', 'industry'], e.target.value)}
                                                                className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="relative w-full flex items-center space-x-4">
                                                        <div className="flex-1 mb-0">
                                                            <div
                                                                className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                                                                <label htmlFor="employeeCount"
                                                                       className="text-sm font-semibold text-gray-500">
                                                                    Company Size

                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 mb-0">
                                                            <select
                                                                name="employeeCount"
                                                                value={profile.company?.employeeCount || ''}
                                                                onChange={(e) => handleProfileFieldChange(['company', 'employeeCount'], e.target.value)}
                                                                className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
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

                                                    <div className="relative w-full flex items-center space-x-4">
                                                        <div className="flex-1 mb-0">
                                                            <div
                                                                className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                                                                <label htmlFor="establishedDate"
                                                                       className="text-sm font-semibold text-gray-500">
                                                                    Established Date
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 mb-0">
                                                            <input
                                                                type="date"
                                                                value={profile.company?.establishedDate}
                                                                onChange={(e) => handleProfileFieldChange(['company', 'establishedDate'], e.target.value)}
                                                                placeholder="Established Date"
                                                                className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                                            />
                                                        </div>
                                                    </div>

                                                </div>
                                                <div>
                                                <br/>
                                                <div style={{textAlign: 'right'}}>
                                                    <div className="flex justify-between">
                                                        <button onClick={handleBackStep}
                                                                className="bg-black text-white px-4 py-2 rounded">Back
                                                        </button>
                                                        <div className="flex justify-end">
                                                            <button onClick={handleNextStep}
                                                                    className="bg-black text-white px-4 py-2 rounded">Next
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </motion.div>
                                )}
                                {currentStep === 2 && showForm && (
                                    <motion.div
                                        key={currentStep}
                                        custom={direction} // ileri veya geri
                                        initial={{x: direction === 1 ? '100%' : '-100%', opacity: 0}}
                                        animate={{x: 0, opacity: 1}}
                                        exit={{x: direction === 1 ? '-100%' : '100%', opacity: 0}}
                                        transition={{type: 'tween', ease: 'easeInOut', duration: 0.4}}
                                    >
                                        <div>

                                            <div className="bg-gray-50 p-4 rounded-md">
                                                <div className="flex justify-between items-center">
                                                    <h3 className="text-xl font-semibold text-black mb-3">Company
                                                        Contact Information</h3>
                                                    <button onClick={() => setShowForm(false)}
                                                            className="text-gray-500 hover:text-gray-700 mb-3">✕
                                                    </button>
                                                </div>
                                                <div className="space-y-4">
                                                    <div className="relative w-full flex items-center space-x-4">
                                                        <div className="flex-1 mb-0">
                                                            <div
                                                                className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                                                                <label htmlFor="email"
                                                                       className="text-sm font-semibold text-gray-500">
                                                                    Email
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 mb-0">
                                                            <input
                                                                type="email"
                                                                name="email"
                                                                value={profile.company?.email || ''}
                                                                onChange={(e) => handleProfileFieldChange(['company', 'email'], e.target.value)}
                                                                className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                                            />
                                                        </div>
                                                        </div>
                                                    <div className="relative w-full flex items-center space-x-4">
                                                        <div className="flex-1 mb-0">
                                                            <div
                                                                className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                                                                <label htmlFor="establishedDate"
                                                                       className="text-sm font-semibold text-gray-500">
                                                                    Phone
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 mb-0">

                                                            <input
                                                                type="text"
                                                                name="phoneNumber"
                                                                value={profile.company?.phoneNumber || ''}
                                                                onChange={(e) => handleProfileFieldChange(['company', 'phoneNumber'], e.target.value)}
                                                                className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                                            />
                                                        </div>
                                                        </div>
                                                        <div className="relative w-full flex items-center space-x-4">
                                                            <div className="flex-1 mb-0">
                                                                <div
                                                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                                                                    <label htmlFor="establishedDate"
                                                                           className="text-sm font-semibold text-gray-500">
                                                                        Website Url
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div className="flex-1 mb-0">

                                                                <input
                                                                    type="text"
                                                                    name="websiteUrl"
                                                                    value={profile.company?.websiteUrl || ''}
                                                                    onChange={(e) => handleProfileFieldChange(['company', 'websiteUrl'], e.target.value)}
                                                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                                                />
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div>
                                                    <br/>
                                                    <div style={{textAlign: 'right'}}>
                                                        <div className="flex justify-between">
                                                            <button onClick={handleBackStep}
                                                                    className="bg-black text-white px-4 py-2 rounded">Back
                                                            </button>
                                                            <div className="flex justify-end">
                                                                <button onClick={handleNextStep}
                                                                        className="bg-black text-white px-4 py-2 rounded">Next
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>


                                    </motion.div>
                                )}

                                {currentStep === 3 && showForm && (
                                    <motion.div
                                        key={currentStep}
                                        custom={direction} // ileri veya geri
                                        initial={{ x: direction === 1 ? '100%' : '-100%', opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: direction === 1 ? '-100%' : '100%', opacity: 0 }}
                                        transition={{ type: 'tween', ease: 'easeInOut', duration: 0.4 }}
                                    >
                                        <div>
                                            <div className="bg-gray-50 p-4 rounded-md">
                                                <div className="flex justify-between items-center">
                                                    <h3 className="text-xl font-semibold text-black mb-3">Projects</h3>
                                                    <button
                                                        onClick={() => setShowForm(false)}
                                                        className="text-gray-500 hover:text-gray-700 mb-3"
                                                    >
                                                        ✕
                                                    </button>


                                                </div>

                                                {profile.company?.projects?.map((project, index) => (
                                                    <div key={index} className="space-y-4 mt-6">
                                                        <div className="relative w-full flex items-center space-x-4">
                                                            <div className="flex-1 mb-0">
                                                                <input
                                                                    type="text"
                                                                    name="projectName"
                                                                    value={project.projectName}
                                                                    onChange={(e) => handleProfileFieldChange(['company','projects', index, 'projectName'], e.target.value)}
                                                                    placeholder="Project Name"
                                                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="relative w-full flex items-center space-x-4">
                                                                <textarea
                                                                    value={project.projectDescription}
                                                                    onChange={(e) => handleProfileFieldChange(['company','projects', index, 'projectDescription'], e.target.value)}
                                                                    placeholder="Project Description"
                                                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                                                />
                                                        </div>

                                                        <div className="relative w-full flex items-center space-x-4">
                                                            <div className="flex-1 mb-0">
                                                                <div
                                                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                                                                    <label htmlFor="projectStartDate"
                                                                           className="text-sm font-semibold text-gray-500">
                                                                        Project Start Date
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div className="flex-1 mb-0">
                                                                <input
                                                                    type="date"
                                                                    value={project.projectStartDate}
                                                                    onChange={(e) => handleProfileFieldChange(['company', 'projects', index, 'projectStartDate'], e.target.value)}
                                                                    placeholder="Star Date"
                                                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="relative w-full flex items-center space-x-4">
                                                            <div className="flex-1 mb-0">
                                                                <div
                                                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                                                                    <label htmlFor="projectEndDate"
                                                                           className="text-sm font-semibold text-gray-500">
                                                                        Project End Date
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div className="flex-1 mb-0">
                                                                <input
                                                                    type="date"
                                                                    value={project.projectEndDate}
                                                                    onChange={(e) => handleProfileFieldChange(['company', 'projects', index, 'projectEndDate'], e.target.value)}
                                                                    placeholder="End Date"
                                                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="relative w-full flex items-center space-x-4">
                                                            <div className="flex-1 mb-0">
                                                                <div
                                                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                                                                    <label htmlFor="projectEndDate"
                                                                           className="text-sm font-semibold text-gray-500">
                                                                        Project Status
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div className="flex-1 mb-0">
                                                                <select
                                                                    value={project.projectStatus || ''}
                                                                    onChange={(e) => handleProfileFieldChange(['company', 'projects', index, 'projectStatus'], e.target.value)}
                                                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none mb-0"
                                                                >
                                                                    <option value="" disabled>Project Status</option>
                                                                    <option value="ONGOING">Ongoing</option>
                                                                    <option value="COMPLETED">Completed</option>
                                                                    <option value="ABANDONED">Abandoned</option>
                                                                </select>
                                                            </div>
                                                        </div>

                                                        <div
                                                            className="w-full border border-gray-300 p-3 rounded-md bg-white text-black mb-3">

                                                            <div className="flex items-center">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={project.isPrivate}
                                                                    onChange={(e) => {
                                                                        handleProfileFieldChange(['company', 'projects', index, 'isPrivate'], e.target.checked);
                                                                    }}
                                                                />

                                                                <span className="text-sm">&nbsp;Is private?</span>

                                                            </div>

                                                        </div>

                                                        <div className="text-right mb-3">
                                                            <button
                                                                onClick={() => removeProject(index)}
                                                                className="bg-black text-white px-4 py-2 rounded"
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}

                                                <div>
                                                    <button
                                                        onClick={addProject}
                                                        className="bg-black text-white px-4 py-2 rounded mb-3"
                                                    >
                                                        Add Project
                                                    </button>
                                                    <br/>
                                                    <div style={{textAlign: 'right'}}>
                                                        <div className="flex justify-between">
                                                            <button
                                                                onClick={handleBackStep}
                                                                className="bg-black text-white px-4 py-2 rounded"
                                                            >
                                                                Back
                                                            </button>
                                                            <button
                                                                style={{
                                                                    backgroundColor: '#0C21C1',
                                                                    borderColor: '#0C21C1'
                                                                }}
                                                                onClick={handleCloseForm}
                                                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                                                            >
                                                                    Done
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                    )}

                            </AnimatePresence>

                        </div>
                    </div>
                </div>
                <Toast message={message} show={showToast} onClose={handleCloseToast} />

            </div>
        </div>
    );
};

export default EmployerProfile;
