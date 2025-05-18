import {useEffect, useState} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import axios from "axios";

export default function JobSeekerDashboard() {
  const [showForm, setShowForm] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountryId, setSelectedCountryId] = useState(null);

  const [profileData, setProfileData] = useState({
    profileDetails: {
      aboutMe: '',
      nationality: null,
      gender: null,
      militaryStatus: null,
      militaryDefermentDate: '',
      disabilityStatus: null,
      maritalStatus: null,
      currentEmploymentStatus: false,
      drivingLicense: false,
      isPrivateProfile: false,
      profilePicture: '',
      birthDate: '',
      firstName: '',
      jobTitle: ''
    },
    socialLinks: {
      githubUrl: '',
      linkedinUrl: '',
      websiteUrl: '',
      blogUrl: '',
      otherLinksUrl: '',
      otherLinksDescription: ''
    },
    contactInformation: {
      phoneNumber: '',
      country: null,
      city: null
    },
    jobPreferences: {
      preferredPositions: [{ positionType: null , customJobPosition: { positionName: '' } }],
      preferredWorkType: null,
      minWorkHour: 0,
      maxWorkHour: 0,
      canTravel: false,
      expectedSalary: ''
    },
    references: [
      {
        referenceName: '',
        referenceCompany: '',
        referenceJobTitle: '',
        referenceContactInfo: '',
        referenceYearsWorked: ''
      }
    ],
    languageProficiency: [
      {
        language: '',
        readingLevel: null,
        writingLevel: null,
        speakingLevel: null,
        listeningLevel: null
      }
    ],
    hobbies: [
      {
        hobbyName: '',
        description: ''
      }
    ],
    education: {
      degreeType: null,
      associateDepartment: null,
      associateStartDate: '',
      associateEndDate: '',
      associateIsOngoing: false,
      bachelorDepartment: null,
      bachelorStartDate: '',
      bachelorEndDate: '',
      bachelorIsOngoing: false,
      masterDepartment: null,
      masterStartDate: '',
      masterEndDate: '',
      masterIsOngoing: false,
      masterThesisTitle: '',
      masterThesisDescription: '',
      masterThesisUrl: '',
      doctorateDepartment: null,
      doctorateStartDate: '',
      doctorateEndDate: '',
      doctorateIsOngoing: false,
      doctorateThesisTitle: '',
      doctorateThesisDescription: '',
      doctorateThesisUrl: '',
      isDoubleMajor: false,
      doubleMajorDepartment: null,
      doubleMajorStartDate: '',
      doubleMajorEndDate: '',
      doubleMajorIsOngoing: false,
      isMinor: false,
      minorDepartment: null,
      minorStartDate: '',
      minorEndDate: '',
      minorIsOngoing: false
    },
    certifications: [
      {
        certificationName: '',
        certificationUrl: '',
        certificateValidityDate: '',
        issuedBy: ''
      }
    ],
    workExperiences: [
      {
        companyName: '',
        industry: '',
        jobTitle: '',
        jobDescription: '',
        employmentType: null,
        startDate: '',
        endDate: '',
        isGoing: false
      }
    ],
    examsAndAchievements: [
      {
        examName: '',
        examYear: '',
        examScore: '',
        examRank: ''
      }
    ],
    uploadedDocuments: [
      {
        documentName: '',
        documentType: null,
        documentCategory: null,
        documentUrl: '',
        isPrivate: false
      }
    ],
    skills: [
      {
        skillName: '',
        skillLevel: null
      }
    ],
    projects: [
      {
        projectName: '',
        projectDescription: '',
        projectStartDate: '',
        projectEndDate: '',
        projectStatus: null,
        isPrivate: false,
        company: null
      }
    ]
  });
  // useEffect(() => {
  //   const id = localStorage.getItem("id");
  //   const token = localStorage.getItem("token");
  //
  //   if (id && token) {
  //     fetch(`http://localhost:9090/candidate/references/${id}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     })
  //         .then(res => {
  //           if (!res.ok) {
  //             throw new Error("Yetkisiz erişim");
  //           }
  //           return res.json();
  //         })
  //         .then(data => {
  //           if (data) {
  //             setProfileData(prev => ({
  //               ...prev,
  //               ...data
  //             }));
  //           }
  //         })
  //         .catch(err => {
  //           console.error("Profil yüklenemedi:", err);
  //         });
  //   }
  // }, []);


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("Kullanıcı giriş yapmamış");
      return;
    }

    fetch("http://localhost:9090/location/countries", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
        .then((res) => res.json())
        .then((data) => setCountries(data))
        .catch((err) => console.error("Ülke verisi alınamadı:", err));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !selectedCountryId) return;

    fetch(`http://localhost:9090/location/cities/${selectedCountryId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
        .then((res) => res.json())
        .then((data) => setCities(data))
        .catch((err) => console.error("Şehir verisi alınamadı:", err));
  }, [selectedCountryId]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const id =localStorage.getItem('id');
    if (!token && !id) {
      console.log('User not logged in');
      return;
    }


    fetch(`http://localhost:9090/candidate/profile/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          setProfileData(data);
        })
        .catch(err => console.error("Unable to fetch profile", err));


  }, []);


  const addReference = () => {
    setProfileData({
      ...profileData,
      references: [
        ...profileData.references,
        {
          referenceName: '',
          referenceJobTitle: '',
          referenceCompany: '',
          referenceContactInfo: '',
          referenceYearsWorked: ''
        }
      ]
    });
  };



  const removeReference = (index) => {
    setProfileData((prevData) => ({
      ...prevData,
      references: prevData.references.filter((_, i) => i !== index),
    }));
  };
  const addLanguageSkill = () => {
    setProfileData({
      ...profileData,
      languageProficiency: [
        ...profileData. languageProficiency,
        {
          language: '',
          readingLevel: null,
          writingLevel: null,
          speakingLevel: null,
          listeningLevel: null
        }
      ]
    });
  };

  const removeLanguageSkill = (index) => {
    setProfileData((prevData) => ({
      ...prevData,
      languageProficiency: prevData.languageProficiency.filter((_, i) => i !== index),
    }));
  };
  const addHobby = () => {
    setProfileData({
      ...profileData,
      hobbies: [
        ...profileData. hobbies,
        {
          hobbyName: '',
          description: '',
        }
      ]
    });
  };

  const removeHobby = (index) => {
    setProfileData((prevData) => ({
      ...prevData,
      hobbies: prevData.hobbies.filter((_, i) => i !== index),
    }));
  };


  const addEducation = () => {
    setProfileData((prevData) => {
      const updatedEducation = { ...prevData.education };

      // Degree Type'a göre eğitim ekle
      if (updatedEducation.degreeType === 'ASSOCIATE') {
        updatedEducation.associateDepartment = null;
        updatedEducation.associateStartDate = '';
        updatedEducation.associateEndDate = '';
        updatedEducation.associateIsOngoing = false;
      } else if (updatedEducation.degreeType === 'BACHELOR') {
        updatedEducation.bachelorDepartment =null;
        updatedEducation.bachelorStartDate = '';
        updatedEducation.bachelorEndDate = '';
        updatedEducation.bachelorIsOngoing = false;
      } else if (updatedEducation.degreeType === 'MASTER') {
        updatedEducation.masterDepartment = null;
        updatedEducation.masterStartDate = '';
        updatedEducation.masterEndDate = '';
        updatedEducation.masterIsOngoing = false;
        updatedEducation.masterThesisTitle = '';
        updatedEducation.masterThesisDescription = '';
        updatedEducation.masterThesisUrl = '';
      } else if (updatedEducation.degreeType === 'DOCTORATE') {
        updatedEducation.doctorateDepartment =null;
        updatedEducation.doctorateStartDate = '';
        updatedEducation.doctorateEndDate = '';
        updatedEducation.doctorateIsOngoing = false;
        updatedEducation.doctorateThesisTitle = '';
        updatedEducation.doctorateThesisDescription = '';
        updatedEducation.doctorateThesisUrl = '';
      } else if (updatedEducation.degreeType=== 'DOUBLE_MAJOR') {
        updatedEducation.isDoubleMajor=true;
        updatedEducation.doubleMajorDepartment = null;
        updatedEducation.doubleMajorStartDate = '';
        updatedEducation.doubleMajorEndDate = '';
        updatedEducation.doubleMajorIsOngoing = false;
      } else if (updatedEducation.degreeType==='MINOR') {
        updatedEducation.isMinor=true;
        updatedEducation.minorDepartment = null;
        updatedEducation.minorStartDate = '';
        updatedEducation.minorEndDate = '';
        updatedEducation.minorIsOngoing = false;
      }

      return {
        ...prevData,
        education: updatedEducation,
      };
    });
  };

  const removeEducation = () => {
    setProfileData((prevData) => {
      const updatedEducation = { ...prevData.education };

      // Degree Type'a göre eğitim sil
      if (updatedEducation.degreeType === 'ASSOCIATE') {
        updatedEducation.associateDepartment = null;
        updatedEducation.associateStartDate = '';
        updatedEducation.associateEndDate = '';
        updatedEducation.associateIsOngoing = false;
      } else if (updatedEducation.degreeType === 'BACHELOR') {
        updatedEducation.bachelorDepartment = null;
        updatedEducation.bachelorStartDate = '';
        updatedEducation.bachelorEndDate = '';
        updatedEducation.bachelorIsOngoing = false;
      } else if (updatedEducation.degreeType === 'MASTER') {
        updatedEducation.masterDepartment = null;
        updatedEducation.masterStartDate = '';
        updatedEducation.masterEndDate = '';
        updatedEducation.masterIsOngoing = false;
        updatedEducation.masterThesisTitle = '';
        updatedEducation.masterThesisDescription = '';
        updatedEducation.masterThesisUrl = '';
      } else if (updatedEducation.degreeType === 'DOCTORATE') {
        updatedEducation.doctorateDepartment = null;
        updatedEducation.doctorateStartDate = '';
        updatedEducation.doctorateEndDate = '';
        updatedEducation.doctorateIsOngoing = false;
        updatedEducation.doctorateThesisTitle = '';
        updatedEducation.doctorateThesisDescription = '';
        updatedEducation.doctorateThesisUrl = '';
      } else if (updatedEducation.isDoubleMajor) {
        updatedEducation.doubleMajorDepartment = null;
        updatedEducation.doubleMajorStartDate = '';
        updatedEducation.doubleMajorEndDate = '';
        updatedEducation.doubleMajorIsOngoing = false;
      } else if (updatedEducation.isMinor) {
        updatedEducation.minorDepartment =null;
        updatedEducation.minorStartDate = '';
        updatedEducation.minorEndDate = '';
        updatedEducation.minorIsOngoing = false;
      }

      return {
        ...prevData,
        education: updatedEducation,
      };
    });
  };



  // const removeEducation = (index) => {
  //   setProfileData((prevData) => ({
  //     ...prevData,
  //     education: prevData.education.filter((_, i) => i !== index),
  //   }));
  // };

  const addCertification = () => {
    setProfileData({
      ...profileData,
      certifications: [
        ...profileData.certifications,
        {
          certificationName: '',
          certificationUrl: '',
          certificateValidityDate: '',
          issuedBy: ''
        }
      ]
    });
  };


  const removeCertification = (index) => {
    setProfileData((prevData) => ({
      ...prevData,
      certifications: prevData.certifications.filter((_, i) => i !== index),
    }));
  };

  const addJobExperience = () => {
    setProfileData({
      ...profileData,
      workExperiences: [
        ...profileData.workExperiences,
        {
          companyName: '',
          industry: '',
          jobTitle: '',
          jobDescription: '',
          employmentType: null,  // Enum type: 'FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE'
          startDate: '',
          endDate: '',
          isGoing: false
        }
      ]
    });
  };

  const removeJobExperience = (index) => {
    setProfileData((prevData) => ({
      ...prevData,
      workExperiences: prevData.workExperiences.filter((_, i) => i !== index),
    }));
  };

  const addExam = () => {
    setProfileData(prev => ({
      ...prev,
      examsAndAchievements: [
        ...prev.examsAndAchievements,
        { examName: '', examYear: '', examScore: '', examRank: '' }
      ]
    }));
  };

  const removeExam = (indexToRemove) => {
    setProfileData(prev => ({
      ...prev,
      examsAndAchievements: prev.examsAndAchievements.filter((_, index) => index !== indexToRemove)
    }));
  };

  const addDocument = () => {
    setProfileData(prev => ({
      ...prev,
      uploadedDocuments: [
        ...prev.uploadedDocuments,
        {
          documentName: "",
          documentType: "",
          documentCategory: null,
          documentUrl: "",
          isPrivate: false,
        }
      ]
    }));
  };

  const removeDocument = (index) => {
    setProfileData(prev => ({
      ...prev,
      uploadedDocuments: prev.uploadedDocuments.filter((_, i) => i !== index)
    }));
  };

  const addSkill = () => {
    setProfileData(prev => ({
      ...prev,
      skills: [
        ...prev.skills,
        {
          skillName: "",
          skillLevel: ""
        }
      ]
    }));
  };

  const removeSkill = (index) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addProject = () => {
    setProfileData(prev => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          projectName: "",
          projectDescription: "",
          projectStartDate: "",
          projectEndDate: "",
          projectStatus: "",
          isPrivate: false
        }
      ]
    }));
  };

  const removeProject = (index) => {
    setProfileData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };


  // Step number
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);

  // Panel open/close function
  const handleNextStep = () => {
    setDirection(1);
    setCurrentStep((prev) => prev + 1);
  };

  const handleBackStep = () => {
    setDirection(-1);
    setCurrentStep((prev) => prev - 1);
  };

  // Profile field change function
  const handleProfileFieldChange = (path, value) => {
    setProfileData(prev => {
      const updated = { ...prev };
      let target = updated;
      for (let i = 0; i < path.length - 1; i++) {
        target = target[path[i]];
      }
      target[path[path.length - 1]] = value;
      return updated;
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("Kullanıcı giriş yapmamış");
        return;
      }

      const response = await fetch('http://localhost:9090/candidate/updateProfile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        throw new Error('Profil oluşturulamadı');
      }

      const data = await response.json();
      console.log('Profil başarıyla oluşturuldu:', data);

      // Başarılıysa pencere kapat veya yönlendir
    } catch (error) {
      console.error('Hata:', error);
    }
  };



  const handleCloseForm = () => {
    setDirection(1);
    setCurrentStep(1);   // Step'i başa alıyoruz
    setFormKey((prev) => prev + 1);  // Formu resetlemek için key değiştiriyoruz
    setShowForm(false);  // Formu kapatıyoruz
  };

  const handlePositionSelectChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);

    const updatedPreferredPositions = selectedOptions.map(positionType => {
      if (positionType === "CUSTOM") {
        // Önceki custom değer varsa onu koru
        const existingCustom = profileData.jobPreferences.preferredPositions.find(pos => pos.positionType === "CUSTOM");
        return {
          positionType: "CUSTOM",
          customJobPosition: { positionName: existingCustom?.customJobPosition?.positionName || '' }
        };
      } else {
        return {
          positionType,
          customJobPosition: { positionName: '' }
        };
      }
    });

    setProfileData(prev => ({
      ...prev,
      jobPreferences: {
        ...prev.jobPreferences,
        preferredPositions: updatedPreferredPositions
      }
    }));
  };
  const handleCustomPositionChange = (e) => {
    const customName = e.target.value;

    const updatedPreferredPositions = profileData.jobPreferences.preferredPositions.map(pos => {
      if (pos.positionType === "CUSTOM") {
        return {
          ...pos,
          customJobPosition: { positionName: customName }
        };
      }
      return pos;
    });

    setProfileData(prev => ({
      ...prev,
      jobPreferences: {
        ...prev.jobPreferences,
        preferredPositions: updatedPreferredPositions
      }
    }));
  };


  return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="w-full px-4 py-10">
          <div className="max-w-[900px] mx-auto bg-gray-100 rounded-xl p-10 space-y-10 shadow-md">

            {!showForm && (
                //   <div className={`relative min-h-screen bg-gray-100 flex flex-col items-center justify-center transition-all duration-300 ${showForm ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                //   <h1 className="text-3xl font-bold mb-4">Hello World!</h1>
                //   <button
                //     onClick={() => setShowForm(true)}
                //     className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                //   >
                //     Bilgilerimi Güncelle
                //   </button>
                // </div>
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
                      <img src="/profile-placeholder.png" alt="Profile"
                           className="w-24 h-24 rounded-full border-4 border-white"/>
                      <h2 className="text-xl font-bold">{profileData.firstName || '-'} - {profileData.lastName || '-'}</h2>

                      {/* Bilgi listesi */}
                      <div className="space-y-2 text-sm w-full">
                        <p><strong>Nationality:</strong> {profileData.profileDetails?.nationality || '-'}</p>
                        <p><strong>Currently
                          Working:</strong> {profileData.profileDetails?.currentEmploymentStatus ? 'Yes' : 'No'}</p>
                        <p><strong>Phone:</strong> {profileData.contactInformation?.phoneNumber || '-'}</p>
                        <p>
                          <strong>Location:</strong> {profileData.contactInformation?.city?.name || '-'}, {profileData.contactInformation?.country?.name || '-'}
                        </p>
                        <p><strong>Gender:</strong> {profileData.profileDetails?.gender || '-'}</p>
                        <p><strong>Military Status:</strong> {profileData.profileDetails?.militaryStatus || '-'}</p>

                        {profileData.profileDetails?.militaryStatus === "DEFERRED" && (
                            <p><strong>Military Deferment
                              Date:</strong> {profileData.profileDetails?.militaryDefermentDate || '-'}</p>
                        )}

                        <p><strong>Disability Status:</strong> {profileData.profileDetails?.disabilityStatus || '-'}</p>
                        <p><strong>Marital Status:</strong> {profileData.profileDetails?.maritalStatus || '-'}</p>
                        <p><strong>Driving License:</strong> {profileData.profileDetails?.drivingLicense ? 'Yes' : 'No'}</p>
                        <p><strong>Profile
                          Privacy:</strong> {profileData.profileDetails?.isPrivateProfile ? 'Private' : 'Public'}</p>
                        <p><strong>Github:</strong> {profileData.socialLinks?.githubUrl || '-'}</p>
                        <p><strong>LinkedIn:</strong> {profileData.socialLinks?.linkedinUrl || '-'}</p>
                        <p><strong>Portfolio:</strong> {profileData.socialLinks?.websiteUrl || '-'}</p>
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
                      className="w-2/3 bg-gray-100 p-4 rounded-lg">
                    {/* İç Beyaz Kutu */}
                    <div style={{borderRadius: "15px", padding: "10px"}}
                         className="bg-white p-8 rounded-lg space-y-6 shadow-md">

                      {/* About Me */}
                      <div>
                        <h3 className="text-lg font-semibold mb-2">About Me</h3>
                        <p className="text-gray-700">{profileData.profileDetails?.aboutMe || '-'}</p>
                      </div>

                      {/* Work Experiences */}
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Work Experiences</h3>
                        {profileData.workExperiences?.length > 0 && profileData.workExperiences[0].companyName ? (
                            profileData.workExperiences.map((exp, idx) => (
                                <div key={idx} className="border-b pb-2 mb-2">
                                  <p className="font-semibold">{exp.companyName}</p>
                                  <p>{exp.jobTitle} - {exp.industry}</p>
                                  <p>{exp.startDate} - {exp.isGoing ? 'Present' : exp.endDate}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No work experiences added.</p>
                        )}
                      </div>

                      {/* Education */}
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Education</h3>
                        {profileData.education?.length > 0 && profileData.education[0].bachelorDepartment ? (
                            <div className="border-b pb-2">
                              <p><strong>Bachelor:</strong> {profileData.education[0].bachelorDepartment} ({profileData.education[0].bachelorStartDate} - {profileData.education[0].bachelorIsOngoing ? 'Present' : profileData.education[0].bachelorEndDate})</p>
                              {profileData.education[0].masterDepartment && (
                                  <p><strong>Master:</strong> {profileData.education[0].masterDepartment} ({profileData.education[0].masterStartDate} - {profileData.education[0].masterIsOngoing ? 'Present' : profileData.education[0].masterEndDate})</p>
                              )}
                            </div>
                        ) : (
                            <p className="text-gray-500">No education details added.</p>
                        )}
                      </div>

                      {/* Skills */}
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Skills</h3>
                        {profileData.skills?.length > 0 && profileData.skills[0].skillName ? (
                            <div className="flex flex-wrap gap-2">
                              {profileData.skills?.map((skill, idx) => (
                                  <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{skill.skillName} ({skill.skillLevel})</span>
                              ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No skills added.</p>
                        )}
                      </div>

                      {/* Languages */}
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Language Proficiency</h3>
                        {profileData.languageProficiency?.length > 0 && profileData.languageProficiency[0].language ? (
                            profileData.languageProficiency.map((lang, idx) => (
                                <div key={idx} className="border-b pb-2 mb-2">
                                  <p className="font-semibold">{lang.language}</p>
                                  <p>Reading: {lang.readingLevel}, Writing: {lang.writingLevel}, Speaking: {lang.speakingLevel}, Listening: {lang.listeningLevel}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No languages added.</p>
                        )}
                      </div>

                      {/* Certifications */}
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Certifications</h3>
                        {profileData.certifications?.length > 0 && profileData.certifications[0].certificationName ? (
                            profileData.certifications.map((cert, idx) => (
                                <div key={idx} className="border-b pb-2 mb-2">
                                  <p className="font-semibold">{cert.certificationName}</p>
                                  <p>Issued by: {cert.issuedBy} ({cert.certificateValidityDate})</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No certifications added.</p>
                        )}
                      </div>

                      {/* Projects */}
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Projects</h3>
                        {profileData.projects.length > 0 && profileData.projects[0].projectName ? (
                            profileData.projects.map((proj, idx) => (
                                <div key={idx} className="border-b pb-2 mb-2">
                                  <p className="font-semibold">{proj.projectName}</p>
                                  <p>{proj.projectDescription}</p>
                                  <p>{proj.projectStartDate} - {proj.projectStatus}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No projects added.</p>
                        )}
                      </div>

                      {/* Exams & Achievements */}
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Exams & Achievements</h3>
                        {profileData.examsAndAchievements?.length > 0 && profileData.examsAndAchievements[0].examName ? (
                            profileData.examsAndAchievements.map((exam, idx) => (
                                <div key={idx} className="border-b pb-2 mb-2">
                                  <p className="font-semibold">{exam.examName} ({exam.examYear})</p>
                                  <p>Score: {exam.examScore}, Rank: {exam.examRank}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No achievements added.</p>
                        )}
                      </div>

                      {/* Hobbies */}
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Hobbies</h3>
                        {profileData.hobbies?.length > 0 && profileData.hobbies[0].hobbyName ? (
                            profileData.hobbies.map((hobby, idx) => (
                                <div key={idx} className="border-b pb-2 mb-2">
                                  <p className="font-semibold">{hobby.hobbyName}</p>
                                  <p>{hobby.description}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No hobbies added.</p>
                        )}
                      </div>

                      {/* Update Button */}
                      <button
                          style={{ backgroundColor: '#0C21C1', borderColor: '#0C21C1' }}
                          onClick={() => setShowForm(true)}
                          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Update Information
                      </button>

                    </div>
                  </div>


                </div>


            )}

            <AnimatePresence mode="wait" custom={direction}>
              {currentStep === 1 && showForm && (
                  <motion.div
                      key={currentStep}
                      custom={direction} // ileri veya geri
                      initial={{ x: direction === 1 ? '100%' : '-100%', opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: direction === 1 ? '-100%' : '100%', opacity: 0 }}
                      transition={{ type: 'tween', ease: 'easeInOut', duration: 0.4 }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">Update Profile Informations</h2>
                      <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                    </div>
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-black mb-0">Profile Details</h3>

                      {/* About Me */}
                      <textarea
                          placeholder="About Me"
                          value={profileData.profileDetails?.aboutMe}
                          onChange={(e) => handleProfileFieldChange(['profileDetails', 'aboutMe'], e.target.value)}
                          className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                      />

                      <div className="relative w-full flex items-center space-x-4 mb-0">
                        <div className="flex-1 mb-0">
                          <div className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                            <label
                                htmlFor="profilePicture"
                                className="text-sm font-semibold text-gray-500"
                            >
                              Profile Picture
                            </label>
                          </div>
                        </div>
                        <div className="flex-1 mb-0">
                          <input
                              type="file"
                              id="profilePicture"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                handleProfileFieldChange(['profileDetails', 'profilePicture'], file);
                              }}
                              className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 mb-0"
                          />
                        </div>
                      </div>
                      {/* Birth Date */}
                      <div className="relative w-full flex items-center space-x-4 mb-0">
                        <div className="flex-1 mb-0">
                          <div className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                            <label htmlFor="birthDate" className="text-sm font-semibold text-gray-500">
                              Birth Date
                            </label>
                          </div>
                        </div>
                        <div className="flex-1 mb-0">
                          <input
                              type="date"
                              id="birthDate"
                              value={profileData.profileDetails?.birthDate}
                              onChange={(e) => handleProfileFieldChange(['profileDetails', 'birthDate'], e.target.value)}
                              className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 mb-0"
                          />
                        </div>
                      </div>

                      {/* Nationality */}
                      <select
                          value={profileData.profileDetails?.nationality}
                          onChange={(e) => handleProfileFieldChange(['profileDetails', 'nationality'], e.target.value)}
                          className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none mb-0"
                      >
                        <option value="" disabled>
                          Nationality
                        </option>
                        <option value="TURKISH">Turkish</option>
                        <option value="AMERICAN">American</option>
                        {/* Add other nationalities here */}
                      </select>

                      {/* Gender */}
                      <select
                          value={profileData.profileDetails?.gender}
                          onChange={(e) => handleProfileFieldChange(['profileDetails', 'gender'], e.target.value)}
                          className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none mb-0"
                      >
                        <option value="" disabled>
                          Gender
                        </option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </select>

                      {/* Military Status */}
                      <select
                          value={profileData.profileDetails?.militaryStatus}
                          onChange={(e) => handleProfileFieldChange(['profileDetails', 'militaryStatus'], e.target.value)}
                          className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none mb-0"
                      >
                        <option value="" disabled>
                          Military Status
                        </option>
                        <option value="DONE">Done</option>
                        <option value="NOT_DONE">Not Done</option>
                        <option value="DEFERRED">Deferred</option>
                        <option value="EXEMPTED">Exempted</option>
                      </select>

                      {/* Military Deferment Date (if DEFERRED) */}
                      {profileData.profileDetails?.militaryStatus === "DEFERRED" && (
                          <div className="relative w-full flex items-center space-x-4 mb-0">
                            <div className="flex-1 mb-0">
                              <div className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                                <label htmlFor="militaryDefermentDate" className="text-sm font-semibold text-gray-500">
                                  Military Deferment Date
                                </label>
                              </div>
                            </div>
                            <div className="flex-1 mb-0">
                              <input
                                  type="date"
                                  id="militaryDefermentDate"
                                  value={profileData.profileDetails?.militaryDefermentDate}
                                  onChange={(e) => handleProfileFieldChange(['profileDetails', 'militaryDefermentDate'], e.target.value)}
                                  className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 mb-0"
                              />
                            </div>
                          </div>
                      )}

                      {/* Disability Status */}
                      <select
                          value={profileData.profileDetails?.disabilityStatus}
                          onChange={(e) => handleProfileFieldChange(['profileDetails', 'disabilityStatus'], e.target.value)}
                          className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none mb-0"
                      >
                        <option value="" disabled>
                          Disability Status
                        </option>
                        <option value="DISABLED">Disabled</option>
                        <option value="NOT_DISABLED">Not Disabled</option>
                      </select>

                      {/* Marital Status */}
                      <select
                          value={profileData.profileDetails?.maritalStatus}
                          onChange={(e) => handleProfileFieldChange(['profileDetails', 'maritalStatus'], e.target.value)}
                          className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none mb-0"
                      >
                        <option value="" disabled>
                          Marital Status
                        </option>
                        <option value="SINGLE">Single</option>
                        <option value="MARRIED">Married</option>
                        <option value="DIVORCED">Divorced</option>
                        <option value="WIDOWED">Widowed</option>
                      </select>

                      {/* Checkbox Group (Current Employment, Driving License, Private Profile) */}
                      <div className="w-full border border-gray-300 p-3 rounded-md bg-white text-black mb-0">
                        <div className="flex space-x-3 mb-0">
                          {/* Currently Employed Checkbox */}
                          <div className="flex-1 mb-0">
                            <input
                                type="checkbox"
                                checked={profileData.profileDetails?.currentEmploymentStatus}
                                onChange={(e) => handleProfileFieldChange(['profileDetails', 'currentEmploymentStatus'], e.target.checked)}
                                className="border-gray-300"
                            />
                            <span className="text-sm"> &nbsp; Currently Employed</span>
                          </div>

                          {/* Has Driving License Checkbox */}
                          <div className="flex-1 mb-0">
                            <input
                                type="checkbox"
                                checked={profileData.profileDetails?.drivingLicense}
                                onChange={(e) => handleProfileFieldChange(['profileDetails', 'drivingLicense'], e.target.checked)}
                                className="border-gray-300"
                            />
                            <span className="text-sm "> &nbsp;Has Driving License</span>
                          </div>

                          {/* Private Profile Checkbox */}
                          <div className="flex-1 mb-0">
                            <input
                                type="checkbox"
                                checked={profileData.profileDetails?.isPrivateProfile}
                                onChange={(e) => handleProfileFieldChange(['profileDetails', 'isPrivateProfile'], e.target.checked)}
                                className="border-gray-300"
                            />
                            <span className="text-sm ">&nbsp; Private Profile</span>
                          </div>
                        </div>
                      </div>


                      <div>
                        <br/>
                        <div style={{textAlign: 'right'}}>
                          <button
                              onClick={handleNextStep}
                              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            Next Step
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
              )}


              {/* Step 2: Social Links Section */}
              {currentStep === 2 && showForm && (
                  <motion.div
                      key={currentStep}
                      custom={direction} // ileri veya geri
                      initial={{x: direction === 1 ? '100%' : '-100%', opacity: 0}}
                      animate={{x: 0, opacity: 1}}
                      exit={{x: direction === 1 ? '-100%' : '100%', opacity: 0}}
                      transition={{type: 'tween', ease: 'easeInOut', duration: 0.4}}
                  >
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold">Social Links</h3>

                      <input
                          type="text"
                          placeholder="GitHub URL"
                          value={profileData.socialLinks.githubUrl}
                          onChange={(e) => handleProfileFieldChange(['socialLinks', 'githubUrl'], e.target.value)}
                          className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                      />

                      <input
                          type="text"
                          placeholder="LinkedIn URL"
                          value={profileData.socialLinks.linkedinUrl}
                          onChange={(e) => handleProfileFieldChange(['socialLinks', 'linkedinUrl'], e.target.value)}
                          className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                      />

                      <input
                          type="text"
                          placeholder="Website URL"
                          value={profileData.socialLinks.websiteUrl}
                          onChange={(e) => handleProfileFieldChange(['socialLinks', 'websiteUrl'], e.target.value)}
                          className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                      />

                      <input
                          type="text"
                          placeholder="Blog URL"
                          value={profileData.socialLinks.blogUrl}
                          onChange={(e) => handleProfileFieldChange(['socialLinks', 'blogUrl'], e.target.value)}
                          className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                      />

                      <input
                          type="text"
                          placeholder="Other Links URL"
                          value={profileData.socialLinks.otherLinksUrl}
                          onChange={(e) => handleProfileFieldChange(['socialLinks', 'otherLinksUrl'], e.target.value)}
                          className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                      />

                      <textarea
                          placeholder="Other Links Description"
                          value={profileData.socialLinks.otherLinksDescription}
                          onChange={(e) => handleProfileFieldChange(['socialLinks', 'otherLinksDescription'], e.target.value)}
                          className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                      />


                      <div>
                        <br/>
                        <div style={{textAlign: 'right'}}>
                          <div className="flex justify-between">
                            <button onClick={handleBackStep} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Back</button>
                            <div className="flex justify-end">
                              <button onClick={handleNextStep} className="bg-blue-600 text-grey px-4 py-2 rounded-md hover:bg-blue-700">Next</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
              )}
              {currentStep === 3 && (
                  <motion.div
                      key={currentStep}
                      custom={direction} // ileri veya geri
                      initial={{ x: direction === 1 ? '100%' : '-100%', opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: direction === 1 ? '-100%' : '100%', opacity: 0 }}
                      transition={{ type: 'tween', ease: 'easeInOut', duration: 0.4 }}
                  >
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold">Contact Information</h3>

                      {/* Phone Number */}
                      <input
                          type="text"
                          placeholder="Phone Number"
                          value={profileData.contactInformation.phoneNumber}
                          onChange={(e) => handleProfileFieldChange(['contactInformation', 'phoneNumber'], e.target.value)}
                          className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none "  // margin-bottom ekledik
                      />

                      {/* Country */}
                      <select
                          value={selectedCountryId || ""}
                          onChange={(e) => {
                            const countryId = e.target.value;
                            setSelectedCountryId(countryId);
                            handleProfileFieldChange(["contactInformation", "countryId"], countryId); // backend'e göndereceğimiz id
                          }}
                          className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none "  // margin-bottom ekledik
                      >
                        <option value="">Select Country</option>
                        {countries.map((country) => (
                            <option key={country.id} value={country.id}>
                              {country.name}
                            </option>
                        ))}
                      </select>

                      {/* City */}
                      <select
                          value={profileData.contactInformation.cityId || ""}
                          onChange={(e) => handleProfileFieldChange(["contactInformation", "cityId"], e.target.value)}
                          className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none "  // margin-top kaldı
                      >
                        <option value="">Select City</option>
                        {cities.map((city) => (
                            <option key={city.id} value={city.id}>
                              {city.name}
                            </option>
                        ))}
                      </select>

                      {/* Buttons */}
                      <div>
                        <br />
                        <div style={{ textAlign: 'right' }}>
                          <div className="flex justify-between">
                            <button onClick={handleBackStep} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Back</button>
                            <div className="flex justify-end">
                              <button onClick={handleNextStep} className="bg-blue-600 text-grey px-4 py-2 rounded-md hover:bg-blue-700">Next</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
              )}


              {/* Step 4: Job Preferences Section */}
              {currentStep === 4 && (
                  <motion.div
                      key={currentStep}
                      custom={direction} // ileri veya geri
                      initial={{ x: direction === 1 ? '100%' : '-100%', opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: direction === 1 ? '-100%' : '100%', opacity: 0 }}
                      transition={{ type: 'tween', ease: 'easeInOut', duration: 0.4 }}
                  >
                    <div className="space-y-6">
                      <div>
                        <select
                            multiple
                            value={profileData.jobPreferences.preferredPositions.map(pos => pos.positionType)}
                            onChange={handlePositionSelectChange}
                            className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none mt-3 font-size:14px"
                        >
                          <option value="" disabled>Preferred Positions</option>
                          <option value="SOFTWARE_ENGINEER" className="border border-gray-300 p-2hover:bg-blue-200 " >Software
                            Engineer
                          </option>
                          <option value="FRONTEND_DEVELOPER" className="border border-gray-300 p-2 hover:bg-blue-200">Frontend
                            Developer
                          </option>
                          <option value="BACKEND_DEVELOPER" className="border border-gray-300 p-2 hover:bg-blue-200">Backend
                            Developer
                          </option>
                          <option value="MOBILE_DEVELOPER" className="border border-gray-300 p-2 hover:bg-blue-200">Mobile
                            Developer
                          </option>
                          <option value="GAME_DEVELOPER" className="border border-gray-300 p-2 hover:bg-blue-200">Game
                            Developer
                          </option>
                          <option value="EMBEDDED_SOFTWARE_ENGINEER"
                                  className="border border-gray-300 p-2 hover:bg-blue-200">Embedded Software Engineer
                          </option>
                          <option value="CUSTOM" className="border border-gray-300 p-2 hover:bg-blue-200">Custom Position
                          </option>
                        </select>

                        {/* Eğer "Custom" seçeneği seçildiyse input alanı göster */}
                        {profileData.jobPreferences.preferredPositions.some(pos => pos.positionType === "CUSTOM") && (
                            <div>
                              <input
                                  type="text"
                                  value={profileData.jobPreferences.preferredPositions.find(pos => pos.positionType === "CUSTOM")?.customJobPosition?.positionName || ''}
                                  onChange={handleCustomPositionChange}
                                  className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                  placeholder="Enter Custom Job Position"
                              />
                            </div>
                        )}
                      </div>


                      {/* Preferred Work Type */}
                      <select
                          value={profileData.jobPreferences.preferredWorkType}
                          onChange={(e) => handleProfileFieldChange(['jobPreferences', 'preferredWorkType'], e.target.value)}
                          className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                      >
                        <option value="" disabled>Preferred Work Type</option>
                        <option value="REMOTE">REMOTE</option>
                        <option value="HYBRID">HYBRID</option>
                        <option value="ON_SITE">ON_SITE</option>
                      </select>

                      {/* Min Work Hour */}

                      <div className="relative w-full flex items-center space-x-4 mb-0">
                        <div className="flex-1 mb-0">
                          <div className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                            <label htmlFor="minWorkHour" className="text-sm font-semibold text-gray-500">
                              Minimum Work Hour
                            </label>
                          </div>
                        </div>
                        <div className="flex-1 mb-0">
                          <input
                              type="number"
                              value={profileData.jobPreferences.minWorkHour}
                              onChange={(e) => handleProfileFieldChange(['jobPreferences', 'minWorkHour'], e.target.value)}
                              className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Max Work Hour */}
                      <div className="relative w-full flex items-center space-x-4 mb-0">
                        <div className="flex-1 mb-0">
                          <div className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                            <label htmlFor="maxWorkHour" className="text-sm font-semibold text-gray-500">
                              Maximum Work Hour
                            </label>
                          </div>
                        </div>
                        <div className="flex-1 mb-0">
                          <input
                              type="number"
                              value={profileData.jobPreferences.maxWorkHour}
                              onChange={(e) => handleProfileFieldChange(['jobPreferences', 'maxWorkHour'], e.target.value)}
                              className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Can Travel */}
                      <div className="w-full border border-gray-300 p-3 rounded-md bg-white text-black mb-0">
                        <div className="flex items-center">
                          <input
                              type="checkbox"
                              checked={profileData.jobPreferences.canTravel}
                              onChange={(e) => handleProfileFieldChange(['jobPreferences', 'canTravel'], e.target.checked)}
                              className="p-3"
                          />
                          <span className="text-sm "> Can Travel?</span> {/* ml-2 yerine ml-4 */}
                        </div>
                      </div>

                      {/* Expected Salary */}
                      <input
                          type="text"
                          value={profileData.jobPreferences.expectedSalary}
                          onChange={(e) => handleProfileFieldChange(['jobPreferences', 'expectedSalary'], e.target.value)}
                          placeholder="Expected Salary"
                          className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                      />

                      <div>
                        <br/>
                        <div style={{textAlign: 'right'}}>
                          <div className="flex justify-between">
                            <button onClick={handleBackStep}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Back
                            </button>
                            <div className="flex justify-end">
                              <button onClick={handleNextStep}
                                      className="bg-blue-600 text-grey px-4 py-2 rounded-md hover:bg-blue-700">Next
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
              )}
              {currentStep === 5 && (
                  <motion.div
                      key={currentStep}
                      custom={direction} // ileri veya geri
                      initial={{x: direction === 1 ? '100%' : '-100%', opacity: 0}}
                      animate={{x: 0, opacity: 1}}
                      exit={{x: direction === 1 ? '-100%' : '100%', opacity: 0}}
                      transition={{type: 'tween', ease: 'easeInOut', duration: 0.4}}
                  >
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold">References</h3>

                      {/* List of References */}
                      {profileData.references.map((reference, index) => (
                          <div key={index} className="space-y-4 mt-6">
                            <div className="relative w-full flex items-center space-x-4">
                              <div className="flex-1 mb-0">
                                <input
                                    type="text"
                                    value={reference.referenceName}
                                    onChange={(e) => handleProfileFieldChange(['references', index, 'referenceName'], e.target.value)}
                                    placeholder="Reference Name"
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="relative w-full flex items-center space-x-4">
                              <div className="flex-1 mb-0">
                                <input
                                    type="text"
                                    value={reference.referenceJobTitle}
                                    onChange={(e) => handleProfileFieldChange(['references', index, 'referenceJobTitle'], e.target.value)}
                                    placeholder="Job Title"
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="relative w-full flex items-center space-x-4">
                              <div className="flex-1 mb-0">
                                <input
                                    type="text"
                                    value={reference.referenceCompany}
                                    onChange={(e) => handleProfileFieldChange(['references', index, 'referenceCompany'], e.target.value)}
                                    placeholder="Company"
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="relative w-full flex items-center space-x-4">
                              <div className="flex-1 mb-0">
                                <input
                                    type="text"
                                    value={reference.referenceContactInfo}
                                    onChange={(e) => handleProfileFieldChange(['references', index, 'referenceContactInfo'], e.target.value)}
                                    placeholder="Contact Info"
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="relative w-full flex items-center space-x-4">
                              <div className="flex-1 mb-0">
                                <input
                                    type="text"
                                    value={reference.referenceYearsWorked}
                                    onChange={(e) => handleProfileFieldChange(['references', index, 'referenceYearsWorked'], e.target.value)}
                                    placeholder="Years Worked"
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none mb-3"
                                />
                              </div>
                            </div>
                            <div className="text-right mb-3">
                              <button
                                  onClick={() => removeReference(index)}
                                  className="text-red-600 text-sm "
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                      ))}

                      <div>
                        <br/>
                        <div className="flex justify-between mt-6">
                          {/* Add Reference Button */}
                          <button
                              onClick={addReference}
                              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                          >
                            Add Reference
                          </button>

                          {/* Next Step Button */}
                          <div className="flex justify-between">
                            <button onClick={handleBackStep} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Back</button>
                            <div className="flex justify-end">
                              <button onClick={handleNextStep} className="bg-blue-600 text-grey px-4 py-2 rounded-md hover:bg-blue-700">Next</button>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </motion.div>
              )}
              {currentStep === 6 && (
                  <motion.div
                      key={currentStep}
                      custom={direction} // ileri veya geri
                      initial={{ x: direction === 1 ? '100%' : '-100%', opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: direction === 1 ? '-100%' : '100%', opacity: 0 }}
                      transition={{ type: 'tween', ease: 'easeInOut', duration: 0.4 }}
                  >
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold">Language Skills</h3>

                      {/* List of Language Skills */}
                      {profileData.languageProficiency.map((languageProficiency, index) => (
                          <div key={index} className="space-y-4 mt-6">
                            <div className="relative w-full flex items-center space-x-4">
                              <div className="flex-1 mb-0">
                                <input
                                    type="text"
                                    value={languageProficiency.language}
                                    onChange={(e) => handleProfileFieldChange(['languageProficiency', index, 'language'], e.target.value)}
                                    placeholder="Language"
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                />
                              </div>
                            </div>

                            {/* Reading Level Select */}
                            <div className="relative w-full flex items-center space-x-4">
                              <div className="flex-1 mb-0">
                                <select
                                    value={languageProficiency.readingLevel}
                                    onChange={(e) => handleProfileFieldChange(['languageProficiency', index, 'readingLevel'], e.target.value)}
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                >
                                  <option value="" disabled>Reading Level</option>
                                  <option value="A1">A1</option>
                                  <option value="A2">A2</option>
                                  <option value="B1">B1</option>
                                  <option value="B2">B2</option>
                                  <option value="C1">C1</option>

                                </select>
                              </div>
                            </div>

                            {/* Writing Level Select */}
                            <div className="relative w-full flex items-center space-x-4">
                              <div className="flex-1 mb-0">
                                <select
                                    value={languageProficiency.writingLevel}
                                    onChange={(e) => handleProfileFieldChange(['languageProficiency', index, 'writingLevel'], e.target.value)}
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                >
                                  <option value="" disabled>Writing Level</option>
                                  <option value="A1">A1</option>
                                  <option value="A2">A2</option>
                                  <option value="B1">B1</option>
                                  <option value="B2">B2</option>
                                  <option value="C1">C1</option>

                                </select>
                              </div>
                            </div>

                            {/* Speaking Level Select */}
                            <div className="relative w-full flex items-center space-x-4">
                              <div className="flex-1 mb-0">
                                <select
                                    value={languageProficiency.speakingLevel}
                                    onChange={(e) => handleProfileFieldChange(['languageProficiency', index, 'speakingLevel'], e.target.value)}
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                >
                                  <option value="" disabled>Speaking Level</option>
                                  <option value="A1">A1</option>
                                  <option value="A2">A2</option>
                                  <option value="B1">B1</option>
                                  <option value="B2">B2</option>
                                  <option value="C1">C1</option>

                                </select>
                              </div>
                            </div>

                            {/* Listening Level Select */}
                            <div className="relative w-full flex items-center space-x-4">
                              <div className="flex-1 mb-0">
                                <select
                                    value={languageProficiency.listeningLevel}
                                    onChange={(e) => handleProfileFieldChange(['languageProficiency', index, 'listeningLevel'], e.target.value)}

                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none mb-3"
                                >
                                  <option value="" disabled>Listening Level</option>
                                  <option value="A1">A1</option>
                                  <option value="A2">A2</option>
                                  <option value="B1">B1</option>
                                  <option value="B2">B2</option>
                                  <option value="C1">C1</option>

                                </select>
                              </div>
                            </div>
                            <div className="text-right mb-3">
                              <button
                                  onClick={() => removeLanguageSkill(index)}
                                  className="text-red-600 text-sm "
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                      ))}
                      <br/>
                      <div className="flex justify-between mt-6">
                        {/* Add Language Skill Button */}
                        <button
                            onClick={addLanguageSkill}
                            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                          Add Language Skill
                        </button>

                        {/* Next Step Button */}
                        <div className="flex justify-between">
                          <button onClick={handleBackStep} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Back</button>
                          <div className="flex justify-end">
                            <button onClick={handleNextStep} className="bg-blue-600 text-grey px-4 py-2 rounded-md hover:bg-blue-700">Next</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
              )}

              {currentStep === 7 && (
                  <motion.div
                      key={currentStep}
                      custom={direction} // ileri veya geri
                      initial={{ x: direction === 1 ? '100%' : '-100%', opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: direction === 1 ? '-100%' : '100%', opacity: 0 }}
                      transition={{ type: 'tween', ease: 'easeInOut', duration: 0.4 }}
                  >
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold">Hobbies</h3>

                      {/* List of Language Skills */}
                      {profileData.hobbies.map((hobbies, index) => (
                          <div key={index} className="space-y-4 mt-6">
                            <div className="relative w-full flex items-center space-x-4">
                              <div className="flex-1 mb-0">
                                <input
                                    type="text"
                                    value={hobbies.hobbyName}
                                    onChange={(e) => handleProfileFieldChange(['hobbies', index, 'hobbyName'], e.target.value)}
                                    placeholder="Hobby Name"
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                />
                              </div>
                            </div>
                            <div className="relative w-full flex items-center space-x-4">
                              <div className="flex-1 mb-0">
                                <input
                                    type="text"
                                    value={hobbies.description}
                                    onChange={(e) => handleProfileFieldChange(['hobbies', index, 'description'], e.target.value)}
                                    placeholder="Description"
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none mb-3"
                                />
                              </div>
                            </div>
                            <div className="text-right mb-3">
                              <button
                                  onClick={() => removeHobby(index)}
                                  className="text-red-600 text-sm "
                              >
                                Remove
                              </button>
                            </div>

                          </div>
                      ))}
                      <br/>
                      <div className="flex justify-between mt-6">
                        {/* Add Language Skill Button */}
                        <button
                            onClick={addHobby}
                            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                          Add Hobby
                        </button>

                        {/* Next Step Button */}
                        <div className="flex justify-between">
                          <button onClick={handleBackStep} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Back</button>
                          <div className="flex justify-end">
                            <button onClick={handleNextStep} className="bg-blue-600 text-grey px-4 py-2 rounded-md hover:bg-blue-700">Next</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
              )}
              {/* Step 8: Education Section */}

              {currentStep === 8 && (
                  <motion.div
                      key={currentStep}
                      custom={direction} // ileri veya geri
                      initial={{ x: direction === 1 ? '100%' : '-100%', opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: direction === 1 ? '-100%' : '100%', opacity: 0 }}
                      transition={{ type: 'tween', ease: 'easeInOut', duration: 0.4 }}
                  >
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold">Education</h3>

                      {/* Degree Type */}
                      <select

                          value={profileData.education.degreeType}
                          onChange={(e) => handleProfileFieldChange(['education', 'degreeType'], e.target.value)}
                          className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                      >
                        <option value="" disabled>Degree Type</option>
                        <option value="ASSOCIATE">Associate Degree</option>
                        <option value="BACHELOR">Bachelor Degree</option>
                        <option value="MASTER">Master Degree</option>
                        <option value="DOCTORATE">Doctorate Degree</option>
                        <option value="DOUBLE_MAJOR">Double Major</option>
                        <option value="MINOR">Minor</option>
                      </select>

                      {/* Associate Degree Section */}
                      {profileData.education.degreeType === 'ASSOCIATE' && (
                          <div className="space-y-4">
                            <input
                                type="text"
                                value={profileData.education.associateDepartment}
                                onChange={(e) => handleProfileFieldChange(['education', 'associateDepartment'], e.target.value)}
                                placeholder="Associate Department"
                                className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                            />
                            <div className="relative w-full flex items-center space-x-4 mb-0">
                              <div className="flex-1 mb-0">
                                <div className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                                  <label htmlFor="associateStartDate" className="text-sm font-semibold text-gray-500">
                                    Start Date
                                  </label>
                                </div>
                              </div>
                              <div className="flex-1 mb-0">
                                <input
                                    type="date"
                                    value={profileData.education.associateStartDate}
                                    onChange={(e) => handleProfileFieldChange(['education', 'associateStartDate'], e.target.value)}
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="relative w-full flex items-center space-x-4 mb-0">
                              <div className="flex-1 mb-0">
                                <div className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                                  <label htmlFor="associateEndDate" className="text-sm font-semibold text-gray-500">
                                    End Date
                                  </label>
                                </div>
                              </div>
                              <div className="flex-1 mb-0">
                                <input
                                    type="date"
                                    value={profileData.education.associateEndDate}
                                    onChange={(e) => handleProfileFieldChange(['education', 'associateEndDate'], e.target.value)}
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                />
                              </div>
                            </div>


                            <div className="w-full border border-gray-300 p-3 rounded-md bg-white text-black mb-3">

                              <div className="flex-1 mb-0">
                                <input
                                    type="checkbox"
                                    checked={profileData.education.associateIsOngoing}
                                    onChange={(e) => handleProfileFieldChange(['education', 'associateIsOngoing'], e.target.checked)}
                                    className="p-3"
                                />
                                <span className="text-sm ml-2">  Is Ongoing?</span>

                              </div>
                            </div>
                          </div>
                      )}

                      {/* Bachelor Degree Section */}
                      {profileData.education.degreeType === 'BACHELOR' && (
                          <div className="space-y-4">
                            <input
                                type="text"
                                value={profileData.education.bachelorDepartment}
                                onChange={(e) => handleProfileFieldChange(['education', 'bachelorDepartment'], e.target.value)}
                                placeholder="Bachelor Department"
                                className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                            />
                            <div className="relative w-full flex items-center space-x-4 mb-0">
                              <div className="flex-1 mb-0">
                                <div className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                                  <label htmlFor="bachelorStartDate"
                                         className="text-sm font-semibold text-gray-500">
                                    Start Date
                                  </label>
                                </div>
                              </div>
                              <div className="flex-1 mb-0">
                                <input
                                    type="date"
                                    value={profileData.education.bachelorStartDate}
                                    onChange={(e) => handleProfileFieldChange(['education', 'bachelorStartDate'], e.target.value)}
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="relative w-full flex items-center space-x-4 mb-0">
                              <div className="flex-1 mb-0">
                                <div className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                                  <label htmlFor="bachelorEndDate" className="text-sm font-semibold text-gray-500">
                                    End Date
                                  </label>
                                </div>
                              </div>
                              <div className="flex-1 mb-0">
                                <input
                                    type="date"
                                    value={profileData.education.bachelorEndDate}
                                    onChange={(e) => handleProfileFieldChange(['education', 'bachelorEndDate'], e.target.value)}
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="w-full border border-gray-300 p-3 rounded-md bg-white text-black mb-3">

                              <div className="flex-1 mb-0">
                                <input
                                    type="checkbox"
                                    checked={profileData.education.bachelorIsOngoing}
                                    onChange={(e) => handleProfileFieldChange(['education', 'bachelorIsOngoing'], e.target.checked)}
                                    className="p-3"
                                />
                                <span className="text-sm ml-2">  Is Ongoing?</span>

                              </div>
                            </div>
                          </div>
                      )}

                      {/* Master Degree Section */}
                      {profileData.education.degreeType === 'MASTER' && (
                          <div className="space-y-4">
                            <input
                                type="text"
                                value={profileData.education.masterDepartment}
                                onChange={(e) => handleProfileFieldChange(['education', 'masterDepartment'], e.target.value)}
                                placeholder="Master Department"
                                className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                            />
                            <div className="relative w-full flex items-center space-x-4 mb-0">
                              <div className="flex-1 mb-0">
                                <div className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                                  <label htmlFor="masterStartDate" className="text-sm font-semibold text-gray-500">
                                    Start Date
                                  </label>
                                </div>
                              </div>
                              <div className="flex-1 mb-0">
                                <input
                                    type="date"
                                    value={profileData.education.masterStartDate}
                                    onChange={(e) => handleProfileFieldChange(['education', 'masterStartDate'], e.target.value)}
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="relative w-full flex items-center space-x-4 mb-0">
                              <div className="flex-1 mb-0">
                                <div className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                                  <label htmlFor="masterEndDate" className="text-sm font-semibold text-gray-500">
                                    End Date
                                  </label>
                                </div>
                              </div>
                              <div className="flex-1 mb-0">
                                <input
                                    type="date"
                                    value={profileData.education.masterEndDate}
                                    onChange={(e) => handleProfileFieldChange(['education', 'masterEndDate'], e.target.value)}
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="w-full border border-gray-300 p-3 rounded-md bg-white text-black mb-0">

                              <div className="flex-1 mb-0">
                                <input
                                    type="checkbox"
                                    checked={profileData.education.masterIsOngoing}
                                    onChange={(e) => handleProfileFieldChange(['education', 'masterIsOngoing'], e.target.checked)}
                                    className="p-3"
                                />
                                <span className="text-sm ml-2">  Is Ongoing?</span>

                              </div>
                            </div>


                            <div className="relative w-full flex items-center space-x-4 mb-0">
                              <div className="flex-1 mb-0">
                                <input
                                    type="text"
                                    value={profileData.education.masterThesisTitle}
                                    onChange={(e) => handleProfileFieldChange(['education', 'masterThesisTitle'], e.target.value)}
                                    placeholder="Thesis Title"
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="relative w-full flex items-center space-x-4 mb-0">
                              <div className="flex-1 mb-0">
                                <input
                                    type="text"
                                    value={profileData.education.masterThesisDescription}
                                    onChange={(e) => handleProfileFieldChange(['education', 'masterThesisDescription'], e.target.value)}
                                    placeholder="Thesis Description"
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="relative w-full flex items-center space-x-4 mb-3">
                              <div className="flex-1 mb-0">
                                <input
                                    type="text"
                                    value={profileData.education.masterThesisUrl}
                                    onChange={(e) => handleProfileFieldChange(['education', 'masterThesisUrl'], e.target.value)}
                                    placeholder="Thesis URL"
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>
                      )}

                      {/* Doctorate Degree Section */}
                      {profileData.education.degreeType === 'DOCTORATE' && (
                          <div className="space-y-4">
                            <input
                                type="text"
                                value={profileData.education.doctorateDepartment}
                                onChange={(e) => handleProfileFieldChange(['education', 'doctorateDepartment'], e.target.value)}
                                placeholder="Doctorate Department"
                                className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                            />
                            <div className="relative w-full flex items-center space-x-4 mb-0">
                              <div className="flex-1 mb-0">
                                <div className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                                  <label htmlFor="doctorateStartDate"
                                         className="text-sm font-semibold text-gray-500">
                                    Start Date
                                  </label>
                                </div>
                              </div>
                              <div className="flex-1 mb-0">
                                <input
                                    type="date"
                                    value={profileData.education.doctorateStartDate}
                                    onChange={(e) => handleProfileFieldChange(['education', 'doctorateStartDate'], e.target.value)}
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="relative w-full flex items-center space-x-4 mb-0">
                              <div className="flex-1 mb-0">
                                <div className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                                  <label htmlFor="doctorateEndDate" className="text-sm font-semibold text-gray-500">
                                    End Date
                                  </label>
                                </div>
                              </div>
                              <div className="flex-1 mb-0">
                                <input
                                    type="date"
                                    value={profileData.education.doctorateEndDate}
                                    onChange={(e) => handleProfileFieldChange(['education', 'doctorateEndDate'], e.target.value)}
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                />
                              </div>
                            </div>
                            <div className="w-full border border-gray-300 p-3 rounded-md bg-white text-black mb-0">

                              <div className="flex-1 mb-0">
                                <input
                                    type="checkbox"
                                    checked={profileData.education.doctorateIsOngoing}
                                    onChange={(e) => handleProfileFieldChange(['education', 'doctorateIsOngoing'], e.target.checked)}
                                    className="p-3"
                                />
                                <span className="text-sm ml-2">  Is Ongoing?</span>

                              </div>
                            </div>


                            <div className="relative w-full flex items-center space-x-4 mb-0">
                              <div className="flex-1 mb-0">
                                <input
                                    type="text"
                                    value={profileData.education.doctorateThesisTitle}
                                    onChange={(e) => handleProfileFieldChange(['education', 'doctorateThesisTitle'], e.target.value)}
                                    placeholder="Thesis Title"
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="relative w-full flex items-center space-x-4 mb-0">
                              <div className="flex-1 mb-0">
                                <input
                                    type="text"
                                    value={profileData.education.doctorateThesisDescription}
                                    onChange={(e) => handleProfileFieldChange(['education', 'doctorateThesisDescription'], e.target.value)}
                                    placeholder="Thesis Description"
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="relative w-full flex items-center space-x-4 mb-3">
                              <div className="flex-1 mb-0">
                                <input
                                    type="text"
                                    value={profileData.education.doctorateThesisUrl}
                                    onChange={(e) => handleProfileFieldChange(['education', 'doctorateThesisUrl'], e.target.value)}
                                    placeholder="Thesis URL"
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>
                      )}

                      {/* Double Major Section */}
                      {profileData.education.degreeType === 'DOUBLE_MAJOR' && (
                          <div className="space-y-4">
                            <input
                                type="text"
                                value={profileData.education.doubleMajorDepartment}
                                onChange={(e) => handleProfileFieldChange(['education', 'doubleMajorDepartment'], e.target.value)}
                                placeholder="Double Major Department"
                                className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                            />
                            <div className="relative w-full flex items-center space-x-4 mb-0">
                              <div className="flex-1 mb-0">
                                <div className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                                  <label htmlFor="doubleMajorStartDate"
                                         className="text-sm font-semibold text-gray-500">
                                    Start Date
                                  </label>
                                </div>
                              </div>
                              <div className="flex-1 mb-0">
                                <input
                                    type="date"
                                    value={profileData.education.doubleMajorStartDate}
                                    onChange={(e) => handleProfileFieldChange(['education', 'doubleMajorStartDate'], e.target.value)}
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="relative w-full flex items-center space-x-4 mb-0">
                              <div className="flex-1 mb-0">
                                <div className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                                  <label htmlFor="doubleMajorEndDate"
                                         className="text-sm font-semibold text-gray-500">
                                    End Date
                                  </label>
                                </div>
                              </div>
                              <div className="flex-1 mb-0">
                                <input
                                    type="date"
                                    value={profileData.education.doubleMajorEndDate}
                                    onChange={(e) => handleProfileFieldChange(['education', 'doubleMajorEndDate'], e.target.value)}
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                />
                              </div>
                            </div>


                            <div className="w-full border border-gray-300 p-3 rounded-md bg-white text-black mb-3">

                              <div className="flex-1 mb-0">
                                <input
                                    type="checkbox"
                                    checked={profileData.education.doubleMajorIsOngoing}
                                    onChange={(e) => handleProfileFieldChange(['education', 'doubleMajorIsOngoing'], e.target.checked)}
                                    className="p-3"
                                />
                                <span className="text-sm ml-2">  Is Ongoing?</span>
                              </div>

                            </div>


                          </div>
                      )}
                      {profileData.education.degreeType === 'MINOR' && (
                          <div className="space-y-4">
                            {/* Minor Department */}
                            <input
                                type="text"
                                value={profileData.education.minorDepartment}
                                onChange={(e) => handleProfileFieldChange(['education', 'minorDepartment'], e.target.value)}
                                placeholder="Minor Department"
                                className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                            />

                            {/* Start Date */}
                            <div className="relative w-full flex items-center space-x-4 mb-0">
                              <div className="flex-1 mb-0">
                                <div className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                                  <label htmlFor="minorStartDate" className="text-sm font-semibold text-gray-500">
                                    Start Date
                                  </label>
                                </div>
                              </div>
                              <div className="flex-1 mb-0">
                                <input
                                    type="date"
                                    value={profileData.education.minorStartDate}
                                    onChange={(e) => handleProfileFieldChange(['education', 'minorStartDate'], e.target.value)}
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                />
                              </div>
                            </div>

                            {/* End Date */}
                            <div className="relative w-full flex items-center space-x-4 mb-0">
                              <div className="flex-1 mb-0">
                                <div className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                                  <label htmlFor="minorEndDate" className="text-sm font-semibold text-gray-500">
                                    End Date
                                  </label>
                                </div>
                              </div>
                              <div className="flex-1 mb-0">
                                <input
                                    type="date"
                                    value={profileData.education.minorEndDate}
                                    onChange={(e) => handleProfileFieldChange(['education', 'minorEndDate'], e.target.value)}
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                    disabled={profileData.education.minorIsOngoing}
                                />
                              </div>
                            </div>

                            {/* Is Ongoing */}
                            <div className="w-full border border-gray-300 p-3 rounded-md bg-white text-black mb-3">
                              <div className="flex-1 mb-0">
                                <input
                                    type="checkbox"
                                    checked={profileData.education.minorIsOngoing}
                                    onChange={(e) => handleProfileFieldChange(['education', 'minorIsOngoing'], e.target.checked)}
                                    className="p-3"
                                />
                                <span className="text-sm ml-2">Is Ongoing?</span>
                              </div>
                            </div>

                          </div>

                      )}

                      <div>
                        <div className="text-right mb-3">
                          <button
                              onClick={() => removeEducation()}
                              className="text-red-600 text-sm "
                          >
                            Remove
                          </button>
                        </div>
                        <br/>
                        <button
                            type="button"
                            onClick={addEducation}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                        >
                          + Add Education
                        </button>

                        <div style={{textAlign: 'right'}}>
                          <div className="flex justify-between">
                            <button onClick={handleBackStep}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Back
                            </button>
                            <div className="flex justify-end">
                              <button onClick={handleNextStep}
                                      className="bg-blue-600 text-grey px-4 py-2 rounded-md hover:bg-blue-700">Next
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>

                  </motion.div>
              )}
              {currentStep === 9 && (
                  <motion.div
                      key={currentStep}
                      custom={direction} // ileri veya geri
                      initial={{x: direction === 1 ? '100%' : '-100%', opacity: 0}}
                      animate={{x: 0, opacity: 1 }}
                      exit={{ x: direction === 1 ? '-100%' : '100%', opacity: 0 }}
                      transition={{ type: 'tween', ease: 'easeInOut', duration: 0.4 }}
                  >
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold">Certifications</h3>

                      {/* Sertifikalar Listesi */}
                      {profileData.certifications.map((certification, index) => (
                          <div key={index} className="space-y-4 mt-6">
                            {/* Sertifika Adı */}
                            <div className="relative w-full flex items-center space-x-4">
                              <div className="flex-1 mb-0">
                                <input
                                    type="text"
                                    value={certification.certificationName}
                                    onChange={(e) => handleProfileFieldChange(['certifications', index, 'certificationName'], e.target.value)}

                                    placeholder="Certification Name"
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                />
                              </div>
                            </div>

                            {/* Sertifika URL */}
                            <div className="relative w-full flex items-center space-x-4">
                              <div className="flex-1 mb-0">
                                <input
                                    type="text"
                                    value={certification.certificationUrl}
                                    onChange={(e) => handleProfileFieldChange(['certifications', index, 'certificationUrl'], e.target.value)}
                                    placeholder="Certification URL"
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                />
                              </div>
                            </div>

                            {/* Sertifika Geçerlilik Tarihi */}
                            <div className="relative w-full flex items-center space-x-4 mb-0">
                              <div className="flex-1 mb-0">
                                <div className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                                  <label htmlFor="certificateValidityDate" className="text-sm font-semibold text-gray-500">
                                    Certificate Validity Date
                                  </label>
                                </div>
                              </div>
                              <div className="flex-1 mb-0">
                                <input
                                    type="date"
                                    value={certification.certificateValidityDate}
                                    onChange={(e) => handleProfileFieldChange(['certifications', index, 'certificateValidityDate'], e.target.value)}

                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                    disabled={certification.isOngoing} // Eğer ongoing ise tarih girişi devre dışı
                                />
                              </div>
                            </div>


                            {/* Sertifikayı Veren Kurum */}
                            <div className="relative w-full flex items-center space-x-4 mb-3">
                              <div className="flex-1 mb-0">
                                <input
                                    type="text"
                                    value={certification.issuedBy}

                                    onChange={(e) => handleProfileFieldChange(['certifications', index, 'issuedBy'], e.target.value)}

                                    placeholder="Issued By"
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                />
                              </div>
                            </div>
                            <div className="text-right mb-3">
                              <button
                                  onClick={() => removeCertification(index)}
                                  className="text-red-600 text-sm "
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                      ))}
                      <br/>
                      <div className="flex justify-between mt-6">
                        {/* Yeni Sertifika Ekleme Butonu */}
                        <button
                            onClick={addCertification}
                            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                          Add Certification
                        </button>

                        {/* Sonraki Adım Butonu */}
                        <div className="flex justify-between">
                          <button onClick={handleBackStep} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Back</button>
                          <div className="flex justify-end">
                            <button onClick={handleNextStep} className="bg-blue-600 text-grey px-4 py-2 rounded-md hover:bg-blue-700">Next</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
              )}

              {currentStep === 10 && (
                  <motion.div
                      key={currentStep}
                      custom={direction} // ileri veya geri
                      initial={{ x: direction === 1 ? '100%' : '-100%', opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: direction === 1 ? '-100%' : '100%', opacity: 0 }}
                      transition={{ type: 'tween', ease: 'easeInOut', duration: 0.4 }}
                  >
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold">Work Experience</h3>

                      {/* Work Experience List */}
                      {profileData.workExperiences.map((work, index) => (
                          <div key={index} className="space-y-4 mt-6">

                            {/* Company Name */}
                            <div className="relative w-full flex items-center space-x-4">
                              <div className="flex-1 mb-0">
                                <input
                                    type="text"
                                    value={work.companyName}
                                    onChange={(e) => handleProfileFieldChange(['workExperiences', index, 'companyName'], e.target.value)}
                                    placeholder="Company Name"
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                />
                              </div>
                            </div>

                            {/* Job Title */}
                            <div className="relative w-full flex items-center space-x-4">
                              <div className="flex-1 mb-0">
                                <input
                                    type="text"
                                    value={work.jobTitle}
                                    onChange={(e) => handleProfileFieldChange(['workExperiences', index, 'jobTitle'], e.target.value)}

                                    placeholder="Job Title"
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                />
                              </div>
                            </div>

                            {/* Employment Type (Dropdown) */}
                            <div className="relative w-full flex items-center space-x-4">
                              <div className="flex-1 mb-0">
                                <select
                                    value={work.employmentType}
                                    onChange={(e) => handleProfileFieldChange(['workExperiences', index, 'employmentType'], e.target.value)}
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                >
                                  <option value="">Select Employment Type</option>
                                  <option value="FULL_TIME">Full Time</option>
                                  <option value="PART_TIME">Part Time</option>
                                  <option value="CONTRACT">Contract</option>
                                  <option value="FREELANCE">Freelance</option>
                                </select>
                              </div>
                            </div>

                            {/* Job Description */}
                            <div className="relative w-full flex items-center space-x-4">
                              <div className="flex-1 mb-0">
            <textarea
                value={work.jobDescription}
                onChange={(e) => handleProfileFieldChange(['workExperiences', index, 'jobDescription'], e.target.value)}
                placeholder="Job Description"
                className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
            />
                              </div>
                            </div>

                            {/* Start Date */}
                            <div className="relative w-full flex items-center space-x-4 mb-0">
                              <div className="flex-1 mb-0">
                                <div className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                                  <label htmlFor="startDate" className="text-sm font-semibold text-gray-500">
                                    Start Date
                                  </label>
                                </div>
                              </div>
                              <div className="flex-1 mb-0">
                                <input
                                    type="date"
                                    value={work.startDate}
                                    onChange={(e) => handleProfileFieldChange(['workExperiences', index, 'startDate'], e.target.value)}
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                />
                              </div>
                            </div>

                            {/* End Date or Ongoing */}
                            <div className="relative w-full flex items-center space-x-4 mb-0">
                              <div className="flex-1 mb-0">
                                <div className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                                  <label htmlFor="endDate" className="text-sm font-semibold text-gray-500">
                                    End Date
                                  </label>
                                </div>
                              </div>
                              <div className="flex-1 mb-0">
                                <input
                                    type="date"
                                    value={work.endDate}
                                    onChange={(e) => handleProfileFieldChange(['workExperiences', index, 'endDate'], e.target.value)}
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                    disabled={work.isGoing}
                                />
                              </div>
                            </div>

                            {/* Ongoing Checkbox */}
                            <div className="w-full border border-gray-300 p-3 rounded-md bg-white text-black mb-3">
                              <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={work.isGoing}
                                    onChange={(e) =>
                                        handleProfileFieldChange(['workExperiences', index, 'isGoing'], e.target.value)
                                    }

                                    className="p-3"
                                />
                                <span className="text-sm ml-4">Is Going?</span>
                              </div>
                            </div>

                            {/* Remove Button */}
                            <div className="flex justify-end mb-3">
                              <button
                                  onClick={() => removeJobExperience(index)}
                                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                              >
                                Remove
                              </button>
                            </div>

                          </div>
                      ))}

                      <br/>
                      <div className="flex justify-between mt-6">
                        {/* Add Work Experience Button */}
                        <button
                            onClick={addJobExperience}
                            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                          Add Work Experience
                        </button>

                        {/* Next Step Button */}
                        <div className="flex justify-between">
                          <button onClick={handleBackStep} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Back</button>
                          <div className="flex justify-end">
                            <button onClick={handleNextStep} className="bg-blue-600 text-grey px-4 py-2 rounded-md hover:bg-blue-700">Next</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
              )}

              {currentStep === 11 && (
                  <motion.div
                      key={currentStep}
                      custom={direction} // ileri veya geri
                      initial={{ x: direction === 1 ? '100%' : '-100%', opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: direction === 1 ? '-100%' : '100%', opacity: 0 }}
                      transition={{ type: 'tween', ease: 'easeInOut', duration: 0.4 }}
                  >
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold">Exams and Achievements</h3>

                      {profileData.examsAndAchievements.map((exam, index) => (
                          <div key={index} className="space-y-4 mt-6">
                            {/* Exam Name */}
                            <div className="relative w-full flex items-center space-x-4">
                              <div className="flex-1 mb-0">
                                <input
                                    type="text"
                                    value={exam.examName}
                                    onChange={(e) =>
                                        handleProfileFieldChange(['examsAndAchievements', index, 'examName'], e.target.value)
                                    }
                                    placeholder="Exam Name"
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                />
                              </div>
                            </div>

                            {/* Exam Year */}
                            <div className="relative w-full flex items-center space-x-4">
                              <div className="flex-1 mb-0">
                                <input
                                    type="number"
                                    value={exam.examYear}
                                    onChange={(e) =>
                                        handleProfileFieldChange(['examsAndAchievements', index, 'examYear'], e.target.value)
                                    }
                                    placeholder="Exam Year"
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                />
                              </div>
                            </div>

                            {/* Exam Score */}
                            <div className="relative w-full flex items-center space-x-4">
                              <div className="flex-1 mb-0">
                                <input
                                    type="number"
                                    step="0.01"
                                    value={exam.examScore}
                                    onChange={(e) =>
                                        handleProfileFieldChange(['examsAndAchievements', index, 'examScore'], e.target.value)
                                    }
                                    placeholder="Exam Score"
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                />
                              </div>
                            </div>

                            {/* Exam Rank */}
                            <div className="relative w-full flex items-center space-x-4 mb-3">
                              <div className="flex-1 mb-0">
                                <input
                                    type="text"
                                    value={exam.examRank}
                                    onChange={(e) =>
                                        handleProfileFieldChange(['examsAndAchievements', index, 'examRank'], e.target.value)
                                    }
                                    placeholder="Exam Rank"
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                />
                              </div>
                            </div>

                            {/* Remove Button */}
                            <div className="text-right mb-3">
                              <button
                                  onClick={() => removeExam(index)}
                                  className="text-red-600 text-sm "
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                      ))}

                      <br />

                      <div className="flex justify-between mt-6">
                        {/* Add Exam Button */}
                        <button
                            onClick={addExam}
                            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                          Add Exam
                        </button>

                        {/* Next Step Button */}
                        <div className="flex justify-between">
                          <button onClick={handleBackStep} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Back</button>
                          <div className="flex justify-end">
                            <button onClick={handleNextStep} className="bg-blue-600 text-grey px-4 py-2 rounded-md hover:bg-blue-700">Next</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
              )}
              {currentStep === 12 && (
                  <motion.div
                      key={currentStep}
                      custom={direction} // ileri veya geri
                      initial={{ x: direction === 1 ? '100%' : '-100%', opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: direction === 1 ? '-100%' : '100%', opacity: 0 }}
                      transition={{ type: 'tween', ease: 'easeInOut', duration: 0.4 }}
                  >
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold">Uploaded Documents</h3>

                      {profileData.uploadedDocuments.map((document, index) => (
                          <div key={index} className="space-y-4 mt-6">

                            {/* Document Name */}
                            <input
                                type="text"
                                value={document.documentName}
                                onChange={(e) =>
                                    handleProfileFieldChange(['uploadedDocuments', index, 'documentName'], e.target.value)
                                }
                                placeholder="Document Name"
                                className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                            />

                            {/* Document Type */}
                            <input
                                type="text"
                                value={document.documentType}
                                onChange={(e) =>
                                    handleProfileFieldChange(['uploadedDocuments', index, 'documentType'], e.target.value)
                                }
                                placeholder="Document Type"
                                className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                            />

                            {/* Document Category (Enum Options) */}
                            <select
                                value={document.documentCategory}
                                onChange={(e) =>
                                    handleProfileFieldChange(['uploadedDocuments', index, 'documentCategory'], e.target.value)
                                }
                                className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                            >
                              <option value="" disabled>Document Category</option>
                              <option value="CV">CV</option>
                              <option value="COVER_LETTER">Cover Letter</option>
                              <option value="TRANSCRIPT">Transcript</option>
                              <option value="CERTIFICATE">Certificate</option>
                              <option value="OTHER">Other</option>
                            </select>

                            {/* Document URL */}
                            <input
                                type="text"
                                value={document.documentUrl}
                                onChange={(e) =>
                                    handleProfileFieldChange(['uploadedDocuments', index, 'documentUrl'], e.target.value)
                                }
                                placeholder="Document URL"
                                className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                            />

                            {/* Is Private Checkbox */}

                            <div className="w-full border border-gray-300 p-3 rounded-md bg-white text-black mb-3">
                              <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={document.isPrivate}
                                    onChange={(e) =>
                                        handleProfileFieldChange(['uploadedDocuments', index, 'isPrivate'], e.target.checked)
                                    }
                                />
                                <span className="text-sm "> Is private?</span> {/* ml-2 yerine ml-4 */}
                              </div>
                            </div>

                            {/* Remove Button */}
                            <div className="text-right mb-3">
                              <button
                                  onClick={() => removeDocument(index)}
                                  className="text-red-600 text-sm"
                              >
                                Remove
                              </button>
                            </div>

                          </div>
                      ))}

                      {/* Add + Next Step */}
                      <div className="flex justify-between mt-6">
                        <button
                            onClick={addDocument}
                            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                          Add Document
                        </button>
                        <div className="flex justify-between">
                          <button onClick={handleBackStep} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Back</button>
                          <div className="flex justify-end">
                            <button onClick={handleNextStep} className="bg-blue-600 text-grey px-4 py-2 rounded-md hover:bg-blue-700">Next</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
              )}
              {currentStep === 13 && (
                  <motion.div
                      key={currentStep}
                      custom={direction} // ileri veya geri
                      initial={{ x: direction === 1 ? '100%' : '-100%', opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: direction === 1 ? '-100%' : '100%', opacity: 0 }}
                      transition={{ type: 'tween', ease: 'easeInOut', duration: 0.4 }}
                  >
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold">Skills</h3>

                      {profileData.skills.map((skill, index) => (
                          <div key={index} className="space-y-4 mt-6">

                            {/* Skill Name */}
                            <input
                                type="text"
                                value={skill.skillName}
                                onChange={(e) =>
                                    handleProfileFieldChange(['skills', index, 'skillName'], e.target.value)
                                }
                                placeholder="Skill Name"
                                className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                            />

                            {/* Skill Level (Enum Select) */}
                            <select
                                value={skill.skillLevel}
                                onChange={(e) =>
                                    handleProfileFieldChange(['skills', index, 'skillLevel'], e.target.value)
                                }
                                className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none mb-3"
                            >
                              <option value="" disabled>Skill Level</option>
                              <option value="BEGINNER">Beginner</option>
                              <option value="INTERMEDIATE">Intermediate</option>
                              <option value="ADVANCED">Advanced</option>
                              <option value="EXPERT">Expert</option>
                            </select>

                            {/* Remove Skill Button */}
                            <div className="text-right mb-3">
                              <button
                                  onClick={() => removeSkill(index)}
                                  className="text-red-600 text-sm"
                              >
                                Remove
                              </button>
                            </div>

                          </div>
                      ))}

                      {/* Add Skill + Next */}
                      <div className="flex justify-between mt-6">
                        <button
                            onClick={addSkill}
                            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                          Add Skill
                        </button>
                        <div className="flex justify-between">
                          <button onClick={handleBackStep} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Back</button>
                          <div className="flex justify-end">
                            <button onClick={handleNextStep} className="bg-blue-600 text-grey px-4 py-2 rounded-md hover:bg-blue-700">Next</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
              )}
              {currentStep === 14 && (
                  <motion.div
                      key={currentStep}
                      custom={direction} // ileri veya geri
                      initial={{ x: direction === 1 ? '100%' : '-100%', opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: direction === 1 ? '-100%' : '100%', opacity: 0 }}
                      transition={{ type: 'tween', ease: 'easeInOut', duration: 0.4 }}
                  >
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold">Projects</h3>

                      {profileData.projects.map((project, index) => (
                          <div key={index} className="space-y-4 mt-6">

                            {/* Project Name */}
                            <input
                                type="text"
                                value={project.projectName}
                                onChange={(e) =>
                                    handleProfileFieldChange(['projects', index, 'projectName'], e.target.value)
                                }
                                placeholder="Project Name"
                                className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                            />

                            {/* Project Description */}
                            <textarea
                                value={project.projectDescription}
                                onChange={(e) =>
                                    handleProfileFieldChange(['projects', index, 'projectDescription'], e.target.value)
                                }
                                placeholder="Project Description"
                                rows={4}
                                className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                            />

                            {/* Project Start Date */}
                            <div className="relative w-full flex items-center space-x-4 mb-0">
                              <div className="flex-1 mb-0">
                                <div className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                                  <label className="text-sm font-semibold text-gray-500">
                                    Project Start Date
                                  </label>
                                </div>
                              </div>
                              <div className="flex-1 mb-0">
                                <input
                                    type="date"
                                    value={project.projectStartDate}
                                    onChange={(e) =>
                                        handleProfileFieldChange(['projects', index, 'projectStartDate'], e.target.value)
                                    }
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 mb-0"
                                />
                              </div>
                            </div>


                            {/* Project End Date */}
                            <div className="relative w-full flex items-center space-x-4 mb-0 mt-4">
                              <div className="flex-1 mb-0">
                                <div className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                                  <label className="text-sm font-semibold text-gray-500">
                                    Project End Date
                                  </label>
                                </div>
                              </div>
                              <div className="flex-1 mb-0">
                                <input
                                    type="date"
                                    value={project.projectEndDate}
                                    onChange={(e) =>
                                        handleProfileFieldChange(['projects', index, 'projectEndDate'], e.target.value)
                                    }
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 mb-0"
                                />
                              </div>
                            </div>


                            {/* Project Status (Enum Select) */}
                            <select
                                value={project.projectStatus}
                                onChange={(e) =>
                                    handleProfileFieldChange(['projects', index, 'projectStatus'], e.target.value)
                                }
                                className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                            >
                              <option value="">Select Project Status</option>
                              <option value="PLANNED">Planned</option>
                              <option value="IN_PROGRESS">In Progress</option>
                              <option value="COMPLETED">Completed</option>
                              <option value="ON_HOLD">On Hold</option>
                              <option value="CANCELLED">Cancelled</option>
                            </select>

                            {/* Is Private (Checkbox) */}
                            <div className="w-full border border-gray-300 p-3 rounded-md bg-white text-black mb-3">

                              <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={project.isPrivate}
                                    onChange={(e) =>
                                        handleProfileFieldChange(['projects', index, 'isPrivate'], e.target.checked)
                                    }
                                />
                                <span className="text-sm "> Is private?</span> {/* ml-2 yerine ml-4 */}
                              </div>
                            </div>
                            {/* Remove Project Button */}
                            <div className="text-right mb-3">
                              <button
                                  onClick={() => removeProject(index)}
                                  className="text-red-600 text-sm"
                              >
                                Remove
                              </button>
                            </div>

                          </div>

                      ))}

                      {/* Add Project + Next */}
                      <div className="flex justify-between mt-6">
                        <button
                            onClick={addProject}
                            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                          Add Project
                        </button>
                        <div className="flex justify-between">
                          <button onClick={handleBackStep} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Back</button>
                          <div className="flex justify-end">
                            <button
                                onClick={handleCloseForm}
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                              Done
                            </button>
                            {/* <button onClick={() => setShowForm(false)} className="bg-blue-600 text-grey px-4 py-2 rounded-md hover:bg-blue-700">Done</button> */}
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
  );

}






















// // GÜNCELLENMİŞ: Sağ panelin inputları profileData yapısına bağlandı
// import { FaBell, FaSearch } from 'react-icons/fa';
// import { Link } from 'react-router-dom';
// import { useState } from 'react';
// import { useEffect } from 'react';
// import axios from "axios";

// export default function JobSeekerDashboard() {
//   const [profileData, setProfileData] = useState({
//     profileDetails: {
//       aboutMe: '',
//       nationality: '',
//       gender: '',
//       militaryStatus: '',
//       militaryDefermentDate: '',
//       disabilityStatus: '',
//       maritalStatus: '',
//       currentEmploymentStatus: false,
//       drivingLicense: false,
//       isPrivateProfile: false,
//       profilePicture: '',
//       birthDate: '',
//       firstName: '',
//       jobTitle: ''
//     },
//     socialLinks: {
//       githubUrl: '',
//       linkedinUrl: '',
//       websiteUrl: '',
//       blogUrl: '',
//       otherLinksUrl: '',
//       otherLinksDescription: ''
//     },
//     contactInformation: {
//       phoneNumber: '',
//       country: '',
//       city: ''
//     },
//     jobPreferences: {
//       preferredPositions: [{ positionType: '' }],
//       preferredWorkType: '',
//       minWorkHour: 0,
//       maxWorkHour: 0,
//       canTravel: false,
//       expectedSalary: ''
//     },
//     references: [
//       {
//         referenceName: '',
//         referenceCompany: '',
//         referenceJobTitle: '',
//         referenceContactInfo: '',
//         referenceYearsWorked: ''
//       }
//     ],
//     languageProficiency: [
//       {
//         language: '',
//         readingLevel: '',
//         writingLevel: '',
//         speakingLevel: '',
//         listeningLevel: ''
//       }
//     ],
//     hobbies: [
//       {
//         hobbyName: '',
//         description: ''
//       }
//     ],
//     education: {
//       degreeType: '',
//       associateDepartment: '',
//       associateStartDate: '',
//       associateEndDate: '',
//       associateIsOngoing: false,
//       bachelorDepartment: '',
//       bachelorStartDate: '',
//       bachelorEndDate: '',
//       bachelorIsOngoing: false,
//       masterDepartment: '',
//       masterStartDate: '',
//       masterEndDate: '',
//       masterIsOngoing: false,
//       masterThesisTitle: '',
//       masterThesisDescription: '',
//       masterThesisUrl: '',
//       doctorateDepartment: '',
//       doctorateStartDate: '',
//       doctorateEndDate: '',
//       doctorateIsOngoing: false,
//       doctorateThesisTitle: '',
//       doctorateThesisDescription: '',
//       doctorateThesisUrl: '',
//       isDoubleMajor: false,
//       doubleMajorDepartment: '',
//       doubleMajorStartDate: '',
//       doubleMajorEndDate: '',
//       doubleMajorIsOngoing: false,
//       isMinor: false,
//       minorDepartment: '',
//       minorStartDate: '',
//       minorEndDate: '',
//       minorIsOngoing: false
//     },
//     certifications: [
//       {
//         certificationName: '',
//         certificationUrl: '',
//         certificateValidityDate: '',
//         issuedBy: ''
//       }
//     ],
//     workExperiences: [
//       {
//         companyName: '',
//         industry: '',
//         jobTitle: '',
//         jobDescription: '',
//         employmentType: '',
//         startDate: '',
//         endDate: '',
//         isGoing: false
//       }
//     ],
//     examsAndAchievements: [
//       {
//         examName: '',
//         examYear: '',
//         examScore: '',
//         examRank: ''
//       }
//     ],
//     uploadedDocuments: [
//       {
//         documentName: '',
//         documentType: '',
//         documentCategory: '',
//         documentUrl: '',
//         isPrivate: false
//       }
//     ],
//     skills: [
//       {
//         skillName: '',
//         skillLevel: ''
//       }
//     ],
//     projects: [
//       {
//         projectName: '',
//         projectDescription: '',
//         projectStartDate: '',
//         projectEndDate: '',
//         projectStatus: '',
//         isPrivate: false,
//         company: ''
//       }
//     ]
//   });

//   const handleProfileFieldChange = (path, value) => {
//     setProfileData((prev) => {
//       const updated = { ...prev };
//       let target = updated;
//       for (let i = 0; i < path.length - 1; i++) {
//         target = target[path[i]];
//       }
//       target[path[path.length - 1]] = value;
//       return updated;
//     });
//   };

//   const validateProfileData = () => {
//     const requiredFields = [
//       profileData.profileDetails.firstName,
//       profileData.profileDetails.jobTitle,
//       profileData.profileDetails.aboutMe,
//       profileData.contactInformation.phoneNumber,
//       profileData.education.degreeType,
//       profileData.skills[0]?.skillName,
//       profileData.projects[0]?.projectName
//     ];
//     return requiredFields.every(field => field && field.trim() !== '');
//   };

//   const handleSaveAllProfile = async () => {
//     if (!validateProfileData()) {
//       alert('Lütfen tüm zorunlu alanları doldurun.');
//       return;
//     }

//     try {
//       const response = await axios.post("http://localhost:9090/api/profile/save", profileData);
//       console.log("✅ Profile saved:", response.data);
//     } catch (error) {
//       console.error("❌ Error saving profile:", error.response?.data || error.message);
//     }
//   };

//   useEffect(() => {
//     const fetchProfileData = async () => {
//       const token = localStorage.getItem('token'); // veya sessionStorage.getItem('token')
//       if (!token) {
//         console.error("❌ Token bulunamadı. Giriş yapılmamış.");
//         return;
//       }

//       try {
//         const response = await axios.get("http://localhost:9090/api/profile/get", {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });

//         setProfileData(response.data);
//         console.log("✅ Profile data fetched successfully");

//       } catch (error) {
//         console.error("❌ Error fetching profile data:", error.response?.data || error.message);
//       }
//     };

//     fetchProfileData();
//   }, []);



//   return (
//     <div className="min-h-screen bg-white font-sans">

//       {/* İçerik */}
//       <div className="w-full px-4 py-6">
//         <div className="max-w-[1200px] mx-auto flex gap-6">
//           {/* Sol Panel - Profil */}
//           <div className="w-[280px] bg-[#061A40] text-white rounded-lg p-6">
//   <div className="text-center">
//     <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white flex items-center justify-center">
//       <span className="text-3xl">👤</span>
//     </div>

//     <input
//       type="text"
//       value={profileData.profileDetails.firstName}
//       onChange={(e) => handleProfileFieldChange(['profileDetails', 'firstName'], e.target.value)}

//       className="text-lg font-semibold mb-1 bg-transparent text-white text-center focus:outline-none"
//     />
//     <input
//       type="text"
//       value={profileData.profileDetails.jobTitle}
//       onChange={(e) => handleProfileFieldChange(['profileDetails', 'jobTitle'], e.target.value)}
//       className="text-sm text-gray-300 mb-6 bg-transparent text-center focus:outline-none"
//     />

//     <ul className="text-left space-y-2.5 text-sm text-gray-300">
//   {[
//     ['Nationality', ['profileDetails', 'nationality']],
//     ['Currently Working', ['profileDetails', 'currentEmploymentStatus']],
//     ['Phone Number', ['contactInformation', 'phoneNumber']],
//     ['Country', ['contactInformation', 'country']],
//     ['City', ['contactInformation', 'city']],
//     ['Gender', ['profileDetails', 'gender']],
//     ['Military Status', ['profileDetails', 'militaryStatus']],
//     ['Disability Status', ['profileDetails', 'disabilityStatus']],
//     ['Marital Status', ['profileDetails', 'maritalStatus']],
//     ['Driving License', ['profileDetails', 'drivingLicense']],
//     ['Profile Privacy', ['profileDetails', 'isPrivateProfile']],
//     ['Github', ['socialLinks', 'githubUrl']],
//     ['Portfolio', ['socialLinks', 'websiteUrl']]
//   ].map(([label, path]) => (
//     <li key={path.join('.')} className="flex flex-col gap-1">
//       <span className="text-xs font-semibold">{label}</span>
//       <input
//         type="text"
//         value={path.reduce((acc, curr) => acc?.[curr], profileData) || ''}
//         onChange={(e) => handleProfileFieldChange(path, e.target.value)}
//         className="bg-transparent border-b border-gray-500 text-white text-sm focus:outline-none"
//       />
//     </li>
//   ))}
// </ul>

//     <button
//       onClick={handleSaveAllProfile}
//       className="mt-6 bg-blue-600 hover:bg-blue-700 text-white text-sm px-6 py-1.5 rounded transition"
//     >
//       Save
//     </button>
//   </div>
// </div>


//       {/* Sağ Panel - Bilgiler */}
//       <div className="flex-1 bg-white rounded-lg p-6 space-y-6">
//         {/* Biography */}
//         <div className="mb-6">
//           <h3 className="font-semibold mb-2">Biography</h3>
//           <textarea
//             value={profileData.profileDetails.aboutMe}
//             onChange={(e) => handleProfileFieldChange(['profileDetails', 'aboutMe'], e.target.value)}
//             className="w-full border border-gray-300 rounded-md p-2 text-sm"
//             rows={4}
//             placeholder="Tell us about yourself..."
//           />
//         </div>

//         <div className="mb-6">
//           <h3 className="font-semibold mb-2">Phone Number</h3>
//           <input
//             type="text"
//             value={profileData.contactInformation.phoneNumber}
//             onChange={(e) => handleProfileFieldChange(['contactInformation', 'phoneNumber'], e.target.value)}
//             className="w-full border border-gray-300 rounded-md p-2 text-sm"
//             placeholder="Enter phone number"
//           />
//         </div>

//         <div className="mb-6">
//           <h3 className="font-semibold mb-2">Github URL</h3>
//           <input
//             type="text"
//             value={profileData.socialLinks.githubUrl}
//             onChange={(e) => handleProfileFieldChange(['socialLinks', 'githubUrl'], e.target.value)}
//             className="w-full border border-gray-300 rounded-md p-2 text-sm"
//             placeholder="Enter github profile url"
//           />
//         </div>

//         {/* Work Experiences */}
//         {profileData.workExperiences.map((exp, index) => (
//           <div key={index} className="mb-6 border-b pb-4">
//             <h3 className="font-semibold mb-2">Work Experience #{index + 1}</h3>
//             <input
//               type="text"
//               placeholder="Company Name"
//               value={exp.companyName}
//               onChange={(e) => {
//                 const updated = [...profileData.workExperiences];
//                 updated[index].companyName = e.target.value;
//                 handleProfileFieldChange(['workExperiences'], updated);
//               }}
//               className="w-full border-b border-gray-300 p-1 text-sm mb-2"
//             />
//             <input
//               type="text"
//               placeholder="Job Title"
//               value={exp.jobTitle}
//               onChange={(e) => {
//                 const updated = [...profileData.workExperiences];
//                 updated[index].jobTitle = e.target.value;
//                 handleProfileFieldChange(['workExperiences'], updated);
//               }}
//               className="w-full border-b border-gray-300 p-1 text-sm"
//             />
//           </div>
//         ))}

//         {/* Education */}
//         <div className="mb-6">
//           <h3 className="font-semibold mb-2">Education</h3>
//           <input
//             type="text"
//             placeholder="Degree Type"
//             value={profileData.education.degreeType}
//             onChange={(e) => handleProfileFieldChange(['education', 'degreeType'], e.target.value)}
//             className="w-full border-b border-gray-300 p-1 text-sm"
//           />
//           <input
//             type="text"
//             placeholder="Bachelor Department"
//             value={profileData.education.bachelorDepartment}
//             onChange={(e) => handleProfileFieldChange(['education', 'bachelorDepartment'], e.target.value)}
//             className="w-full border-b border-gray-300 p-1 text-sm"
//           />
//         </div>

//         {/* Skills */}
//         <div className="mb-6">
//           <h3 className="font-semibold mb-2">Skills</h3>
//           {profileData.skills.map((skill, index) => (
//             <input
//               key={index}
//               type="text"
//               value={skill.skillName}
//               onChange={(e) => {
//                 const updated = [...profileData.skills];
//                 updated[index].skillName = e.target.value;
//                 handleProfileFieldChange(['skills'], updated);
//               }}
//               placeholder="Skill"
//               className="w-full border-b border-gray-300 p-1 text-sm mb-2"
//             />
//           ))}
//         </div>

//         {/* Projects */}
//         {profileData.projects.map((proj, index) => (
//           <div key={index} className="mb-6 border-b pb-4">
//             <h3 className="font-semibold mb-2">Project #{index + 1}</h3>
//             <input
//               type="text"
//               placeholder="Project Name"
//               value={proj.projectName}
//               onChange={(e) => {
//                 const updated = [...profileData.projects];
//                 updated[index].projectName = e.target.value;
//                 handleProfileFieldChange(['projects'], updated);
//               }}
//               className="w-full border-b border-gray-300 p-1 text-sm"
//             />
//           </div>
//         ))}

//         {/* Certifications */}
//         <div className="mb-6">
//           <h3 className="font-semibold mb-2">Certifications</h3>
//           {profileData.certifications.map((cert, index) => (
//             <input
//               key={index}
//               type="text"
//               placeholder="Certification Name"
//               value={cert.certificationName}
//               onChange={(e) => {
//                 const updated = [...profileData.certifications];
//                 updated[index].certificationName = e.target.value;
//                 handleProfileFieldChange(['certifications'], updated);
//               }}
//               className="w-full border-b border-gray-300 p-1 text-sm mb-2"
//             />
//           ))}
//         </div>

//         {/* Language Proficiency */}
//         <div className="mb-6">
//           <h3 className="font-semibold mb-2">Languages</h3>
//           {profileData.languageProficiency.map((lang, index) => (
//             <input
//               key={index}
//               type="text"
//               placeholder="Language"
//               value={lang.language}
//               onChange={(e) => {
//                 const updated = [...profileData.languageProficiency];
//                 updated[index].language = e.target.value;
//                 handleProfileFieldChange(['languageProficiency'], updated);
//               }}
//               className="w-full border-b border-gray-300 p-1 text-sm mb-2"
//             />
//           ))}
//         </div>

//         {/* References */}
//         <div className="mb-6">
//           <h3 className="font-semibold mb-2">References</h3>
//           {profileData.references.map((ref, index) => (
//             <input
//               key={index}
//               type="text"
//               placeholder="Reference Name"
//               value={ref.referenceName}
//               onChange={(e) => {
//                 const updated = [...profileData.references];
//                 updated[index].referenceName = e.target.value;
//                 handleProfileFieldChange(['references'], updated);
//               }}
//               className="w-full border-b border-gray-300 p-1 text-sm mb-2"
//             />
//           ))}
//         </div>

//         {/* Exams and Achievements */}
//         <div className="mb-6">
//           <h3 className="font-semibold mb-2">Exams and Achievements</h3>
//           {profileData.examsAndAchievements.map((exam, index) => (
//             <input
//               key={index}
//               type="text"
//               placeholder="Exam Name"
//               value={exam.examName}
//               onChange={(e) => {
//                 const updated = [...profileData.examsAndAchievements];
//                 updated[index].examName = e.target.value;
//                 handleProfileFieldChange(['examsAndAchievements'], updated);
//               }}
//               className="w-full border-b border-gray-300 p-1 text-sm mb-2"
//             />
//           ))}
//         </div>

//         <div className="text-center pt-4">
//           <button
//             onClick={handleSaveAllProfile}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg transition"
//           >
//             Update Information
//           </button>
//         </div>

//       </div>
//     </div>
//     </div>
//     </div>
//   );
// }
