import React, {useEffect, useState} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BuildingOffice2Icon,
  GlobeAltIcon,
  PhoneIcon,
  EnvelopeIcon,
  BriefcaseIcon,
  ClipboardDocumentCheckIcon, IdentificationIcon
} from '@heroicons/react/24/outline';
import axios from "axios";
import Toast from './Toast';

export default function CreateJobForm() {
  const [step, setStep] = useState(1);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountryId, setSelectedCountryId] = useState(null);
  const [positionTypes, setPositionTypes] = useState([]);

  const [formData, setFormData] = useState({
    company: {
      id:'',
      companyName: '',
      email: '',
      phoneNumber:'',
      websiteUrl:'',
      vision:'',
      mission:'',
      establishedDate:'',
      industry: '',
      employeeCount: '',
      projects: [{
        id:'',
        projectName: '',
        projectDescription: '',
        projectStartDate: '',
        projectEndDate: '',
        projectStatus: '',
        isPrivate: false,
      }
      ],
    },
    jobDescription: '',
    minSalary:'',
    maxSalary:'',
    lastDate:'',
    travelRest: true,
    license: true,
    jobCondition:{
      workType:null,
      employmentType:null,
      country: null,
      city: null,
      minWorkHours: '',
      maxWorkHours: '',
    },
    jobQualification:{
      degreeType: null,
      jobExperience:null,
      experienceYears:'',
      militaryStatus:null,
      technicalSkills: [{positionName:'', skillLevel:null, description:''}],
      socialSkills:[{positionName:'', skillLevel:null, description:''}],
      languageProficiencies:[{language:'',readingLevel:null,writingLevel:null, speakingLevel:null,listeningLevel:null}]
    },
    benefits:[ {
      benefitType: null,
      description: ''
    }],
    jobPosition: {
      jobPositions: [{ positionType: null , customJobPosition: { positionName: '' } }],
    },
  });

  const [direction, setDirection] = useState(1);  // 1: ileri, -1: geri

  const [showForm, setShowForm] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const selectedCountry = countries.find(c => c.id === Number(formData?.jobCondition?.country));
  const selectedCity = cities.find(c => c.id === Number(formData?.jobCondition?.city));

  useEffect(() => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");

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
        .then((data) => {
          setFormData((prevData) => ({
            ...prevData,
            company: {
              ...prevData.company,
              ...data.company
            }
          }));
        })
        .catch((err) => console.error("No Profile Data Found", err));
  }, []);

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
  const [message, setMessage] = useState(null);
  const [showToast, setShowToast] = useState(false);

  const jobPositions = Array.isArray(formData.jobPosition?.jobPositions)
      ? formData.jobPosition.jobPositions
      : formData.jobPosition.jobPositions
          ? [formData.jobPosition.jobPositions]
          : [];

  const jobPositionTypes = jobPositions.map(jp => jp.positionType);
  const customJobPositionNames = jobPositions.map(
      jp => jp.customJobPosition?.positionName || ''
  );
  const handleCloseToast = () => {
    setShowToast(false);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // DTO'yu burada oluştur
    const dto = {
      companyId: formData.company.id,
      description: formData.jobDescription,
      minSalary: Number(formData.minSalary),
      maxSalary: Number(formData.maxSalary),
      lastDate: formData.lastDate,
      travelRest: formData.travelRest,
      license: formData.license,

      jobConditionWorkType: formData.jobCondition.workType,
      jobConditionEmploymentType: formData.jobCondition.employmentType,
      jobConditionCountry: formData.jobCondition.country,
      jobConditionCity: formData.jobCondition.city,
      jobConditionMinWorkHours: Number(formData.jobCondition.minWorkHours),
      jobConditionMaxWorkHours: Number(formData.jobCondition.maxWorkHours),

      jobQualificationDegreeType: formData.jobQualification.degreeType,
      jobQualificationJobExperience: formData.jobQualification.jobExperience,
      jobQualificationExperienceYears: Number(formData.jobQualification.experienceYears),
      jobQualificationMilitaryStatus: formData.jobQualification.militaryStatus,

      technicalSkillPositionNames: formData.jobQualification.technicalSkills.map(s => s.positionName),
      technicalSkillLevels: formData.jobQualification.technicalSkills.map(s => s.skillLevel),
      technicalSkillDescriptions: formData.jobQualification.technicalSkills.map(s => s.description),

      socialSkillPositionNames: formData.jobQualification.socialSkills.map(s => s.positionName),
      socialSkillLevels: formData.jobQualification.socialSkills.map(s => s.skillLevel),
      socialSkillDescriptions: formData.jobQualification.socialSkills.map(s => s.description),

      languageProficiencyLanguages: formData.jobQualification.languageProficiencies.map(l => l.language),
      languageProficiencyReadingLevels: formData.jobQualification.languageProficiencies.map(l => l.readingLevel),
      languageProficiencyWritingLevels: formData.jobQualification.languageProficiencies.map(l => l.writingLevel),
      languageProficiencySpeakingLevels: formData.jobQualification.languageProficiencies.map(l => l.speakingLevel),
      languageProficiencyListeningLevels: formData.jobQualification.languageProficiencies.map(l => l.listeningLevel),

      benefitTypes: formData.benefits.map(b => b.benefitType),
      benefitDescriptions: formData.benefits.map(b => b.description),

      jobPositionTypes: jobPositionTypes,
      customJobPositionNames: customJobPositionNames,
    };

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("Kullanıcı giriş yapmamış");
        return;
      }

      const response = await fetch('http://localhost:9090/api/job-adv/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dto)  // burada dto gönderiyoruz

      });

      if (!response.ok) {
        setMessage('Job Advertisement could not be created. Please check the form.');
        setShowToast(true);

      }

      const data = await response.text();
      console.log('Job Advertisement başarıyla oluşturuldu:', data);
      setMessage(data);
      setShowToast(true);

    } catch (error) {
      console.error('Hata:', error);
    }
  };


  const handleNext = () => {
    setDirection(1);        // Yönü ileri ayarla
    setStep((prev) => prev + 1);
  };
  
  const handleBack = () => {
    setDirection(-1);       // Yönü geri ayarla
    setStep((prev) => prev - 1);
  };


  const handleChange = (path, value) => {
    setFormData(prev => {
      // Kopya
      const updated = JSON.parse(JSON.stringify(prev));

      // target gösterici
      let target = updated;

      // Dizinin sonundan 1 öncekine kadar ilerle
      for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        // Eğer path'teki key yoksa obje veya array oluştur
        if (target[key] === undefined) {
          // Eğer sonraki key number ise array oluştur, değilse object
          if (typeof path[i + 1] === 'number') {
            target[key] = [];
          } else {
            target[key] = {};
          }
        }
        target = target[key];
      }

      // Son anahtara değer ata
      target[path[path.length - 1]] = value;

      return updated;
    });
  };


  const addBenefits= () => {
    setFormData({
      ...formData,
      benefits: [
        ...formData. benefits,
        {
          benefitType: null,
          description: '',

        }
      ]
    });
  };

  const removeBenefits = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      benefits: prevData.benefits.filter((_, i) => i !== index),
    }));
  };

  const addLanguageSkill = () => {
    setFormData((prevData) => ({
      ...prevData,
      jobQualification: {
        ...prevData.jobQualification,
        languageProficiencies: [
          ...(prevData.jobQualification.languageProficiencies || []),
          {
            language: '',
            readingLevel: null,
            writingLevel: null,
            speakingLevel: null,
            listeningLevel: null
          }
        ]
      }
    }));
  };

  const removeLanguageSkill = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      jobQualification: {
        ...prevData.jobQualification,
        languageProficiencies: prevData.jobQualification.languageProficiencies.filter((_, i) => i !== index)
      }
    }));
  };

  const removeTechnicalSkills = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      jobQualification: {
        ...prevData.jobQualification,
        technicalSkills: prevData.jobQualification.technicalSkills.filter((_, i) => i !== index),
      }
    }));
  };


  const addTechnicalSkills = () => {
    setFormData(prev => ({
      ...prev,
      jobQualification: {
        ...prev.jobQualification,
        technicalSkills: [
          ...prev.jobQualification.technicalSkills,
          {
            positionName: '',
            skillLevel: null,
            description: ''
          }
        ]
      }
    }));

  };

  const removeSocialSkills = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      jobQualification: {
        ...prevData.jobQualification,
        socialSkills: prevData.jobQualification.socialSkills.filter((_, i) => i !== index),
      }
    }));
  };

  const addSocialSkills = () => {
    setFormData(prev => ({
      ...prev,
      jobQualification: {
        ...prev.jobQualification,
        socialSkills: [
          ...prev.jobQualification.socialSkills,
          {
            positionName: '',
            skillLevel: null,
            description: ''
          }
        ]
      }
    }));

  };

  const handleCloseForm = () => {
    setDirection(1);
    setStep(1);   // Step'i başa alıyoruz
    setShowForm(false);  // Formu kapatıyoruz
    setFormKey((prev) => prev + 1);  // Formu resetlemek için key değiştiriyoruz

  };

  return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="w-full px-4 py-10">
          <div className="max-w-[1100px] mx-auto bg-gray-100 rounded-xl p-10 space-y-10 shadow-md">
            <div className="bg-white shadow rounded-md overflow-hidden">
              <div className="p-6">
                {!showForm && (

                    <div
                        style={{borderRadius: "15px", padding: "10px"}}
                        className="flex max-w-6xl mx-auto rounded-lg overflow-hidden shadow-lg bg-white">
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

                          <h2 className="text-2xl font-bold"> {formData.company?.companyName || ''}</h2>
                          {/* Bilgi listesi */}
                          <div className="space-y-2 text-xl w-full ">
                            <p><strong>Email:</strong> {formData.company?.email || '-'}</p>
                            <p><strong>Phone Number:</strong> {formData.company?.phoneNumber || '-'}</p>
                            <p><strong>Website Url:</strong> {formData.company?.websiteUrl || '-'}</p>
                            <p><strong>Vision:</strong> {formData.company?.vision || '-'}</p>
                            <p><strong>Mission:</strong> {formData.company?.mission || '-'}</p>
                            <p><strong>Established Date:</strong> {formData.company?.establishedDate || '-'}</p>
                            <p><strong>Industry:</strong> {formData.company?.industry || '-'}</p>
                            <p><strong>Employee Count:</strong> {formData.company?.employeeCount || '-'}</p>
                            <p><strong>Established Date:</strong> {formData.company?.establishedDate || '-'}</p>
                            <p><strong>Projects:</strong></p>
                            {formData.company?.projects && formData.company.projects.filter(p => !p.isPrivate).length > 0 ? (
                                formData.company.projects
                                    .filter(proj => !proj.isPrivate)
                                    .map((proj, idx) => (
                                        <div key={idx} className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                                          <p><strong>Project Name:</strong> {proj.projectName || '-'}</p>
                                          <p><strong>Description:</strong> {proj.projectDescription || '-'}</p>
                                          <p><strong>Status:</strong> {proj.projectStatus || '-'}</p>
                                          <p><strong>Start Date:</strong> {proj.projectStartDate || '-'}</p>
                                          <p><strong>End Date:</strong> {proj.projectEndDate || '-'}</p>
                                        </div>
                                    ))
                            ) : (
                                <p className="text-gray-500">No public projects added.</p>
                            )}

                          </div>
                        </div>
                        <div className="text-center mt-3">
                          <button
                              style={{backgroundColor: '#0C21C1', borderColor: '#0C21C2'}}
                              onClick={handleSubmit}
                              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                          Create Job Advertisement
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
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><BriefcaseIcon
                                className="text-blue-600" style={{width: '20px', height: '20px'}}/> Job Advertisement
                            </h3>
                            <div className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                              <p className="text-sm">
                                <span
                                    className="font-medium text-gray-700"> <strong> Job Description: </strong> </span>{' '}<span
                                  className="text-gray-600">{formData?.jobDescription || '-'}</span>
                              </p>

                              <p className="text-sm">
                              <span className="font-medium text-gray-700"> <strong>Job Position: </strong> </span>{' '}<span className="text-gray-600">{
                               formData.jobPosition?.jobPositions?.[0]?.positionType === 'OTHER'
                                   ? formData.jobPosition?.jobPositions?.[0]?.customJobPosition?.positionName || '-'
                                   : formData.jobPosition?.jobPositions?.[0]?.positionType
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
                                    className="text-gray-600">{formData?.minSalary } - {formData?.maxSalary }</span>
                              </p>
                              <p className="text-sm">
                                <span className="font-medium text-gray-700"> <strong> Last Date: </strong> </span>{' '}
                                <span
                                    className="text-gray-600">{formData?.lastDate || '-'}</span>
                              </p>

                              <p className="text-sm">
                                <span className="font-medium text-gray-700"><strong> Travel Rest: </strong> </span>{' '}
                                <span
                                    className="text-gray-600">{formData.travelRest ? 'Yes' : 'No' }</span>
                              </p>
                              <p className="text-sm">
                                <span className="font-medium text-gray-700"><strong>License: </strong></span>{' '}
                                <span
                                    className="text-gray-600">{formData.license ? 'Yes' : 'No'}</span>
                              </p>

                            </div>
                          </div>


                          <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                              <ClipboardDocumentCheckIcon className="text-blue-600"
                                                          style={{width: '20px', height: '20px'}}/>Job Conditions</h3>
                            <div
                                className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                              <p className="text-sm">
                           <span
                               className="font-medium text-gray-700"><strong>Work Type: </strong></span>{' '}
                                <span
                                    className="text-gray-600">{
                                    formData.jobCondition?.workType
                                        ?.replaceAll("_", " ")
                                        ?.toLowerCase()
                                        ?.replace(/\b\w/g, c => c.toUpperCase()) || '-'}</span>
                              </p>
                              <p className="text-sm">
                           <span
                               className="font-medium text-gray-700"><strong>Employment Type: </strong></span>{' '}
                                <span
                                    className="text-gray-600">{formData.jobCondition?.employmentType?.replaceAll("_", " ")
                                    ?.toLowerCase()
                                    ?.replace(/\b\w/g, c => c.toUpperCase()) || '-'}</span>
                              </p>

                              <p className="text-sm">
                                <span className="font-medium text-gray-700"><strong>Country: </strong></span>{' '}
                                <span className="text-gray-600">{selectedCountry?.name || '-'}</span>
                              </p>
                              <p className="text-sm">
                                <span className="font-medium text-gray-700"><strong>City: </strong></span>{' '}
                                <span className="text-gray-600">{selectedCity?.name || '-'}</span>
                              </p>


                              <p className="text-sm">
                          <span
                              className="font-medium text-gray-700"><strong>Work Hours: </strong></span>{' '}
                                <span
                                    className="text-gray-600">{formData.jobCondition?.minWorkHours} - {formData.jobCondition?.maxWorkHours}</span>
                              </p>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                              <ClipboardDocumentCheckIcon className="text-blue-600"
                                                          style={{width: '20px', height: '20px'}}/>Job Qualification
                            </h3>
                            <div
                                className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                              <p className="text-sm">
                           <span
                               className="font-medium text-gray-700"><strong>Degree Type: </strong></span>{' '}
                                <span
                                    className="text-gray-600">{formData.jobQualification?.degreeType ?.replaceAll("_", " ")
                                    ?.toLowerCase()
                                    ?.replace(/\b\w/g, c => c.toUpperCase()) || '-'}</span>
                              </p>
                              <p className="text-sm">
                           <span
                               className="font-medium text-gray-700"><strong>Job Experience: </strong></span>{' '}
                                <span
                                    className="text-gray-600">{formData.jobQualification?.jobExperience?.replaceAll("_", " ")
                                    ?.toLowerCase()
                                    ?.replace(/\b\w/g, c => c.toUpperCase()) || '-'}</span>
                              </p>
                              <p className="text-sm">
                          <span
                              className="font-medium text-gray-700"><strong>Experience Years: </strong></span>{' '}
                                <span
                                    className="text-gray-600">{formData.jobQualification?.experienceYears || '-'}</span>
                              </p>
                              <p className="text-sm">
                          <span
                              className="font-medium text-gray-700"><strong>Military Status: </strong></span>{' '}
                                <span
                                    className="text-gray-600">{formData.jobQualification?.militaryStatus ?.replaceAll("_", " ")
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

                              {formData.benefits && formData.benefits?.length > 0 ? (
                                  formData.benefits?.map((benefit, idx) => (
                                      <div key={idx}
                                           className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                                        <p><strong>Benefit Type: </strong> {benefit.benefitType || '-'}
                                        </p>
                                        <p><strong>Description: </strong> {benefit.description || '-'}</p>
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
                                Technical Skills
                              </h3>

                              {formData.jobQualification?.technicalSkills && formData.jobQualification.technicalSkills.length > 0 ? (
                                  formData.jobQualification.technicalSkills.map((technicalSkills, idx) => (
                                      <div key={idx}
                                           className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                                        <p><strong>Position Name: </strong> {technicalSkills.positionName || '-'}
                                        </p>
                                        <p>
                                          <strong>Skill Level: </strong> {technicalSkills.skillLevel || '-'}
                                        </p>
                                        <p><strong>Description: </strong> {technicalSkills.description || '-'}</p>
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

                              {formData.jobQualification?.socialSkills && formData.jobQualification.socialSkills.length > 0 ? (
                                  formData.jobQualification.socialSkills.map((socialSkills, idx) => (
                                      <div key={idx}
                                           className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                                        <p><strong>Position Name: </strong> {socialSkills.positionName || '-'}
                                        </p>
                                        <p>
                                          <strong>Skill Level: </strong> {socialSkills.skillLevel || '-'}
                                        </p>
                                        <p><strong>Description: </strong> {socialSkills.description || '-'}</p>
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

                              {formData.jobQualification?.languageProficiencies && formData.jobQualification.languageProficiencies.length > 0 ? (
                                  formData.jobQualification.languageProficiencies.map((languageProficiency, idx) => (
                                      <div key={idx} className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                                        <p><strong>Reading Level: </strong> {languageProficiency.readingLevel || '-'}</p>
                                        <p><strong>Writing Level: </strong> {languageProficiency.writingLevel || '-'}</p>
                                        <p><strong>Speaking Level: </strong> {languageProficiency.speakingLevel || '-'}</p>
                                        <p><strong>Listening Level: </strong> {languageProficiency.listeningLevel || '-'}</p>
                                      </div>
                                  ))
                              ) : (
                                  <p className="text-gray-500">No Language added.</p>
                              )}
                            </div>


                          </div>

                          <button
                              style={{backgroundColor: '#0C21C1', borderColor: '#0C21C1'}}
                              onClick={() => setShowForm(true)}
                              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            Add Details
                          </button>

                        </div>
                      </div>


                    </div>


                )}

                <AnimatePresence mode="wait" custom={direction}>
                  {step === 1 && showForm && (
                      <motion.div
                          key={step}
                          custom={direction}
                          initial={{x: direction === 1 ? '100%' : '-100%'}}
                          animate={{x: 0}}
                          exit={{x: direction === 1 ? '-100%' : '100%'}}
                          transition={{type: 'tween', ease: 'easeInOut', duration: 0.4}}
                      >
                        <div className="bg-gray-50 p-4 rounded-md">
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="text-xl font-semibold text-black mb-3">Job Advertisement</h3>
                            <button onClick={() => setShowForm(false)}
                                    className="text-gray-500 hover:text-gray-700">✕
                            </button>
                          </div>

                          <div className="space-y-4">
                            <div className="relative w-full flex items-center space-x-4">
                                <textarea name="jobDescription"
                                          placeholder="Job Description"
                                          value={formData.jobDescription}
                                          onChange={(e) => handleChange(['jobDescription'], e.target.value)}
                                          className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"/>

                            </div>

                            <div className="relative w-full flex items-center space-x-4">
                              <div className="flex-1 mb-0">
                                <div
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                                  <label htmlFor="positionType"
                                         className="text-sm font-semibold text-gray-500">
                                    Job Position
                                  </label>
                                </div>
                              </div>
                              <div className="flex-1 mb-0">
                                <select
                                    name="jobPositions"
                                    value={formData.jobPosition?.jobPositions?.[0]?.positionType || ''}
                                    onChange={(e) => handleChange(['jobPosition','jobPositions',0,'positionType'], e.target.value)}
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                >
                                  <option value="" disabled>Select</option>
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
                              </div>
                            </div>
                            {formData.jobPosition?.jobPositions?.[0]?.positionType === 'OTHER' &&(
                                <div className="relative w-full flex items-center space-x-4">
                              <div className="flex-1 mb-0">
                                <div
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                                  <label htmlFor="employeeCount"
                                         className="text-sm font-semibold text-gray-500">
                                    Custom Job Position
                                  </label>
                                </div>
                              </div>
                              <div className="flex-1 mb-0">
                                <input
                                    type="text"
                                    name="positionName"
                                    value={formData?.jobPosition?.jobPositions?.[0]?.customJobPosition?.positionName || ''}
                                    onChange={(e) => handleChange(['jobPosition','jobPositions',0,'customJobPosition','positionName'], e.target.value)}
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                />
                              </div>
                            </div>)}


                          <div className="relative w-full flex items-center space-x-4">
                            <div className="flex-1 mb-0">
                              <div
                                  className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                                <label htmlFor="range"
                                       className="text-sm font-semibold text-gray-500">
                                  Salary Range (Optional)
                                </label>
                              </div>

                            </div>
                            <div className="flex-1 mb-0">

                              <input type="number" name="minSalary"
                                     placeholder="Min Salary"
                                     value={formData.minSalary}
                                     onChange={(e) => handleChange(['minSalary'], e.target.value)}

                                     className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"/>
                            </div>

                            <div className="flex-1 mb-0">
                              <input type="number" name="maxSalary"
                                     placeholder="Max Salary"
                                     value={formData.maxSalary}
                                     onChange={(e) => handleChange(['maxSalary'], e.target.value)}
                                     className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"/>

                            </div>
                          </div>

                          <div className="relative w-full flex items-center space-x-4">
                          <div className="flex-1 mb-0">
                                <div
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                                  <label htmlFor="startDate"
                                         className="text-sm font-semibold text-gray-500">
                                    Last Date
                                  </label>
                                </div>
                              </div>

                              <div className="flex-1 mb-0">
                                <input type="date" name="startDate" value={formData.lastDate}
                                       onChange={(e) => handleChange(['lastDate'], e.target.value)}
                                       className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"/>
                              </div>
                            </div>


                            <div className="w-full border border-gray-300 p-3 rounded-md bg-white text-black mb-3">
                              <div className="flex space-x-3 mb-0 ">
                                <div className="flex-1 mb-0">
                                  <input type="checkbox" name="travelRest" checked={formData.travelRest}
                                         onChange={(e) => handleChange(['travelRest'], e.target.checked)}
                                         className="border-gray-300"/>
                                  <span className="text-sm ">&nbsp;Travel Rest?</span>
                                </div>
                                <div className="flex-1 mb-0">
                                  <input type="checkbox" name="license" checked={formData.license}
                                         onChange={(e) => handleChange(['license'], e.target.checked)}
                                         className="border-gray-300"/>
                                  <span className="text-sm ">&nbsp;License?</span>
                                </div>

                              </div>
                            </div>


                            <div style={{textAlign: 'right'}}>
                              <div className="flex justify-end">
                                <button onClick={handleNext}
                                        className="bg-blue-600 text-grey px-4 py-2 rounded-md hover:bg-blue-700">Next
                                </button>
                              </div>
                            </div>

                          </div>
                        </div>
                      </motion.div>
                  )}
                  {step === 2 && showForm && (
                      <motion.div
                          key={step}
                          custom={direction}
                          initial={{x: direction === 1 ? '100%' : '-100%'}}
                          animate={{x: 0}}
                          exit={{x: direction === 1 ? '-100%' : '100%'}}
                          transition={{type: 'tween', ease: 'easeInOut', duration: 0.4}}
                      >
                        <div className="bg-gray-50 p-4 rounded-md">
                          <div className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold text-black mb-3">Job Condition</h3>
                            <button onClick={() => setShowForm(false)}
                                    className="text-gray-500 hover:text-gray-700 mb-3">✕
                            </button>
                          </div>
                          <div className="space-y-4">
                            <div className="relative w-full flex items-center space-x-4">
                              <div className="flex-1 mb-0">
                                <div
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                                  <label htmlFor="workType"
                                         className="text-sm font-semibold text-gray-500">
                                    Work Type
                                  </label>
                                </div>
                                    </div>
                                    <div className="flex-1 mb-0">
                                      <select name="workType" value={formData.jobCondition?.workType  || ''}
                                              onChange={(e) => handleChange(['jobCondition','workType'], e.target.value)}

                                              className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none">
                                        <option value="" disabled>Select</option>
                                        <option value="REMOTE">Remote</option>
                                        <option value="HYBRID">Hybrid</option>
                                        <option value="ON_SITE">On-Site</option>
                                      </select>
                                    </div>

                                    </div>

                                  <div className="relative w-full flex items-center space-x-4">
                                    <div className="flex-1 mb-0">
                                      <div
                                          className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                                        <label htmlFor="employmentType"
                                               className="text-sm font-semibold text-gray-500">
                                          Employment Type
                                        </label>
                                      </div>
                                    </div>
                                    <div className="flex-1 mb-0">
                                      <select name="employmentType" value={formData.jobCondition?.employmentType  || ''}
                                              onChange={(e) => handleChange(['jobCondition','employmentType'], e.target.value)}
                                              className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none mb-0">
                                        <option value="" disabled>Select</option>
                                        <option value="FULL_TIME">Full-Time</option>
                                        <option value="PART_TIME">Part-Time</option>
                                        <option value="INTERN">Intern</option>
                                        <option value="CONTRACT">Contract</option>
                                        <option value="FREELANCE">Freelance</option>
                                      </select>
                                    </div>
                                    </div>

                                  <div className="relative w-full flex items-center space-x-4">
                                    <div className="flex-1 mb-0">
                                      <div
                                          className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                                        <label htmlFor="country"
                                               className="text-sm font-semibold text-gray-500">
                                          Country
                                        </label>
                                      </div>
                                    </div>
                                    {/* Country */}
                                    <div className="flex-1 mb-0">

                                      <select
                                          name="country"
                                          value={formData.jobCondition?.country || ''}
                                          onChange={(e) => {
                                            const countryId = e.target.value;
                                            setSelectedCountryId(countryId);
                                            handleChange(['jobCondition', 'country'], countryId);
                                            handleChange(['jobCondition', 'city'], ''); // opsiyonel: şehir sıfırlama
                                          }}
                                          className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none mb-0"
                                      >
                                        <option value="">Select Country</option>
                                        {countries.map((country) => (
                                            <option key={country.id} value={country.id}>
                                              {country.name}
                                            </option>
                                        ))}
                                      </select>


                                    </div>

                                  </div>

                            {/* City */}
                            <div className="relative w-full flex items-center space-x-4">
                              <div className="flex-1 mb-0">
                                <div
                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                                  <label htmlFor="city"
                                         className="text-sm font-semibold text-gray-500">
                                    City
                                  </label>
                                      </div>
                                    </div>
                                    <div className="flex-1 mb-0">

                                      <select
                                          name="city" // gerekli
                                          value={formData.jobCondition?.city || ""}
                                          onChange={(e) => handleChange(['jobCondition','city'], e.target.value)}

                                          className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none mb-0"
                                      >
                                        <option value="">Select City</option>
                                        {cities.map((city) => (
                                            <option key={city.id} value={city.id}>
                                              {city.name}
                                            </option>
                                        ))}
                                      </select>
                                    </div>
                                    </div>

                                    <div className="relative w-full flex items-center space-x-4 mb-3">

                                        <div className="flex-1 mb-0">
                                          <input type="number" name="minWorkHours"
                                                 placeholder="Min Work Hours"
                                                 value={formData.jobCondition?.minWorkHours}
                                                 onChange={(e) => handleChange(['jobCondition','minWorkHours'], e.target.value)}
                                                 className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"/>
                                        </div>
                                        <div className="flex-1 mb-0">
                                          <input type="number" name="maxWorkHours"
                                                 placeholder="Max Work Hours"
                                                 value={formData.jobCondition?.maxWorkHours}
                                                 onChange={(e) => handleChange(['jobCondition','maxWorkHours'], e.target.value)}
                                                 className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"/>
                                        </div>
                                    </div>


                                  <div className="flex justify-between">
                                      <button onClick={handleBack}
                                              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Back
                                      </button>
                                      <div className="flex justify-end">
                                        <button onClick={handleNext}
                                                className="bg-blue-600 text-grey px-4 py-2 rounded-md hover:bg-blue-700">Next
                                        </button>
                                      </div>
                                    </div>

                                  </div>
                                </div>
                            </motion.div>
                          )}

                        {step === 3 && showForm && (
                            <motion.div
                          key={step}
                          custom={direction}
                          initial={{x: direction === 1 ? '100%' : '-100%'}}
                          animate={{x: 0}}
                          exit={{x: direction === 1 ? '-100%' : '100%'}}
                          transition={{type: 'tween', ease: 'easeInOut', duration: 0.4}}
                          className="space-y-4"
                      >

                              <div className="bg-gray-50 p-4 rounded-md">
                                {/* minExperience */}
                                <div className="flex justify-between items-center">
                                  <h3 className="text-xl font-semibold text-black mb-3">Job Qualifications</h3>
                                  <button onClick={() => setShowForm(false)}
                                          className="text-gray-500 hover:text-gray-700 mb-3 ">✕
                                  </button>
                                </div>

                                <div className="relative w-full flex items-center space-x-4">

                                  {/* degreeType */}
                                  <div className="flex-1 mb-0">
                                    <div
                                        className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                                      <label htmlFor="degreeType"
                                             className="text-sm font-semibold text-gray-500">
                                        Degree Type
                                      </label>
                                    </div>
                                  </div>
                                  <div className="flex-1 mb-0">

                                    <select name="degreeType" value={formData.jobQualification?.degreeType  || ''}
                                            onChange={(e) => handleChange(['jobQualification','degreeType'], e.target.value)}

                                            className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none">
                                      <option value="" disabled>Select</option>
                                      <option value="ASSOCIATE">Associate</option>
                                      <option value="BACHELOR">Bachelor</option>
                                      <option value="MASTER">Master</option>
                                      <option value="DOCTORATE">Doctorate</option>
                                      <option value="MINOR">Minor</option>
                                    </select>
                                  </div>

                                </div>
                                <div className="relative w-full flex items-center space-x-4">

                                  <div className="flex-1 mb-0">
                                    <div
                                        className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                                      <label htmlFor="jobExperience"
                                             className="text-sm font-semibold text-gray-500">
                                        Job Experience
                                      </label>
                                    </div>
                                  </div>
                                  <div className="flex-1 mb-0">

                                    <select name="jobExperience" value={formData.jobQualification?.jobExperience  || ''}
                                            onChange={(e) => handleChange(['jobQualification','jobExperience'], e.target.value)}

                                            className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none">
                                      <option value="" disabled>Select</option>
                                      <option value="NONE">None</option>
                                      <option value="JUNIOR">Junior</option>
                                      <option value="MID">Mid</option>
                                      <option value="SENIOR">Seniors</option>
                                      <option value="EXPERT">Expert</option>
                                    </select>
                                  </div>

                                </div>

                                < div className = "space-y-4">
                                  <div className="relative w-full flex items-center space-x-4">
                                    <div className="flex-1 mb-0">
                                      <div
                                          className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                                        <label htmlFor="minExperience"
                                               className="text-sm font-semibold text-gray-500">
                                          Experience Years
                                        </label>
                                      </div>
                                    </div>
                                    <div className="flex-1 mb-0">

                                      <input type="number" name="minExperience"
                                             value={formData.jobQualification?.experienceYears}
                                             onChange={(e) => handleChange(['jobQualification','experienceYears'], e.target.value)}
                                             className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"/>

                                    </div>
                                  </div>


                                  <div className="relative w-full flex items-center space-x-4">
                                    <div className="flex-1 mb-0">
                                      <div
                                          className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                                        <label htmlFor="jobExperience"
                                               className="text-sm font-semibold text-gray-500">
                                          Military Status
                                        </label>
                                      </div>
                                    </div>
                                    <div className="flex-1 mb-0">

                                      <select name="militaryStatus"
                                              value={formData.jobQualification?.militaryStatus || ''}
                                              onChange={(e) => handleChange(['jobQualification', 'militaryStatus'], e.target.value)}
                                              className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none">
                                        <option value="" disabled>Select</option>
                                        <option value="DONE">Done</option>
                                        <option value="NOT_DONE">Not Done</option>
                                        <option value="DEFERRED">Deferred</option>
                                        <option value="EXEMPTED">Exempted</option>
                                        <option value="NOT_REQUIRED">Not Required</option>
                                      </select>
                                    </div>

                                  </div>
                                  <br/>
                                  <div className="space-y-6">
                                    <div className="flex-1 mb-0">
                                      <div
                                          className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                                        <label htmlFor="technicalSkills"
                                               className="text-sm font-semibold text-gray-500">
                                          Technical Skills
                                        </label>
                                      </div>
                                    </div>

                                    <div className="flex-1 mb-0">
                                      {formData.jobQualification?.technicalSkills?.map((technicalSkills, index) => (
                                          <div key={index} className="space-y-4 mt-6">
                                            <div className="relative w-full flex items-center space-x-4">
                                              <div className="flex-1 mb-0">
                                                <input
                                                    type="text"
                                                    value={technicalSkills.positionName}
                                                    onChange={(e) => handleChange(['jobQualification','technicalSkills',index,'positionName'], e.target.value)}
                                                    placeholder="Position Name"
                                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none mb"
                                                />
                                              </div>
                                            </div>
                                            <div className="relative w-full flex items-center space-x-4">
                                              <div className="flex-1 mb-0">
                                                <select
                                                    value={technicalSkills.skillLevel  || ''}
                                                    onChange={(e) => handleChange(['jobQualification','technicalSkills',index,'skillLevel'], e.target.value)}
                                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                                >
                                                  <option value="" disabled>Skill Level</option>
                                                  <option value="BEGINNER">Beginner</option>
                                                  <option value="INTERMEDIATE">Intermediate</option>
                                                  <option value="ADVANCED">Advanced</option>
                                                  <option value="EXPERT">Expert</option>

                                                </select>
                                              </div>
                                            </div>

                                            <div className="relative w-full flex items-center space-x-4 mb-3">
                                              <div className="flex-1 mb-0">
                                                <input
                                                    type="text"
                                                    value={technicalSkills.description}
                                                    onChange={(e) => handleChange(['jobQualification','technicalSkills',index,'description'], e.target.value)}
                                                    placeholder="Description"
                                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                                />
                                              </div>
                                            </div>
                                            <div className="text-right mb-3">
                                              <button
                                                  onClick={() => removeTechnicalSkills(index)}
                                                  className="text-red-600 text-sm "
                                              >
                                                Remove
                                              </button>
                                            </div>
                                          </div>

                                      ))}
                                    </div>
                                  </div>
                                <br/>
                                <div className="space-y-6">
                                  <div className="flex-1 mb-0">
                                    <div
                                        className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                                      <label htmlFor="benefits"
                                             className="text-sm font-semibold text-gray-500">
                                        Social Skills
                                      </label>
                                    </div>
                                  </div>

                                    <div className="flex-1 mb-0">
                                      {formData.jobQualification?.socialSkills?.map((socialSkills, index) => (
                                          <div key={index} className="space-y-4 mt-6">
                                            <div className="relative w-full flex items-center space-x-4">
                                              <div className="flex-1 mb-0">
                                                <input
                                                    type="text"
                                                    value={socialSkills.positionName}
                                                    onChange={(e) => handleChange(['jobQualification','socialSkills',index,'positionName'], e.target.value)}

                                                    placeholder="Position Name"
                                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                                />
                                              </div>
                                            </div>
                                            <div className="relative w-full flex items-center space-x-4">
                                              <div className="flex-1 mb-0">
                                                <select
                                                    value={socialSkills.skillLevel  || ''}
                                                    onChange={(e) => handleChange(['jobQualification','socialSkills',index,'skillLevel'], e.target.value)}
                                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                                >
                                                  <option value="" disabled>Skill Level</option>
                                                  <option value="BEGINNER">Beginner</option>
                                                  <option value="INTERMEDIATE">Intermediate</option>
                                                  <option value="ADVANCED">Advanced</option>
                                                  <option value="EXPERT">Expert</option>

                                                </select>
                                              </div>
                                            </div>

                                            <div className="relative w-full flex items-center space-x-4">
                                              <div className="flex-1 mb-0">
                                                <input
                                                    type="text"
                                                    value={socialSkills.description}
                                                    onChange={(e) => handleChange(['jobQualification','socialSkills',index,'description'], e.target.value)}
                                                    placeholder="Description"
                                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none mb-3"
                                                />
                                              </div>
                                            </div>
                                            <div className="text-right mb-3">
                                              <button
                                                  onClick={() => removeSocialSkills(index)}
                                                  className="text-red-600 text-sm "
                                              >
                                                Remove
                                              </button>
                                            </div>
                                          </div>

                                      ))}
                                    </div>
                                  </div>
                                <br/>

                                <div className="space-y-6">
                                  <div className="flex-1 mb-0">
                                    <div
                                        className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                                      <label htmlFor="languageProficiency"
                                             className="text-sm font-semibold text-gray-500">
                                        Language Skills
                                      </label>
                                    </div>
                                  </div>
                                    {/* List of Language Skills */}
                                    {formData.jobQualification?.languageProficiencies?.map((languageProficiency, index) => (
                                        <div key={index} className="space-y-4 mt-6">
                                          <div className="relative w-full flex items-center space-x-4">
                                            <div className="flex-1 mb-0">
                                              <input
                                                  type="text"
                                                  value={languageProficiency.language}
                                                  onChange={(e) => handleChange(['jobQualification','languageProficiencies',index,'language'], e.target.value)}
                                                  placeholder="Language"
                                                  className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                              />
                                            </div>
                                          </div>

                                          {/* Reading Level Select */}
                                          <div className="relative w-full flex items-center space-x-4">
                                            <div className="flex-1 mb-0">
                                              <div
                                                  className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                                                <label htmlFor="readingLevel"
                                                       className="text-sm font-semibold text-gray-500">
                                                  Reading Level
                                                </label>
                                              </div>
                                            </div>
                                            <div className="flex-1 mb-0">
                                              <select
                                                  value={languageProficiency.readingLevel  || ''}
                                                  onChange={(e) => handleChange(['jobQualification','languageProficiencies',index,'readingLevel'], e.target.value)}
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
                                              <div
                                                  className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                                                <label htmlFor="writingLevel"
                                                       className="text-sm font-semibold text-gray-500">
                                                  Writing Level
                                                </label>
                                              </div>
                                            </div>
                                            <div className="flex-1 mb-0">
                                              <select
                                                  value={languageProficiency.writingLevel  || ''}
                                                  onChange={(e) => handleChange(['jobQualification','languageProficiencies',index,'writingLevel'], e.target.value)}

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
                                              <div
                                                  className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                                                <label htmlFor="speakingLevel"
                                                       className="text-sm font-semibold text-gray-500">
                                                  Speaking Level
                                                </label>
                                              </div>
                                            </div>
                                            <div className="flex-1 mb-0">
                                              <select
                                                  value={languageProficiency.speakingLevel  || ''}
                                                  onChange={(e) => handleChange(['jobQualification','languageProficiencies',index,'speakingLevel'], e.target.value)}
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
                                          <div className="relative w-full flex items-center space-x-4 mb-3">
                                            <div className="flex-1 mb-0">
                                              <div
                                                  className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                                                <label htmlFor="listeningLevel"
                                                       className="text-sm font-semibold text-gray-500">
                                                  Listening Level
                                                </label>
                                              </div>
                                            </div>
                                            <div className="flex-1 mb-0">
                                              <select
                                                  value={languageProficiency.listeningLevel || ''}
                                                  onChange={(e) => handleChange(['jobQualification','languageProficiencies',index,'listeningLevel'], e.target.value)}
                                                  className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
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
                                  </div>
                                  <br/>

                                  <div className="space-y-6 mb-3">
                                    <div className="flex-1 mb-0">
                                      <div
                                          className="w-full border border-gray-300 p-3 rounded-md bg-white text-black">
                                        <label htmlFor="benefits"
                                               className="text-sm font-semibold text-gray-500">
                                          Benefits
                                        </label>
                                      </div>
                                    </div>

                                    <div className="flex-1 mb-0">
                                      {formData.benefits?.map((benefits, index) => (
                                          <div key={index} className="space-y-4 mt-6">

                                            <div className="relative w-full flex items-center space-x-4">
                                              <div className="flex-1 mb-0">
                                                <select
                                                    value={benefits.benefitType || ''}
                                                    onChange={(e) => handleChange(['benefits',index,'benefitType'], e.target.value)}
                                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                                >
                                                  <option value="" disabled>Benefit Type</option>
                                                  <option value="MEAL">Meal</option>
                                                  <option value="TRANSPORTATION">Transportation</option>
                                                  <option value="HEALTH_INSURANCE">Health Insurance</option>
                                                  <option value="BONUS">Bonus</option>
                                                  <option value="EDUCATION_SUPPORT">Education Support</option>
                                                  <option value="OTHER">Other</option>

                                                </select>
                                              </div>
                                            </div>

                                            <div className="relative w-full flex items-center space-x-4">
                                              <div className="flex-1 mb-0">
                                                <input
                                                    type="text"
                                                    value={benefits.description}
                                                    onChange={(e) => handleChange(['benefits',index,'description'], e.target.value)}
                                                    placeholder="Description"
                                                    className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none mb-3"
                                                />
                                              </div>
                                            </div>
                                            <div className="text-right mb-3">
                                              <button
                                                  onClick={() => removeBenefits(index)}
                                                  className="text-red-600 text-sm "
                                              >
                                                Remove
                                              </button>
                                            </div>
                                          </div>

                                      ))}
                                    </div>
                                  </div>


                                  <div>
                                    <div className="flex justify-content-center">
                                      <button
                                          onClick={addTechnicalSkills}
                                          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                      >
                                        Add Technical Skills
                                      </button>
                                      &nbsp;&nbsp;
                                      <button
                                          onClick={addSocialSkills}
                                          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                      >
                                        Add Social Skills
                                      </button>
                                      &nbsp;&nbsp;
                                      <button
                                          onClick={addLanguageSkill}
                                          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                      >
                                        Add Language Skill
                                      </button>

                                      &nbsp;&nbsp;

                                      <button
                                          onClick={addBenefits}
                                          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                      >
                                        Add Benefits
                                      </button>


                                    </div>

                                    {/* Next Step Button */}
                                    <div style={{textAlign: 'right'}}>
                                      <div className="flex justify-between">
                                        <button onClick={handleBack}
                                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Back
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
        </div>
      </div>
  );
}
