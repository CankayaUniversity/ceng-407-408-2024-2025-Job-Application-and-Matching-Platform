import React, {useEffect, useState} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import axios from "axios";
import {BriefcaseIcon} from "@heroicons/react/24/outline/index.js";
import {
  ClipboardDocumentCheckIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  HeartIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline";
import Toast from "./components/Toast.jsx";


export default function JobSeekerDashboard() {
  const [showForm, setShowForm] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountryId, setSelectedCountryId] = useState(null);

  const [message, setMessage] = useState(null);

  const [showToast, setShowToast] = useState(false);
  const handleCloseToast = () => {
    setShowToast(false);
  };
  const [userName, setUserName] = useState('');

  // const { user } = useUser();
  useEffect(() => {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');

    if (!token || !id) {
      console.log('User not logged in or ID is missing');
      return;
    }

    fetch(`http://localhost:9090/candidate/userName/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
        .then(res => res.json())
        .then(data => {
          if (data && data.userName) {
            setUserName(data.userName);
          } else {
            console.log('No username found in the response');
          }
        })
        .catch(err => console.error("Unable to fetch user info", err));
  }, []);


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
      associateDepartment: {
        name: '',
        university: {
          name: '',
          city: {
            name: ''
          }
        }
      },
      associateStartDate: '',
      associateEndDate: '',
      associateIsOngoing: false,

      bachelorDepartment: {
        name: '',
        university: {
          name: '',
          city: {
            name: ''
          }
        }
      },
      bachelorStartDate: '',
      bachelorEndDate: '',
      bachelorIsOngoing: false,

      masterDepartment: {
        name: '',
        university: {
          name: '',
          city: {
            name: ''
          }
        }
      },
      masterStartDate: '',
      masterEndDate: '',
      masterIsOngoing: false,
      masterThesisTitle: '',
      masterThesisDescription: '',
      masterThesisUrl: '',

      doctorateDepartment: {
        name: '',
        university: {
          name: '',
          city: {
            name: ''
          }
        }
      },
      doctorateStartDate: '',
      doctorateEndDate: '',
      doctorateIsOngoing: false,
      doctorateThesisTitle: '',
      doctorateThesisDescription: '',
      doctorateThesisUrl: '',

      isDoubleMajor: false,
      doubleMajorDepartment: {
        name: '',
        university: {
          name: '',
          city: {
            name: ''
          }
        }
      },
      doubleMajorStartDate: '',
      doubleMajorEndDate: '',
      doubleMajorIsOngoing: false,

      isMinor: false,
      minorDepartment: {
        name: '',
        university: {
          name: '',
          city: {
            name: ''
          }
        }
      },
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", localStorage.getItem("id"));
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:9090/candidate/profile-picture", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      method: "POST",
      body: formData,
    })
        .then((res) => res.text())  // plain text url dönecek
        .then((url) => {
          console.log(url)
          handleProfileFieldChange(['profileDetails', 'profilePicture'], url);
        })
        .catch((err) => {
          console.error("Fotoğraf yükleme hatası:", err);
        });
  };
  useEffect(() => {
    const githubUrl = profileData.socialLinks?.githubUrl;
    if (githubUrl && githubUrl.includes("github.com")) {
      fetchGithubProjects(githubUrl).then(projectsFromGithub => {
        setProfileData(prevData => ({
          ...prevData,
          projects: projectsFromGithub
        }));
      });
    }
  }, [profileData.socialLinks?.githubUrl]);

  const fetchGithubProjects = async (githubUrl) => {
    const username = githubUrl.split("https://github.com/")[1]?.split("/")[0];
    if (!username) return [];

    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos`);
      const data = await response.json();

      return data.map(repo => ({
        projectName: repo.name,
        projectDescription: repo.description || '',
        projectStartDate: '',
        projectEndDate: '',
        projectStatus: 'COMPLETED',
        isPrivate: repo.isPrivate,
        company: null
      }));
    } catch (error) {
      console.error("GitHub verileri alınamadı:", error);
      return [];
    }
  };

  const [nationality, setNationality] = useState([]);

  useEffect(() => {
    const fetchNationality = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get("http://localhost:9090/enum/nationality", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setNationality(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Nationality types fetch error:", error);
      }
    };

    fetchNationality();
  }, []);
  const [positionTypes, setPositionTypes] = useState([]);
  useEffect(() => {
    const fetchPositionTypes = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get("http://localhost:9090/enum/jobPosition", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPositionTypes(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Position types fetch error:", error);
      }
    };

    fetchPositionTypes();
  }, []);

  const [universities, setUniversities] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchUni = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get("http://localhost:9090/enum/universities", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUniversities(response.data);
        console.log('UNI'+JSON.stringify(response.data));
      } catch (error) {
        console.error("Position types fetch error:", error);
      }
    };
    fetchUni();
  }, []);

  const handleUniversityChange = (departmentKey) => (event) => {
    const universityId = Number(event.target.value);
    const uni = universities.find(u => u.id === universityId);
    if (!uni) return;

    handleProfileFieldChange(
        ['education', departmentKey, 'university', 'id'],
        uni.id
    );
    handleProfileFieldChange(
        ['education', departmentKey, 'university', 'name'],
        uni.name
    );
    handleProfileFieldChange(
        ['education', departmentKey, 'university', 'city', 'name'],
        uni.city.name
    );

    setDepartments(uni.departments || []);

    handleProfileFieldChange(['education', departmentKey, 'name'], '');
  };

  const handleDepartmentChange = (departmentKey) => (event) => {
    const departmentName = event.target.value;
    handleProfileFieldChange(['education', departmentKey, 'name'], departmentName);
  };



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


    fetch(`http://localhost:9090/candidate/profileDetail/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
        .then(res => res.json())
        .then(data => {
          console.log("data:", data);
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
        if (!target[path[i]]) {
          // Null veya undefined ise içeriği boş bir nesne yap
          target[path[i]] = {};
        }
        target = target[path[i]];
      }

      target[path[path.length - 1]] = value;
      return updated;
    });
  };

  const jobPositions = Array.isArray(profileData.jobPreferences?.preferredPositions)
      ? profileData.jobPreferences?.preferredPositions
      : profileData.jobPreferences?.preferredPositions
          ? [profileData.jobPreferences?.preferredPositions]
          : [];
  const jobPositionTypes = jobPositions.map(jp => jp.positionType);
  const customJobPositionNames = jobPositions
      .map(jp => {
        const positionName = jp.customJobPosition?.positionName;
        return (positionName && positionName !== "null") ? { positionName } : null;
      })
      .filter(pos => pos !== null);

  const selectedCountry = countries.find(c => c.id === Number(profileData?.contactInformation?.country));
  const selectedCity = cities.find(c => c.id === Number(profileData?.contactInformation?.city));

  const formatDate = (dateString) => {
    if (!dateString) return null;

    const [day, month, year] = dateString.split("-");

    const formatted = `${year}-${month}-${day}`;
    const d = new Date(formatted);

    if (isNaN(d.getTime())) return null;

    return d.toISOString().split("T")[0]; d
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    const dto = {
      //profile details
      aboutMe: profileData.profileDetails?.aboutMe,
      nationality: profileData.profileDetails?.nationality,
      gender: profileData.profileDetails?.gender,
      militaryStatus: profileData.profileDetails?.militaryStatus,
      militaryDefermentDate: formatDate(profileData.profileDetails?.militaryDefermentDate),
      disabilityStatus: profileData.profileDetails?.disabilityStatus,
      maritalStatus: profileData.profileDetails?.maritalStatus,
      currentEmploymentStatus: profileData.profileDetails?.currentEmploymentStatus || false,
      drivingLicense: profileData.profileDetails?.drivingLicense || false,
      isPrivateProfile: profileData.profileDetails?.isPrivateProfile || false,
      profilePicture: profileData.profileDetails?.profilePicture,
      birthDate: formatDate(profileData.profileDetails?.birthDate),

      //social links
      githubUrl: profileData.socialLinks?.githubUrl,
      linkedinUrl: profileData.socialLinks?.linkedinUrl,
      websiteUrl: profileData.socialLinks?.websiteUrl,
      blogUrl: profileData.socialLinks?.blogUrl,
      otherLinksUrl: profileData.socialLinks?.otherLinksUrl,
      otherLinksDescription: profileData.socialLinks?.otherLinksDescription,

      // contact info
      phoneNumber: profileData.contactInformation?.phoneNumber,
      country: typeof profileData.contactInformation?.country === "object"
          ? profileData.contactInformation.country.id
          : profileData.contactInformation?.country,

      city: typeof profileData.contactInformation?.city === "object"
          ? profileData.contactInformation.city.id
          : profileData.contactInformation?.city,


      //job preferences
      jobPositionTypes: jobPositionTypes,
      customJobPositionNames: customJobPositionNames,
      preferredWorkType: profileData.jobPreferences?.preferredWorkType,
      minWorkHour: Number(profileData.jobPreferences?.minWorkHour),
      maxWorkHour: Number(profileData.jobPreferences?.maxWorkHour),
      canTravel: profileData.jobPreferences?.canTravel || false,
      expectedSalary: profileData.jobPreferences?.expectedSalary,

      // refernces
      referenceName: profileData.references.map(s => s.referenceName),
      referenceCompany: profileData.references.map(s => s.referenceCompany),
      referenceJobTitle: profileData.references.map(s => s.referenceJobTitle),
      referenceContactInfo: profileData.references.map(s => s.referenceContactInfo),
      referenceYearsWorked: profileData.references.map(s => Number(s.referenceYearsWorked)),


      //languageproficiency
      languageProficiencyLanguages: profileData.languageProficiency.map(l => l.language),
      languageProficiencyReadingLevels: profileData.languageProficiency.map(l => l.readingLevel),
      languageProficiencyWritingLevels: profileData.languageProficiency.map(l => l.writingLevel),
      languageProficiencySpeakingLevels: profileData.languageProficiency.map(l => l.speakingLevel),
      languageProficiencyListeningLevels: profileData.languageProficiency.map(l => l.listeningLevel),

      //hobbies
      hobbyName: profileData.hobbies.map(b => b.hobbyName),
      description: profileData.hobbies.map(b => b.description),

      //education
      educationDegreeType: profileData.education?.degreeType,

      associateDepartmentName: profileData.education?.associateDepartment?.name,
      associateUniversityName: profileData.education?.associateDepartment?.university?.name,
      associateUniversityCityName: profileData.education?.associateDepartment?.university?.city?.name,
      associateStartDate: formatDate(profileData.education?.associateStartDate),
      associateEndDate:formatDate( profileData.education?.associateEndDate),
      associateIsOngoing: profileData.education?.associateIsOngoing || false,

      bachelorDepartmentName: profileData.education?.bachelorDepartment?.name,
      bachelorUniversityName: profileData.education?.bachelorDepartment?.university?.name,
      bachelorUniversityCityName: profileData.education?.bachelorDepartment?.university?.city?.name,
      bachelorStartDate:formatDate( profileData.education?.bachelorStartDate),
      bachelorEndDate: formatDate(profileData.education?.bachelorEndDate),
      bachelorIsOngoing: profileData.education?.bachelorIsOngoing|| false,

      masterDepartmentName: profileData.education?.masterDepartment?.name,
      masterUniversityName: profileData.education?.masterDepartment?.university?.name,
      masterUniversityCityName: profileData.education?.masterDepartment?.university?.city?.name,
      masterStartDate: formatDate(profileData.education?.masterStartDate),
      masterEndDate:formatDate( profileData.education?.masterEndDate),
      masterIsOngoing: profileData.education?.masterIsOngoing|| false,
      masterThesisTitle: profileData.education?.masterThesisTitle,
      masterThesisDescription: profileData.education?.masterThesisDescription,
      masterThesisUrl: profileData.education?.masterThesisUrl,

      doctorateDepartmentName: profileData.education?.doctorateDepartment?.name,
      doctorateUniversityName: profileData.education?.doctorateDepartment?.university?.name,
      doctorateUniversityCityName: profileData.education?.doctorateDepartment?.university?.city?.name,
      doctorateStartDate: formatDate(profileData.education?.doctorateStartDate),
      doctorateEndDate: formatDate(profileData.education?.doctorateEndDate),
      doctorateIsOngoing: profileData.education?.doctorateIsOngoing|| false,
      doctorateThesisTitle: profileData.education?.doctorateThesisTitle,
      doctorateThesisDescription: profileData.education?.doctorateThesisDescription,
      doctorateThesisUrl: profileData.education?.doctorateThesisUrl,

      isDoubleMajor: profileData.education?.isDoubleMajor,
      doubleMajorDepartmentName: profileData.education?.doubleMajorDepartment?.name,
      doubleMajorUniversityName: profileData.education?.doubleMajorDepartment?.university?.name,
      doubleMajorUniversityCityName: profileData.education?.doubleMajorDepartment?.university?.city?.name,
      doubleMajorStartDate: formatDate(profileData.education?.doubleMajorStartDate),
      doubleMajorEndDate:formatDate( profileData.education?.doubleMajorEndDate),
      doubleMajorIsOngoing: profileData.education?.doubleMajorIsOngoing,

      isMinor: profileData.education?.isMinor,
      minorDepartmentName: profileData.education?.minorDepartment?.name,
      minorUniversityName: profileData.education?.minorDepartment?.university?.name,
      minorUniversityCityName: profileData.education?.minorDepartment?.university?.city?.name,
      minorStartDate: formatDate(profileData.education?.minorStartDate),
      minorEndDate: formatDate(profileData.education?.minorEndDate),
      minorIsOngoing: profileData.education?.minorIsOngoing|| false,

      //certifications
      certificationName: profileData.certifications.map(s => s.certificationName),
      certificationUrl: profileData.certifications.map(s => s.certificationUrl),
      certificateValidityDate: profileData.certifications.map(s =>formatDate( s.certificateValidityDate)),
      issuedBy: profileData.certifications.map(s => s.issuedBy),

      //workexperinece
      companyName: profileData.workExperiences.map(s => s.companyName),
      industry: profileData.workExperiences.map(s => s.industry),
      jobTitle: profileData.workExperiences.map(s => s.jobTitle),
      jobDescription: profileData.workExperiences.map(s => s.jobDescription),
      employmentType: profileData.workExperiences.map(s => s.employmentType),
      startDate: profileData.workExperiences.map(s => formatDate(s.startDate)),
      endDate: profileData.workExperiences.map(s => formatDate(s.endDate)),
      isGoing: profileData.workExperiences.map(s => s.isGoing|| false),

      //examsAndAchievements
      examName: profileData.examsAndAchievements.map(s => s.examName),
      examYear: profileData.examsAndAchievements.map(s => Number(s.examYear)),
      examScore: profileData.examsAndAchievements.map(s => Number(s.examScore)),
      examRank: profileData.examsAndAchievements.map(s => s.examRank),

      //uploadedDocuments
      documentName: profileData.uploadedDocuments.map(s => s.documentName),
      documentType: profileData.uploadedDocuments.map(s => s.documentType),
      documentCategory: profileData.uploadedDocuments.map(s => s.documentCategory),
      documentUrl: profileData.uploadedDocuments.map(s => s.documentUrl),
      isPrivate: profileData.uploadedDocuments.map(s => s.isPrivate|| false),

      //skills
      skillName: profileData.skills.map(s => s.skillName),
      skillLevel: profileData.skills.map(s => s.skillLevel),

      //projcts
      projectName: profileData.projects.map(s => s.projectName),
      projectDescription: profileData.projects.map(s => s.projectDescription),
      projectStartDate: profileData.projects.map(s => formatDate(s.projectStartDate)),
      projectEndDate: profileData.projects.map(s => formatDate(s.projectEndDate)),
      projectStatus: profileData.projects.map(s => s.projectStatus),
      isPrivateProject: profileData.projects.map(s => s.isPrivate || false),
      company: profileData.projects.map(s => s.company),


    };


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
        body: JSON.stringify(dto)
      });
      console.log('Giden veri:', JSON.stringify(profileData));

      console.log('Giden veri:', JSON.stringify(dto));
      if (!response.ok) {
        setMessage('Profile could not be created. Please check the form.');
        setShowToast(true);
        throw new Error('Profil oluşturulamadı');
      }

      const data = await response.json();
      setMessage('Profile Successfully Updated!');
      setShowToast(true);

      // Başarılıysa pencere kapat veya yönlendir
    } catch (error) {
      console.error('Hata:', error);
    }
  };



  const handleCloseForm = () => {
    setDirection(1);
    setCurrentStep(1);   // Step'i başa alıyoruz
    setShowForm(false);  // Formu kapatıyoruz
    setFormKey((prev) => prev + 1);
  };

  const handlePositionSelectChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);

    const updatedPreferredPositions = selectedOptions.map(positionType => {
      if (positionType === "OTHER") {
        // Önceki custom değer varsa onu koru
        const existingCustom = profileData.jobPreferences.preferredPositions.find(pos => pos.positionType === "CUSTOM");
        return {
          positionType: "OTHER",
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
          <div className="max-w-[1200px] mx-auto bg-gray-100 rounded-xl p-10 space-y-10 shadow-md">

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
                      <img
                          src={`http://localhost:9090${profileData.profileDetails?.profilePicture}`}
                          alt="Profile"
                          style={{width: '150px', height: '150px'}}
                          className="rounded-full border-4 border-white"
                      />


                      <h2 className="text-xl font-bold">{userName || '-'}</h2>

                      {/* Bilgi listesi */}
                      <div className="space-y-2 text-sm w-full">
                        <p><strong>About Me:</strong> {profileData.profileDetails?.aboutMe || '-'}</p>
                        <p><strong>Nationality:</strong> {profileData.profileDetails?.nationality
                            ?.replaceAll("_", " ")
                            ?.toLowerCase()
                            ?.replace(/\b\w/g, c => c.toUpperCase()) || '-'}</p>
                        <p><strong>Birth Date:</strong> {profileData.profileDetails?.birthDate || '-'}</p>
                        <p><strong>Gender:</strong> {profileData.profileDetails?.gender
                            ?.replaceAll("_", " ")
                            ?.toLowerCase()
                            ?.replace(/\b\w/g, c => c.toUpperCase()) || '-'}</p>

                        {profileData.profileDetails?.gender === "MALE" && (
                            <p><strong>Military
                              Status:</strong> {profileData.profileDetails?.militaryStatus?.replaceAll("_", " ")
                                ?.toLowerCase()
                                ?.replace(/\b\w/g, c => c.toUpperCase()) || '-'}</p>
                        )}

                        {profileData.profileDetails?.militaryStatus === "DEFERRED" && (
                            <p><strong>Military Deferment
                              Date:</strong> {profileData.profileDetails?.militaryDefermentDate || '-'}</p>
                        )}

                        <p><strong>Disability
                          Status:</strong> {profileData.profileDetails?.disabilityStatus?.replaceAll("_", " ")
                            ?.toLowerCase()
                            ?.replace(/\b\w/g, c => c.toUpperCase()) || '-'}</p>
                        <p><strong>Marital Status:</strong> {profileData.profileDetails?.maritalStatus
                            ?.replaceAll("_", " ")
                            ?.toLowerCase()
                            ?.replace(/\b\w/g, c => c.toUpperCase()) || '-'}</p>

                        <p><strong>Currently
                          Working:</strong> {profileData.profileDetails?.currentEmploymentStatus ? 'Yes' : 'No'}</p>
                        <p><strong>Driving License:</strong> {profileData.profileDetails?.drivingLicense ? 'Yes' : 'No'}
                        </p>
                        <p><strong>Profile
                          Privacy:</strong> {profileData.profileDetails?.isPrivateProfile ? 'Private' : 'Public'}</p>

                        <p><strong>Phone Number:</strong> {profileData.contactInformation?.phoneNumber || '-'}</p>
                        <p>
                          <strong>Country:</strong> {selectedCountry?.name||profileData.contactInformation?.country?.name|| '-'}
                        </p>
                        <p>
                          <strong>City:</strong> {selectedCity?.name||profileData.contactInformation?.city?.name||  '-'}
                        </p>

                        <p><strong>Github:</strong> {profileData.socialLinks?.githubUrl || '-'}</p>
                        <p><strong>LinkedIn:</strong> {profileData.socialLinks?.linkedinUrl || '-'}</p>
                        <p><strong>Website:</strong> {profileData.socialLinks?.websiteUrl || '-'}</p>
                        <p><strong>Blog:</strong> {profileData.socialLinks?.blogUrl || '-'}</p>
                        <p><strong>Other Links:</strong> {profileData.socialLinks?.otherLinksUrl || '-'}</p>
                        <p><strong>Other Links
                          Description:</strong> {profileData.socialLinks?.otherLinksDescription || '-'}</p>
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

                      <Toast message={message} show={showToast} onClose={handleCloseToast} />

                    </div>
                  </div>


                  {/* Sağ Taraftaki Bilgi Alanları */}
                  <div
                      style={{backgroundColor: "#f8f9f9", borderRadius: "15px", padding: "10px"}}
                      className="w-2/3 bg-gray-100 p-4 rounded-lg">
                    {/* İç Beyaz Kutu */}
                    <div style={{borderRadius: "15px", padding: "10px"}}
                         className="bg-white p-8 rounded-lg space-y-6 shadow-md">

                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <ClipboardDocumentCheckIcon className="text-blue-600"
                                                      style={{width: '20px', height: '20px'}}/>
                          Job Preferences
                        </h3>
                        <div className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                          {profileData.jobPreferences?.preferredPositions && profileData.jobPreferences?.preferredPositions.length > 0 ? (
                              <>
                                <p>
                                  <strong>Preferred Positions:</strong>{' '}
                                  {profileData.jobPreferences.preferredPositions
                                      .map(pos =>
                                          pos.positionType
                                              ? pos.positionType.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
                                              : pos.customJobPosition?.positionName || '-'
                                      )
                                      .join(', ')}
                                </p>
                                <p>
                                  <strong>Preferred Work Type:</strong>{' '}
                                  {profileData.jobPreferences?.preferredWorkType
                                      ? profileData.jobPreferences.preferredWorkType.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
                                      : '-'}
                                </p>
                                <p>
                                  <strong>Work Hours:</strong>{' '}
                                  {profileData.jobPreferences?.minWorkHour !== undefined && profileData.jobPreferences?.maxWorkHour !== undefined
                                      ? `${profileData.jobPreferences.minWorkHour} - ${profileData.jobPreferences.maxWorkHour}`
                                      : '-'}
                                </p>
                                <p>
                                  <strong>Can Travel:</strong>{' '}
                                  {profileData.jobPreferences?.canTravel ? 'Yes' : 'No'}
                                </p>
                                <p>
                                  <strong>Expected Salary:</strong>{' '}
                                  {profileData.jobPreferences?.expectedSalary || '-'}
                                </p>
                              </>
                          ) : (
                              <p className="text-gray-500">No job preferences added.</p>
                          )}
                        </div>
                      </div>

                      {/* References Section */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <EnvelopeIcon className="text-blue-600" style={{width: '20px', height: '20px'}}/>
                          References
                        </h3>
                        <div className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                          {profileData.references && profileData.references.length > 0 && profileData.references[0].referenceName ? (
                              profileData.references.map((ref, idx) => (
                                  <div key={idx} className="border-b pb-2 mb-2">
                                    <p><strong>Name:</strong> {ref.referenceName || '-'}</p>
                                    <p><strong>Company:</strong> {ref.referenceCompany || '-'}</p>
                                    <p><strong>Job Title:</strong> {ref.referenceJobTitle || '-'}</p>
                                    <p><strong>Contact Info:</strong> {ref.referenceContactInfo || '-'}</p>
                                    <p><strong>Years Worked:</strong> {ref.referenceYearsWorked || '-'}</p>
                                  </div>
                              ))
                          ) : (
                              <p className="text-gray-500">No references added.</p>
                          )}
                        </div>
                      </div>

                      {/* Language Proficiency Section */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <GlobeAltIcon className="text-blue-600" style={{width: '20px', height: '20px'}}/>
                          Language Proficiency
                        </h3>
                        <div className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                          {profileData.languageProficiency && profileData.languageProficiency.length > 0 && profileData.languageProficiency[0].language ? (
                              profileData.languageProficiency.map((lang, idx) => (
                                  <div key={idx} className="border-b pb-2 mb-2">
                                    <p><strong>Language:</strong> {lang.language || '-'}</p>
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
                              <p className="text-gray-500">No language proficiency added.</p>
                          )}
                        </div>
                      </div>
                      {/* Hobbies Section */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <HeartIcon className="text-blue-600" style={{width: '20px', height: '20px'}}/>
                          Hobbies
                        </h3>
                        <div className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                          {profileData.hobbies && profileData.hobbies.length > 0 && profileData.hobbies[0].hobbyName ? (
                              profileData.hobbies.map((hobby, idx) => (
                                  <div key={idx} className="border-b pb-2 mb-2">
                                    <p><strong>Hobby:</strong> {hobby.hobbyName || '-'}</p>
                                    <p><strong>Description:</strong> {hobby.description || '-'}</p>
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
                          <ClipboardDocumentCheckIcon className="text-blue-600" style={{ width: '20px', height: '20px' }} />
                          Education
                        </h3>

                        <div className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm space-y-4">

                          {/* Associate */}
                          {profileData.education?.associateDepartment?.name && (
                              <div>
                                <h4 className="font-semibold mb-1">Associate Degree</h4>
                                <p><strong>Department:</strong> {profileData.education.associateDepartment?.name || '-'}</p>
                                <p><strong>University:</strong> {profileData.education.associateDepartment?.university?.name || '-'}</p>
                                <p><strong>City:</strong> {profileData.education.associateDepartment?.university?.city?.name || '-'}</p>
                                <p><strong>Start Date:</strong> {profileData.education.associateStartDate || '-'}</p>
                                <p>
                                  <strong>End Date:</strong> {profileData.education.associateIsOngoing ? 'Ongoing' : (profileData.education.associateEndDate || '-')}
                                </p>
                              </div>
                          )}


                          {/* Bachelor */}
                          {profileData.education?.bachelorDepartment?.name  && (
                              <div>
                                <h4 className="font-semibold mb-1">Bachelor Degree</h4>
                                <p><strong>Department:</strong> {profileData.education.bachelorDepartment?.name || '-'}
                                </p>
                                <p>
                                  <strong>University:</strong> {profileData.education.bachelorDepartment?.university?.name || '-'}
                                </p>
                                <p>
                                  <strong>City:</strong> {profileData.education.bachelorDepartment?.university?.city?.name || '-'}
                                </p>
                                <p><strong>Start Date:</strong> {profileData.education.bachelorStartDate || '-'}</p>
                                <p><strong>End Date:</strong> {profileData.education.bachelorIsOngoing ? 'Ongoing' : (profileData.education.bachelorEndDate || '-')}</p>
                              </div>
                          )}

                          {/* Master */}
                          {profileData.education?.masterDepartment?.name   && (
                              <div>
                                <h4 className="font-semibold mb-1">Master Degree</h4>
                                <p><strong>Department:</strong> {profileData.education.masterDepartment?.name || '-'}
                                </p>
                                <p>
                                  <strong>University:</strong> {profileData.education.masterDepartment?.university?.name || '-'}
                                </p>
                                <p>
                                  <strong>City:</strong> {profileData.education.masterDepartment?.university?.city?.name || '-'}
                                </p>
                                <p><strong>Start Date:</strong> {profileData.education.masterStartDate || '-'}</p>
                                <p><strong>End Date:</strong> {profileData.education.masterIsOngoing ? 'Ongoing' : (profileData.education.masterEndDate || '-')}</p>
                                <p><strong>Thesis Title:</strong> {profileData.education.masterThesisTitle || '-'}</p>
                                <p><strong>Thesis Description:</strong> {profileData.education.masterThesisDescription || '-'}</p>
                                <p><strong>Thesis URL:</strong> {profileData.education.masterThesisUrl || '-'}</p>
                              </div>
                          ) }

                          {/* Doctorate */}
                          {profileData.education?.doctorateDepartment?.name  && (
                              <div>
                                <h4 className="font-semibold mb-1">Doctorate Degree</h4>
                                <p><strong>Department:</strong> {profileData.education.doctorateDepartment?.name || '-'}
                                </p>
                                <p>
                                  <strong>University:</strong> {profileData.education.doctorateDepartment?.university?.name || '-'}
                                </p>
                                <p>
                                  <strong>City:</strong> {profileData.education.doctorateDepartment?.university?.city?.name || '-'}
                                </p>
                                <p><strong>Start
                                Date:</strong> {profileData.education.doctorateStartDate || '-'}</p>
                                <p><strong>End Date:</strong> {profileData.education.doctorateIsOngoing ? 'Ongoing' : (profileData.education.doctorateEndDate || '-')}</p>
                                <p><strong>Thesis Title:</strong> {profileData.education.doctorateThesisTitle || '-'}</p>
                                <p><strong>Thesis Description:</strong> {profileData.education.doctorateThesisDescription || '-'}</p>
                                <p><strong>Thesis URL:</strong> {profileData.education.doctorateThesisUrl || '-'}</p>
                              </div>
                          )}

                          {/* Double Major */}
                          {profileData.education?.doubleMajorDepartment?.name  && (
                              <div>
                                <h4 className="font-semibold mb-1">Double Major</h4>
                                <p><strong>Department:</strong> {profileData.education.doubleMajorDepartment?.name || '-'}
                                </p>
                                <p>
                                  <strong>University:</strong> {profileData.education.doubleMajorDepartment?.university?.name || '-'}
                                </p>
                                <p>
                                  <strong>City:</strong> {profileData.education.doubleMajorDepartment?.university?.city?.name || '-'}
                                </p>
                                <p><strong>Start Date:</strong> {profileData.education.doubleMajorStartDate || '-'}</p>
                                <p><strong>End Date:</strong> {profileData.education.doubleMajorIsOngoing ? 'Ongoing' : (profileData.education.doubleMajorEndDate || '-')}</p>
                              </div>
                          )}

                          {/* Minor */}
                          {profileData.education?.minorDepartment?.name  && (
                              <div>
                                <h4 className="font-semibold mb-1">Minor</h4>
                                <p>
                                  <strong>Department:</strong> {profileData.education.minorDepartment?.name || '-'}
                                </p>
                                <p>
                                  <strong>University:</strong> {profileData.education.minorDepartment?.university?.name || '-'}
                                </p>
                                <p>
                                  <strong>City:</strong> {profileData.education.minorDepartment?.university?.city?.name || '-'}
                                </p>
                                <p><strong>Start
                                Date:</strong> {profileData.education.minorStartDate || '-'}</p>
                                <p><strong>End
                                  Date:</strong> {profileData.education.minorIsOngoing ? 'Ongoing' : (profileData.education.minorEndDate || '-')}
                                </p>
                              </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <ClipboardDocumentCheckIcon className="text-blue-600"
                                                      style={{width: '20px', height: '20px'}}/>
                          Certifications
                        </h3>
                        <div className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                          {profileData.certifications?.length > 0 && profileData.certifications[0].certificationName ? (
                              profileData.certifications.map((cert, idx) => (
                                  <div key={idx} className="border-b pb-2 mb-2">
                                    <p> <strong>Certification Name:</strong> {cert.certificationName}</p>
                                    <p><strong>Issued By:</strong> {cert.issuedBy || '-'}</p>
                                    <p><strong>Validity Date:</strong> {cert.certificateValidityDate || '-'}</p>
                                    <p>
                                      <strong>Certificate Link: </strong>
                                      {cert.certificationUrl ? (
                                          <a href={cert.certificationUrl} target="_blank" rel="noopener noreferrer"
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
                              <p className="text-gray-500">No certifications added.</p>
                          )}
                        </div>
                      </div>

                      {/* Work Experiences */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <BriefcaseIcon className="text-blue-600" style={{width: '20px', height: '20px'}}/>
                          Work Experiences
                        </h3>
                        <div className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                          {profileData.workExperiences?.length > 0 && profileData.workExperiences[0].companyName ? (
                              profileData.workExperiences.map((exp, idx) => (
                                  <div key={idx} className="border-b pb-2 mb-2">
                                    <p><strong>Company Name:</strong> {exp.companyName || '-'}</p>
                                    <p><strong>Job Title:</strong> {exp.jobTitle || '-'}</p>
                                    <p><strong>Industry:</strong> {exp.industry || '-'}</p>
                                    <p><strong>Job Description:</strong> {exp.jobDescription || '-'}</p>
                                    <p><strong>Employment
                                      Type:</strong> {exp.employmentType ? exp.employmentType.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) : '-'}
                                    </p>
                                    <p>
                                      <strong>Period:</strong> {exp.startDate || '-'} - {exp.isGoing ? 'Present' : (exp.endDate || '-')}
                                    </p>
                                  </div>
                              ))
                          ) : (
                              <p className="text-gray-500">No work experiences added.</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <ClipboardDocumentCheckIcon className="text-blue-600"
                                                      style={{width: '20px', height: '20px'}}/>
                          Exams and Achievements
                        </h3>
                        <div className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                          {profileData.examsAndAchievements?.length > 0 && profileData.examsAndAchievements[0].examName ? (
                              profileData.examsAndAchievements.map((exam, idx) => (
                                  <div key={idx} className="border-b pb-2 mb-2">
                                    <p><strong>Exam Name:</strong> {exam.examName || '-'} </p>
                                    <p><strong>Year:</strong> {exam.examYear || '-'}</p>
                                    <p><strong>Score:</strong> {exam.examScore || '-'}</p>
                                    <p><strong>Rank:</strong> {exam.examRank || '-'}</p>
                                  </div>
                              ))
                          ) : (
                              <p className="text-gray-500">No exams or achievements added.</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <ClipboardDocumentCheckIcon className="text-blue-600"
                                                      style={{width: '20px', height: '20px'}}/>
                          Uploaded Documents
                        </h3>
                        <div className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                          {profileData.uploadedDocuments?.length > 0 && profileData.uploadedDocuments[0].documentName ? (
                              profileData.uploadedDocuments.map((doc, idx) => (
                                  <div key={idx} className="border-b pb-2 mb-2">
                                    <p ><strong>Document Name:</strong> {doc.documentName}</p>
                                    <p><strong>Type:</strong> {doc.documentType || '-'}</p>
                                    <p><strong>Category:</strong> {doc.documentCategory || '-'}</p>
                                    <p>
                                      <strong>Document Link:</strong>{' '}
                                      {doc.documentUrl ? (
                                          <a href={doc.documentUrl} target="_blank" rel="noopener noreferrer"
                                             className="text-blue-600 underline">
                                            View Document
                                          </a>
                                      ) : (
                                          '-'
                                      )}
                                    </p>
                                    <p><strong>Privacy:</strong> {doc.isPrivate ? 'Private' : 'Public'}</p>
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
                                                      style={{width: '20px', height: '20px'}}/>
                          Skills
                        </h3>
                        <div className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                          {profileData.skills?.length > 0 && profileData.skills[0].skillName ? (
                              profileData.skills.map((skill, idx) => (
                                  <div key={idx} className="border-b pb-2 mb-2">
                                    <p><strong>Name:</strong> {skill.skillName || '-'}</p>
                                    <p><strong>Level:</strong> {skill.skillLevel || '-'}</p>
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
                                                      style={{width: '20px', height: '20px'}}/>
                          Projects
                        </h3>
                        <div className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                          {profileData.projects?.length > 0 && profileData.projects[0].projectName ? (
                              profileData.projects.map((project, idx) => (
                                  <div key={idx} className="border-b pb-2 mb-2">
                                    <p><strong>Project Name:</strong> {project.projectName}</p>
                                    <p><strong>Description:</strong> {project.projectDescription || '-'}</p>
                                    <p><strong>Start Date:</strong> {project.projectStartDate || '-'}</p>
                                    <p><strong>End
                                      Date:</strong> {project.projectStatus === 'ONGOING' ? 'Ongoing' : (project.projectEndDate || '-')}
                                    </p>
                                    <p><strong>Status:</strong> {project.projectStatus || '-'}</p>
                                    <p><strong>Company:</strong> {project.company || '-'}</p>
                                    <p><strong>Privacy:</strong> {project.isPrivate ? 'Private' : 'Public'}</p>
                                  </div>
                              ))
                          ) : (
                              <p className="text-gray-500">No projects added.</p>
                          )}
                        </div>
                      </div>


                      {/* Update Button */}
                      <button
                          style={{backgroundColor: '#0C21C1', borderColor: '#0C21C1'}}
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
                      custom={direction}
                      initial={{x: direction === 1 ? '100%' : '-100%'}}
                      animate={{x: 0}}
                      exit={{x: direction === 1 ? '-100%' : '100%'}}
                      transition={{type: 'tween', ease: 'easeInOut', duration: 0.4}}
                  >
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xl font-semibold text-black mb-3">Profile Details</h3>
                        <button onClick={() => setShowForm(false)} className="bg-black text-white px-4 py-2 rounded">✕
                        </button>
                      </div>
                      <div className="space-y-6">

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
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="w-full border border-gray-300 p-3 rounded-md"
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
                            value={profileData.profileDetails?.nationality || ''}
                            onChange={(e) => handleProfileFieldChange(['profileDetails', 'nationality'], e.target.value)}
                            className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none mb-0"
                        >
                          <option value="" disabled>
                            Nationality
                          </option>
                          {nationality.map((type, index) => (
                              <option key={index} value={type}>
                                {type
                                    .replaceAll("_", " ")
                                    .toLowerCase()
                                    .replace(/\b\w/g, c => c.toUpperCase())
                                }
                              </option>
                          ))}
                        </select>

                        {/* Gender */}
                        <select
                            value={profileData.profileDetails?.gender || ''}
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

                        {profileData.profileDetails?.gender === "MALE" && (
                            <select
                                value={profileData.profileDetails?.militaryStatus || ''}
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
                              <option value="NOT_REQUIRED">Not Required</option>

                            </select>

                        )}


                        {/* Military Deferment Date (if DEFERRED) */}
                        {profileData.profileDetails?.militaryStatus === "DEFERRED" && (
                            <div className="relative w-full flex items-center space-x-4 mb-0">
                              <div className="flex-1 mb-0">
                                <div className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                                  <label htmlFor="militaryDefermentDate"
                                         className="text-sm font-semibold text-gray-500">
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
                            value={profileData.profileDetails?.disabilityStatus || ''}
                            onChange={(e) => handleProfileFieldChange(['profileDetails', 'disabilityStatus'], e.target.value)}
                            className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none mb-0"
                        >
                          <option value="" disabled>
                            Disability Status
                          </option>
                          <option value="NONE">None</option>
                          <option value="VISUAL">Visual</option>
                          <option value="HEARING">Hearing</option>
                          <option value="PHYSICAL">Physical</option>
                          <option value="COGNITIVE">Cognitive</option>
                          <option value="OTHER">Other</option>
                        </select>

                        {/* Marital Status */}
                        <select
                            value={profileData.profileDetails?.maritalStatus || ''}
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
                                className="bg-black text-white px-4 py-2 rounded"
                            >
                              Next Step
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}


              {/* Step 2: Social Links Section */}
              {currentStep === 2 && showForm && (
                  <motion.div
                      key={currentStep}
                      custom={direction}
                      initial={{x: direction === 1 ? '100%' : '-100%'}}
                      animate={{x: 0}}
                      exit={{x: direction === 1 ? '-100%' : '100%'}}
                      transition={{type: 'tween', ease: 'easeInOut', duration: 0.4}}
                  >
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="space-y-6">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-xl font-semibold text-black mb-3">Social Links</h3>
                          <button onClick={() => setShowForm(false)}
                                  className="bg-black text-white px-4 py-2 rounded">✕
                          </button>
                        </div>

                        <input
                            type="text"
                            placeholder="GitHub URL"
                            value={profileData.socialLinks?.githubUrl}
                            onChange={(e) => handleProfileFieldChange(['socialLinks', 'githubUrl'], e.target.value)}
                            className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                        />

                        <input
                            type="text"
                            placeholder="LinkedIn URL"
                            value={profileData.socialLinks?.linkedinUrl}
                            onChange={(e) => handleProfileFieldChange(['socialLinks', 'linkedinUrl'], e.target.value)}
                            className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                        />

                        <input
                            type="text"
                            placeholder="Website URL"
                            value={profileData.socialLinks?.websiteUrl}
                            onChange={(e) => handleProfileFieldChange(['socialLinks', 'websiteUrl'], e.target.value)}
                            className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                        />

                        <input
                            type="text"
                            placeholder="Blog URL"
                            value={profileData.socialLinks?.blogUrl}
                            onChange={(e) => handleProfileFieldChange(['socialLinks', 'blogUrl'], e.target.value)}
                            className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                        />

                        <input
                            type="text"
                            placeholder="Other Links URL"
                            value={profileData.socialLinks?.otherLinksUrl}
                            onChange={(e) => handleProfileFieldChange(['socialLinks', 'otherLinksUrl'], e.target.value)}
                            className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                        />

                        <textarea
                            placeholder="Other Links Description"
                            value={profileData.socialLinks?.otherLinksDescription}
                            onChange={(e) => handleProfileFieldChange(['socialLinks', 'otherLinksDescription'], e.target.value)}
                            className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                        />


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
                      initial={{x: direction === 1 ? '100%' : '-100%', opacity: 0}}
                      animate={{x: 0, opacity: 1}}
                      exit={{x: direction === 1 ? '-100%' : '100%', opacity: 0}}
                      transition={{type: 'tween', ease: 'easeInOut', duration: 0.4}}
                  >
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="space-y-6">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-xl font-semibold text-black mb-3">Contact Information</h3>
                          <button onClick={() => setShowForm(false)}
                                  className="bg-black text-white px-4 py-2 rounded">✕
                          </button>
                        </div>

                        {/* Phone Number */}
                        <input
                            type="text"
                            placeholder="Phone Number"
                            value={profileData.contactInformation?.phoneNumber}
                            onChange={(e) => handleProfileFieldChange(['contactInformation', 'phoneNumber'], e.target.value)}
                            className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none "  // margin-bottom ekledik
                        />

                        {/* Country */}
                        <select
                            value={profileData.contactInformation?.country || ""}
                            onChange={(e) => {
                              const countryId = e.target.value;
                              setSelectedCountryId(countryId);
                              handleProfileFieldChange(["contactInformation", "country"], countryId); // backend'e göndereceğimiz id
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
                            value={profileData.contactInformation?.city || ""}
                            onChange={(e) => handleProfileFieldChange(["contactInformation", "city"], e.target.value)}
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


              {/* Step 4: Job Preferences Section */}
              {currentStep === 4 && showForm &&(
                  <motion.div
                      key={currentStep}
                      custom={direction} // ileri veya geri
                      initial={{x: direction === 1 ? '100%' : '-100%', opacity: 0}}
                      animate={{x: 0, opacity: 1}}
                      exit={{x: direction === 1 ? '-100%' : '100%', opacity: 0}}
                      transition={{type: 'tween', ease: 'easeInOut', duration: 0.4}}
                  >
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xl font-semibold text-black mb-3">Job Preferences</h3>
                        <button onClick={() => setShowForm(false)}
                                className="bg-black text-white px-4 py-2 rounded">✕
                        </button>
                      </div>
                      <div className="space-y-6">
                        <div>
                          <select
                              multiple
                              value={profileData.jobPreferences?.preferredPositions.map(pos => pos.positionType)}
                              onChange={handlePositionSelectChange}
                              className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none mt-3 font-size:14px"
                          >
                            <option value="" disabled>Preferred Positions</option>
                            {positionTypes.map((type, index) => (
                                <option key={index} value={type}>
                                  {type
                                      .replaceAll("_", " ")
                                      .toLowerCase()
                                      .replace(/\b\w/g, c => c.toUpperCase())
                                  }
                                </option>
                            ))}
                          </select>

                          {profileData.jobPreferences?.preferredPositions.some(pos => pos.positionType === "OTHER") && (
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
                            value={profileData.jobPreferences?.preferredWorkType || ''}
                            onChange={(e) => handleProfileFieldChange(['jobPreferences', 'preferredWorkType'], e.target.value)}
                            className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                        >
                          <option value="" disabled>Preferred Work Type</option>
                          <option value="REMOTE">Remote</option>
                          <option value="HYBRID">Hybrid</option>
                          <option value="ON_SITE">On-Site</option>
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
                                value={profileData.jobPreferences?.minWorkHour}
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
                                value={profileData.jobPreferences?.maxWorkHour}
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
                                checked={profileData.jobPreferences?.canTravel}
                                onChange={(e) => handleProfileFieldChange(['jobPreferences', 'canTravel'], e.target.checked)}
                                className="p-3"
                            />
                            <span className="text-sm ">&nbsp; Can Travel?</span> {/* ml-2 yerine ml-4 */}
                          </div>
                        </div>

                        {/* Expected Salary */}
                        <input
                            type="text"
                            value={profileData.jobPreferences?.expectedSalary}
                            onChange={(e) => handleProfileFieldChange(['jobPreferences', 'expectedSalary'], e.target.value)}
                            placeholder="Expected Salary"
                            className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                        />

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
              {currentStep === 5 && showForm &&(
                  <motion.div
                      key={currentStep}
                      custom={direction} // ileri veya geri
                      initial={{x: direction === 1 ? '100%' : '-100%', opacity: 0}}
                      animate={{x: 0, opacity: 1}}
                      exit={{x: direction === 1 ? '-100%' : '100%', opacity: 0}}
                      transition={{type: 'tween', ease: 'easeInOut', duration: 0.4}}
                  >
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xl font-semibold text-black mb-3">References</h3>
                        <button onClick={() => setShowForm(false)}
                                className="bg-black text-white px-4 py-2 rounded">✕
                        </button>
                      </div>
                      <div className="space-y-6">

                        {/* List of References */}
                        {profileData.references?.map((reference, index) => (
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
                                      type="number"
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
                                    className="bg-black text-white px-4 py-2 rounded "
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
                                className="bg-black text-white px-4 py-2 rounded"
                            >
                              Add Reference
                            </button>

                            {/* Next Step Button */}
                          </div>
                        </div>
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
              {currentStep === 6 && showForm &&(
                  <motion.div
                      key={currentStep}
                      custom={direction} // ileri veya geri
                      initial={{x: direction === 1 ? '100%' : '-100%', opacity: 0}}
                      animate={{x: 0, opacity: 1}}
                      exit={{x: direction === 1 ? '-100%' : '100%', opacity: 0}}
                      transition={{type: 'tween', ease: 'easeInOut', duration: 0.4}}
                  >
                    <div className="bg-gray-50 p-4 rounded-md">

                      <div className="flex justify-between items-center mb-3">
                      <h3 className="text-xl font-semibold text-black mb-3">Language Skills</h3>
                        <button onClick={() => setShowForm(false)}
                                className="bg-black text-white px-4 py-2 rounded">✕
                        </button>
                      </div>
                      <div className="space-y-6">

                        {/* List of Language Skills */}
                        {profileData.languageProficiency?.map((languageProficiency, index) => (
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
                                      value={languageProficiency.readingLevel || ''}
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
                                      value={languageProficiency.writingLevel || ''}
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
                                      value={languageProficiency.speakingLevel || ''}
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
                                      value={languageProficiency.listeningLevel || ''}
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
                                    className="bg-black text-white px-4 py-2 rounded "
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
                              className="bg-black text-white px-4 py-2 rounded"
                          >
                            Add Language Skill
                          </button>

                        </div>
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

              {currentStep === 7 && showForm &&(
                  <motion.div
                      key={currentStep}
                      custom={direction} // ileri veya geri
                      initial={{x: direction === 1 ? '100%' : '-100%', opacity: 0}}
                      animate={{x: 0, opacity: 1}}
                      exit={{x: direction === 1 ? '-100%' : '100%', opacity: 0}}
                      transition={{type: 'tween', ease: 'easeInOut', duration: 0.4}}
                  >
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xl font-semibold text-black mb-3">Hobbies</h3>
                        <button onClick={() => setShowForm(false)}
                                className="bg-black text-white px-4 py-2 rounded">✕
                        </button>
                      </div>
                      <div className="space-y-6">

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
                                    className="bg-black text-white px-4 py-2 rounded "
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
                              className="bg-black text-white px-4 py-2 rounded"
                          >
                            Add Hobby
                          </button>


                        </div>
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
              {/* Step 8: Education Section */}

              {currentStep === 8 && showForm &&(
                  <motion.div
                      key={currentStep}
                      custom={direction} // ileri veya geri
                      initial={{x: direction === 1 ? '100%' : '-100%', opacity: 0}}
                      animate={{x: 0, opacity: 1}}
                      exit={{x: direction === 1 ? '-100%' : '100%', opacity: 0}}
                      transition={{type: 'tween', ease: 'easeInOut', duration: 0.4}}
                  >
                    <div className="bg-gray-50 p-4 rounded-md">

                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xl font-semibold text-black mb-3">Education</h3>
                        <button onClick={() => setShowForm(false)}
                                className="bg-black text-white px-4 py-2 rounded">✕
                        </button>
                      </div>
                      <div className="space-y-6">

                        {/* Degree Type */}
                        <select
                            value={profileData.education?.degreeType || ''}
                            onChange={(e) => {
                              const selected = e.target.value;
                              handleProfileFieldChange(['education', 'degreeType'], selected);
                              handleProfileFieldChange(['education', 'isDoubleMajor'], selected === 'DOUBLE_MAJOR');
                              handleProfileFieldChange(['education', 'isMinor'], selected === 'MINOR');

                            }}
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
                        {profileData.education?.degreeType === 'ASSOCIATE' && (
                            <div className="space-y-4">


                              {/* Üniversite seçimi */}
                              <select
                                  value={profileData.education.associateDepartment?.university?.id || ''}
                                  onChange={handleUniversityChange('associateDepartment')}
                                  className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                              >
                                <option value="">Select University</option>
                                {universities.map((uni) => (
                                    <option key={uni.id} value={uni.id}>
                                      {uni.name}
                                    </option>
                                ))}
                              </select>


                              {/* Departman seçimi */}
                              <select
                                  value={profileData.education.associateDepartment?.name || ''}
                                  onChange={handleDepartmentChange('associateDepartment')}
                                  disabled={!departments.length}
                                  className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                              >
                                <option value="">Select Department</option>
                                {departments.map((dep) => (
                                    <option key={dep.id} value={dep.name}>
                                      {dep.name}
                                    </option>
                                ))}
                              </select>


                              <input
                                  type="text"
                                  value={profileData.education.associateDepartment?.university?.city?.name || ''}
                                  readOnly
                                  placeholder="City Name"
                                  className="w-full border border-gray-300 p-3 rounded-md cursor-not-allowed bg-white text-black"
                              />


                              {/* Start Date */}
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

                              {/* End Date */}
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

                              {/* Is Ongoing */}
                              <div className="w-full border border-gray-300 p-3 rounded-md bg-white text-black mb-3">
                                <div className="flex-1 mb-0">
                                  <input
                                      type="checkbox"
                                      checked={profileData.education.associateIsOngoing}
                                      onChange={(e) => handleProfileFieldChange(['education', 'associateIsOngoing'], e.target.checked)}
                                      className="p-3"
                                  />
                                  <span className="text-sm ml-2"> Is Ongoing?</span>
                                </div>
                              </div>

                            </div>
                        )}

                        {/* Bachelor Degree Section */}
                        {profileData.education?.degreeType === 'BACHELOR' && (
                            <div className="space-y-4">

                              {/* Üniversite seçimi */}
                              <select
                                  value={profileData.education.bachelorDepartment?.university?.id || ''}
                                  onChange={handleUniversityChange('bachelorDepartment')}
                                  className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                              >
                                <option value="">Select University</option>
                                {universities.map((uni) => (
                                    <option key={uni.id} value={uni.id}>
                                      {uni.name}
                                    </option>
                                ))}
                              </select>


                              {/* Departman seçimi */}
                              <select
                                  value={profileData.education.bachelorDepartment?.name || ''}
                                  onChange={handleDepartmentChange('bachelorDepartment')}
                                  disabled={!departments.length}
                                  className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                              >
                                <option value="">Select Department</option>
                                {departments.map((dep) => (
                                    <option key={dep.id} value={dep.name}>
                                      {dep.name}
                                    </option>
                                ))}
                              </select>


                              <input
                                  type="text"
                                  value={profileData.education.bachelorDepartment?.university?.city?.name || ''}
                                  readOnly
                                  placeholder="City Name"
                                  className="w-full border border-gray-300 p-3 rounded-md cursor-not-allowed bg-white text-black"
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
                        {profileData.education?.degreeType === 'MASTER' && (
                            <div className="space-y-4">
                              {/* Üniversite seçimi */}
                              <select
                                  value={profileData.education.masterDepartment?.university?.id || ''}
                                  onChange={handleUniversityChange('masterDepartment')}
                                  className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                              >
                                <option value="">Select University</option>
                                {universities.map((uni) => (
                                    <option key={uni.id} value={uni.id}>
                                      {uni.name}
                                    </option>
                                ))}
                              </select>


                              {/* Departman seçimi */}
                              <select
                                  value={profileData.education.masterDepartment?.name || ''}
                                  onChange={handleDepartmentChange('masterDepartment')}
                                  disabled={!departments.length}
                                  className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                              >
                                <option value="">Select Department</option>
                                {departments.map((dep) => (
                                    <option key={dep.id} value={dep.name}>
                                      {dep.name}
                                    </option>
                                ))}
                              </select>

                              <input
                                  type="text"
                                  value={profileData.education.masterDepartment?.university?.city?.name || ''}
                                  readOnly
                                  placeholder="City Name"
                                  className="w-full border border-gray-300 p-3 rounded-md cursor-not-allowed bg-white text-black"
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
                        {profileData.education?.degreeType === 'DOCTORATE' && (
                            <div className="space-y-4">
                              {/* Üniversite seçimi */}
                              <select
                                  value={profileData.education.doctorateDepartment?.university?.id || ''}
                                  onChange={handleUniversityChange('doctorateDepartment')}
                                  className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                              >
                                <option value="">Select University</option>
                                {universities.map((uni) => (
                                    <option key={uni.id} value={uni.id}>
                                      {uni.name}
                                    </option>
                                ))}
                              </select>


                              {/* Departman seçimi */}
                              <select
                                  value={profileData.education.doctorateDepartment?.name || ''}
                                  onChange={handleDepartmentChange('doctorateDepartment')}
                                  disabled={!departments.length}
                                  className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                              >
                                <option value="">Select Department</option>
                                {departments.map((dep) => (
                                    <option key={dep.id} value={dep.name}>
                                      {dep.name}
                                    </option>
                                ))}
                              </select>

                              <input
                                  type="text"
                                  value={profileData.education.doctorateDepartment?.university?.city?.name || ''}
                                  readOnly
                                  placeholder="City Name"
                                  className="w-full border border-gray-300 p-3 rounded-md cursor-not-allowed bg-white text-black"
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
                        {profileData.education?.degreeType === 'DOUBLE_MAJOR' && (
                            <div className="space-y-4">
                              {/* Üniversite seçimi */}
                              <select
                                  value={profileData.education.doubleMajorDepartment?.university?.id || ''}
                                  onChange={handleUniversityChange('doubleMajorDepartment')}
                                  className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                              >
                                <option value="">Select University</option>
                                {universities.map((uni) => (
                                    <option key={uni.id} value={uni.id}>
                                      {uni.name}
                                    </option>
                                ))}
                              </select>


                              {/* Departman seçimi */}
                              <select
                                  value={profileData.education.doubleMajorDepartment?.name || ''}
                                  onChange={handleDepartmentChange('doubleMajorDepartment')}
                                  disabled={!departments.length}
                                  className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                              >
                                <option value="">Select Department</option>
                                {departments.map((dep) => (
                                    <option key={dep.id} value={dep.name}>
                                      {dep.name}
                                    </option>
                                ))}
                              </select>

                              <input
                                  type="text"
                                  value={profileData.education.doubleMajorDepartment?.university?.city?.name || ''}
                                  readOnly
                                  placeholder="City Name"
                                  className="w-full border border-gray-300 p-3 rounded-md cursor-not-allowed bg-white text-black"
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
                        {profileData.education?.degreeType === 'MINOR' && (
                            <div className="space-y-4">
                              {/* Minor Department */}
                              {/* Üniversite seçimi */}
                              <select
                                  value={profileData.education.minorDepartment?.university?.id || ''}
                                  onChange={handleUniversityChange('minorDepartment')}
                                  className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                              >
                                <option value="">Select University</option>
                                {universities.map((uni) => (
                                    <option key={uni.id} value={uni.id}>
                                      {uni.name}
                                    </option>
                                ))}
                              </select>


                              {/* Departman seçimi */}
                              <select
                                  value={profileData.education.minorDepartment?.name || ''}
                                  onChange={handleDepartmentChange('minorDepartment')}
                                  disabled={!departments.length}
                                  className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                              >
                                <option value="">Select Department</option>
                                {departments.map((dep) => (
                                    <option key={dep.id} value={dep.name}>
                                      {dep.name}
                                    </option>
                                ))}
                              </select>

                              <input
                                  type="text"
                                  value={profileData.education.minorDepartment?.university?.city?.name || ''}
                                  readOnly
                                  placeholder="City Name"
                                  className="w-full border border-gray-300 p-3 rounded-md cursor-not-allowed bg-white text-black"
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

                          <div style={{textAlign: 'right'}}>
                            <div className="flex justify-between mt-3">
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
              {currentStep === 9 && showForm && (
                  <motion.div
                      key={currentStep}
                      custom={direction} // ileri veya geri
                      initial={{x: direction === 1 ? '100%' : '-100%', opacity: 0}}
                      animate={{x: 0, opacity: 1}}
                      exit={{x: direction === 1 ? '-100%' : '100%', opacity: 0}}
                      transition={{type: 'tween', ease: 'easeInOut', duration: 0.4}}
                  >
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xl font-semibold text-black mb-3">Certifications</h3>
                        <button onClick={() => setShowForm(false)}
                                className="bg-black text-white px-4 py-2 rounded">✕
                        </button>
                      </div>
                      <div className="space-y-6">

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
                                    <label htmlFor="certificateValidityDate"
                                           className="text-sm font-semibold text-gray-500">
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
                                    className="bg-black text-white px-4 py-2 rounded "
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
                              className="bg-black text-white px-4 py-2 rounded"
                          >
                            Add Certification
                          </button>


                        </div>
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

              {currentStep === 10 && showForm &&(
                  <motion.div
                      key={currentStep}
                      custom={direction} // ileri veya geri
                      initial={{x: direction === 1 ? '100%' : '-100%', opacity: 0}}
                      animate={{x: 0, opacity: 1}}
                      exit={{x: direction === 1 ? '-100%' : '100%', opacity: 0}}
                      transition={{type: 'tween', ease: 'easeInOut', duration: 0.4}}
                  >
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xl font-semibold text-black mb-3">Work Experience</h3>
                        <button onClick={() => setShowForm(false)}
                                className="bg-black text-white px-4 py-2 rounded">✕
                        </button>
                      </div>
                      <div className="space-y-6">

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
                              <div className="relative w-full flex items-center space-x-4">
                                <div className="flex-1 mb-0">
                                  <input
                                      type="text"
                                      value={work.industry}
                                      onChange={(e) => handleProfileFieldChange(['workExperiences', index, 'industry'], e.target.value)}
                                      placeholder="Industry"
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
                                      value={work.employmentType || ''}
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
                              <div className="flex-1 mb-0">
            <textarea
                value={work.jobDescription}
                onChange={(e) => handleProfileFieldChange(['workExperiences', index, 'jobDescription'], e.target.value)}
                placeholder="Job Description"
                className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
            />
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
                                          handleProfileFieldChange(['workExperiences', index, 'isGoing'], e.target.checked)
                                      }

                                      className="p-3"
                                  />
                                  <span className="text-sm ml-4">&nbsp;Is Going?</span>
                                </div>
                              </div>

                              {/* Remove Button */}
                              <div className="flex justify-end mb-3">
                                <button
                                    onClick={() => removeJobExperience(index)}
                                    className="bg-black text-white px-4 py-2 rounded"
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
                              className="bg-black text-white px-4 py-2 rounded"
                          >
                            Add Work Experience
                          </button>

                        </div>
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

              {currentStep === 11 && showForm &&(
                  <motion.div
                      key={currentStep}
                      custom={direction} // ileri veya geri
                      initial={{x: direction === 1 ? '100%' : '-100%', opacity: 0}}
                      animate={{x: 0, opacity: 1}}
                      exit={{x: direction === 1 ? '-100%' : '100%', opacity: 0}}
                      transition={{type: 'tween', ease: 'easeInOut', duration: 0.4}}
                  >
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xl font-semibold text-black mb-3">Exams and Achievements</h3>
                        <button onClick={() => setShowForm(false)}
                                className="bg-black text-white px-4 py-2 rounded">✕
                        </button>
                      </div>
                      <div className="space-y-6">

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
                                    className="bg-black text-white px-4 py-2 rounded "
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                        ))}

                        <br/>

                        <div className="flex justify-between mt-6">
                          {/* Add Exam Button */}
                          <button
                              onClick={addExam}
                              className="bg-black text-white px-4 py-2 rounded"
                          >
                            Add Exam
                          </button>


                        </div>
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
              {currentStep === 12 && showForm &&(
                  <motion.div
                      key={currentStep}
                      custom={direction} // ileri veya geri
                      initial={{x: direction === 1 ? '100%' : '-100%', opacity: 0}}
                      animate={{x: 0, opacity: 1}}
                      exit={{x: direction === 1 ? '-100%' : '100%', opacity: 0}}
                      transition={{type: 'tween', ease: 'easeInOut', duration: 0.4}}
                  >
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xl font-semibold text-black mb-3">Uploaded Documents</h3>
                        <button onClick={() => setShowForm(false)}
                                className="bg-black text-white px-4 py-2 rounded">✕
                        </button>
                      </div>
                      <div className="space-y-6">

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
                                  value={document.documentCategory || ''}
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
                                  <span className="text-sm ">&nbsp; Is private?</span> {/* ml-2 yerine ml-4 */}
                                </div>
                              </div>

                              {/* Remove Button */}
                              <div className="text-right mb-3">
                                <button
                                    onClick={() => removeDocument(index)}
                                    className="bg-black text-white px-4 py-2 rounded"
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
                              className="bg-black text-white px-4 py-2 rounded"
                          >
                            Add Document
                          </button>

                        </div>
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
              {currentStep === 13 && showForm &&(
                  <motion.div
                      key={currentStep}
                      custom={direction} // ileri veya geri
                      initial={{x: direction === 1 ? '100%' : '-100%', opacity: 0}}
                      animate={{x: 0, opacity: 1}}
                      exit={{x: direction === 1 ? '-100%' : '100%', opacity: 0}}
                      transition={{type: 'tween', ease: 'easeInOut', duration: 0.4}}
                  >
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xl font-semibold text-black mb-3">Skills</h3>
                        <button onClick={() => setShowForm(false)}
                                className="bg-black text-white px-4 py-2 rounded">✕
                        </button>
                      </div>
                      <div className="space-y-6">

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
                                  value={skill.skillLevel || ''}
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
                                    className="bg-black text-white px-4 py-2 rounded"
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
                              className="bg-black text-white px-4 py-2 rounded"
                          >
                            Add Skill
                          </button>

                        </div>
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
              {currentStep === 14 && showForm &&(
                  <motion.div
                      key={currentStep}
                      custom={direction} // ileri veya geri
                      initial={{x: direction === 1 ? '100%' : '-100%', opacity: 0}}
                      animate={{x: 0, opacity: 1}}
                      exit={{x: direction === 1 ? '-100%' : '100%', opacity: 0}}
                      transition={{type: 'tween', ease: 'easeInOut', duration: 0.4}}
                  >
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xl font-semibold text-black mb-3">Projects</h3>
                        <button onClick={() => setShowForm(false)}
                                className="bg-black text-white px-4 py-2 rounded">✕
                        </button>
                      </div>
                      <div className="space-y-6">

                        {profileData.projects?.map((project, index) => (
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
                                      className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                  />
                                </div>
                              </div>


                              {/* Project End Date */}
                              <div className="relative w-full flex items-center space-x-4">
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
                                  value={project.projectStatus || ''}
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
                                  <span className="text-sm ">&nbsp; Is private?</span> {/* ml-2 yerine ml-4 */}
                                </div>
                              </div>
                              {/* Remove Project Button */}
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

                        {/* Add Project + Next */}
                        <div className="flex justify-between mt-6">
                          <button
                              onClick={addProject}
                              className="bg-black text-white px-4 py-2 rounded"
                          >
                            Add Project
                          </button>

                        </div>
                        <br/>
                        <div style={{textAlign: 'right'}}>
                          <div className="flex justify-between">
                            <button onClick={handleBackStep}
                                    className="bg-black text-white px-4 py-2 rounded">Back
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
