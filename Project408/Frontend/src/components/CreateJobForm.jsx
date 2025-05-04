import React, {useEffect, useState} from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CreateJobForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    company: {
      companyName: '',
      industry: '',
      employeeCount: '',
      email: '',
      phoneNumber:'',
      websiteUrl:''
    },
    jobPosition: {
      jobPositions: [{ positionType: null , customJobPosition: { positionName: '' } }],
    },
    jobDescription: '',
    startDate: '',
    endDate: '',
    isActive: true,
    travelRest: true,
    license: true,
    workType: null,
    employmentType:null,
    city: '',
    country: '',
    minWorkHours: '',
    maxWorkHours: '',
    minSalary:'',
    maxSalary:'',
    skills: [
      {
        skillName: '',
        skillLevel: null
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
    minExperience: '',
    degreeType: null,
    benefits:[ {
      benefitType: null,
      description: ''
    }],
  });

  const [direction, setDirection] = useState(1);  // 1: ileri, -1: geri

  const [showForm, setShowForm] = useState(false);
  const [formKey, setFormKey] = useState(0);

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


  const handleSubmit = async (e) => {
    e.preventDefault();

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
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Job Advertisement oluşturulamadı');
      }

      const data = await response.json();
      console.log('Job Advertisement başarıyla oluşturuldu:', data);

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
  
  

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
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
    setFormData({
      ...formData,
      languageProficiency: [
        ...formData. languageProficiency,
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
    setFormData((prevData) => ({
      ...prevData,
      languageProficiency: prevData.languageProficiency.filter((_, i) => i !== index),
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
          <div className="max-w-[900px] mx-auto bg-gray-100 rounded-xl p-10 space-y-10 shadow-md">
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
                          <img src="/profile-placeholder.png" alt="Profile"
                               className="w-24 h-24 rounded-full border-4 border-white"/>
                          <h2 className="text-xl font-bold"> {formData.company?.companyName || ''}</h2>

                          {/* Bilgi listesi */}
                          <div className="space-y-2 text-sm w-full">
                            <p><strong>Email:</strong> {formData.company?.email || '-'}</p>
                            <p><strong>Phone Number:</strong> {formData.company?.phoneNumber || '-'}</p>
                            <p><strong>Website Url:</strong> {formData.company?.websiteUrl || '-'}</p>
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
                            <h3 className="text-lg font-semibold mb-2">Job Advertisement</h3>
                            <p className="text-sm">
                              <span className="font-medium text-gray-700">Job Position:</span>{' '}<span
                                className="text-gray-600">{formData.jobPosition?.jobPositions?.positionType || 'Not specified'}</span>
                            </p>
                            <p className="text-sm">
                              <span className="font-medium text-gray-700">Job Description:</span>{' '}<span
                                className="text-gray-600">{formData?.jobDescription || 'Not specified'}</span>
                            </p>
                            <p className="text-sm">
                              <span className="font-medium text-gray-700">Start Date - End Date:</span>{' '}
                              <span
                                  className="text-gray-600">{formData?.startDate || 'Not specified'} - {formData?.endDate || 'Not specified'}</span>
                            </p>

                            <p className="text-sm">
                          <span
                              className="font-medium text-gray-700">Salary Range:</span>{' '}
                              <span
                                  className="text-gray-600">{formData.minSalary || 'Not specified'} - {formData.maxSalary || 'Not specified'}</span>
                            </p>

                            <p className="text-sm">
                              <span className="font-medium text-gray-700">Active:</span>{' '}
                              <span
                                  className="text-gray-600">{formData.isActive ? 'Yes' : 'No'}</span>
                            </p>
                            <p className="text-sm">
                              <span className="font-medium text-gray-700">Travel Rest:</span>{' '}
                              <span
                                  className="text-gray-600">{formData.travelRest ? 'Yes' : 'No'}</span>
                            </p>
                            <p className="text-sm">
                              <span className="font-medium text-gray-700">License:</span>{' '}
                              <span
                                  className="text-gray-600">{formData.license ? 'Yes' : 'No'}</span>
                            </p>
                          </div>

                          <div>
                            <h3 className="text-lg font-semibold mb-2">Job Conditions</h3>

                            <p className="text-sm">
                           <span
                               className="font-medium text-gray-700">Work Type:</span>{' '}
                              <span
                                  className="text-gray-600">{formData.workType || 'Not specified'}</span>
                            </p>
                            <p className="text-sm">
                           <span
                               className="font-medium text-gray-700">Employment Type:</span>{' '}
                              <span
                                  className="text-gray-600">{formData.employmentType || 'Not specified'}</span>
                            </p>
                            <p className="text-sm">
                          <span
                              className="font-medium text-gray-700">City:</span>{' '}
                              <span
                                  className="text-gray-600">{formData.city || 'Not specified'}</span>
                            </p>
                            <p className="text-sm">
                          <span
                              className="font-medium text-gray-700">Country:</span>{' '}
                              <span
                                  className="text-gray-600">{formData.country || 'Not specified'}</span>
                            </p>
                            <p className="text-sm">
                          <span
                              className="font-medium text-gray-700">Work Hours:</span>{' '}
                              <span
                                  className="text-gray-600">{formData.minWorkHours || 'Not specified'} - {formData.maxWorkHours || 'Not specified'}</span>
                            </p>

                          </div>


                          <div>
                            <h3 className="text-lg font-semibold mb-2">Job Qualifications</h3>
                            <p className="text-sm">
                              <span className="font-medium text-gray-700">Benefits:</span>{' '}

                              {formData.benefits?.length > 0 && formData.benefits[0].benefitType ? (
                                  formData.benefits.map((benefit, idx) => (
                                      <div key={idx} className="border-b pb-2 mb-2">
                                        <p className="font-semibold">{benefit.description}</p>

                                      </div>
                                  ))
                              ) : (
                                  <p className="text-gray-500">No benefits added.</p>
                              )}
                            </p>
                            <div>
                              <span className="text-lg font-semibold mb-2">Skills</span>
                              {formData.skills?.length > 0 && formData.skills[0].skillName ? (
                                  <div className="flex flex-wrap gap-2">
                                    {formData.skills?.map((skill, idx) => (
                                        <span key={idx}
                                              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{skill.skillName} ({skill.skillLevel})</span>
                                    ))}
                                  </div>
                              ) : (
                                  <p className="text-gray-500">No skills added.</p>
                              )}
                            </div>

                            {/* Languages */}
                            <div>
                              <span className="text-lg font-semibold mb-2">Language Proficiency:</span>
                              {formData.languageProficiency?.length > 0 && formData.languageProficiency[0].language ? (
                                  formData.languageProficiency.map((lang, idx) => (
                                      <div key={idx} className="border-b pb-2 mb-2">
                                        <p className="font-semibold">{lang.language}</p>
                                        <p>Reading: {lang.readingLevel}, Writing: {lang.writingLevel},
                                          Speaking: {lang.speakingLevel}, Listening: {lang.listeningLevel}</p>
                                      </div>
                                  ))
                              ) : (
                                  <p className="text-gray-500">No languages added.</p>
                              )}
                            </div>
                          </div>

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
                          <div className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold text-black mt-0">Job Advertisement</h3>
                            <button onClick={() => setShowForm(false)}
                                    className="text-gray-500 hover:text-gray-700">✕
                            </button>
                          </div>
                          <label className="block">
                            <span className="text-gray-700">Job Position</span>
                            <select name="jobPositions" value={formData.jobPosition?.jobPositions?.positionType}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md bg-white text-black">
                              <option value="" disabled>Select</option>
                              <option value="SOFTWARE_ENGINEER">Software Engineer</option>
                              <option value="FRONTEND_DEVELOPER">Frontend Developer</option>
                              <option value="BACKEND_DEVELOPER">Backend Developer</option>
                              <option value="OTHER">Other</option>
                            </select>
                          </label>

                          <label className="block">
                            <span className="text-gray-700">Job Description</span>
                            <textarea name="jobDescription" value={formData.jobDescription} onChange={handleChange}
                                      className="mt-1 block w-full border border-gray-300 rounded-md bg-white text-black"/>
                          </label>
                          <div className="flex space-x-4">
                            <label className="block flex-1">
                              <span className="text-gray-700">Start Date</span>
                              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange}
                                     className="mt-1 block w-full border border-gray-300 rounded-md bg-white text-black"/>
                            </label>
                            <label className="block flex-1">
                              <span className="text-gray-700">End Date</span>
                              <input type="date" name="endDate" value={formData.endDate} onChange={handleChange}
                                     className="mt-1 block w-full border border-gray-300 rounded-md bg-white text-black"/>
                            </label>
                          </div>
                          <div className="flex space-x-4">
                            <label className="block flex-1">
                              <span className="text-gray-700">Salary Range (Optional)</span>
                              <input type="text" name="minSalary" value={formData.minSalary} onChange={handleChange}
                                     className="mt-1 block w-full border border-gray-300 rounded-md bg-white text-black"/>
                            </label>
                            <label className="block flex-1">
                              <span className="text-gray-700">Max Salary</span>
                              <input type="number" name="maxSalary" value={formData.maxSalary} onChange={handleChange}
                                     className="mt-1 block w-full border border-gray-300 rounded-md bg-white text-black"/>
                            </label>
                          </div>

                          <div className="flex items-center">
                            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange}
                                   className="mr-2"/>
                            <span>Is Active?</span>
                          </div>
                          <div className="flex items-center">
                            <input type="checkbox" name="travelRest" checked={formData.travelRest}
                                   onChange={handleChange}
                                   className="mr-2"/>
                            <span>Travel Rest?</span>
                          </div>
                          <div className="flex items-center">
                            <input type="checkbox" name="license" checked={formData.license} onChange={handleChange}
                                   className="mr-2"/>
                            <span>License?</span>
                          </div>
                          <div className="flex justify-end">
                            <button onClick={handleNext}
                                    className="bg-blue-600 text-grey px-4 py-2 rounded-md hover:bg-blue-700">Next
                            </button>
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
                            <h3 className="text-xl font-semibold text-black mt-0">Job Qualifications</h3>
                            <button onClick={() => setShowForm(false)}
                                    className="text-gray-500 hover:text-gray-700">✕
                            </button>
                          </div>
                          <label className="block">
                            <span className="text-gray-700">Work Type</span>
                            <select name="workType" value={formData.workType} onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md bg-white text-black">
                              <option value="" disabled>Select</option>
                              <option value="REMOTE">Remote</option>
                              <option value="HYBRID">Hybrid</option>
                              <option value="ON_SITE">On-Site</option>
                            </select>
                          </label>
                          <label className="block">
                            <span className="text-gray-700">Employment Type</span>
                            <select name="employmentType" value={formData.employmentType} onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md bg-white text-black">
                              <option value="" disabled>Select</option>
                              <option value="FULL_TIME">Full-Time</option>
                              <option value="PART_TIME">Part-Time</option>
                              <option value="INTERN">Intern</option>
                              <option value="CONTRACT">Contract</option>
                              <option value="FREELANCE">Freelance</option>
                            </select>
                          </label>
                          <label className="block">
                            <span className="text-gray-700">City</span>
                            <input type="text" name="city" value={formData.city} onChange={handleChange}
                                   className="mt-1 block w-full border border-gray-300 rounded-md bg-white text-black "/>
                          </label>
                          <label className="block">
                            <span className="text-gray-700">Country</span>
                            <input type="text" name="country" value={formData.country} onChange={handleChange}
                                   className="mt-1 block w-full border border-gray-300 rounded-md bg-white text-black"/>
                          </label>
                          <div className="flex space-x-4">
                            <label className="block flex-1">
                              <span className="text-gray-700">Min Work Hours</span>
                              <input type="number" name="minWorkHours" value={formData.minWorkHours}
                                     onChange={handleChange}
                                     className="mt-1 block w-full border border-gray-300 rounded-md bg-white text-black"/>
                            </label>
                            <label className="block flex-1">
                              <span className="text-gray-700">Max Work Hours</span>
                              <input type="number" name="maxWorkHours" value={formData.maxWorkHours}
                                     onChange={handleChange}
                                     className="mt-1 block w-full border border-gray-300 rounded-md bg-white text-black mb-3"/>
                            </label>
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
                            <h3 className="text-xl font-semibold text-black mt-0">Job Qualifications</h3>
                            <button onClick={() => setShowForm(false)}
                                    className="text-gray-500 hover:text-gray-700">✕
                            </button>
                          </div>
                          <label className="block">
                            <span className="text-gray-700">Minimum Experience (years)</span>
                            <input type="number" name="minExperience" value={formData.minExperience}
                                   onChange={handleChange}
                                   className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-black"/>
                          </label>

                          {/* degreeType */}
                          <label className="block">
                            <span className="text-gray-700">Degree Type</span>
                            <select name="degreeType" value={formData.degreeType} onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-black">
                              <option value="" disabled>Select</option>
                              <option value="BACHELOR">Bachelor</option>
                              <option value="MASTER">Master</option>
                              <option value="PHD">Phd</option>
                            </select>
                          </label>


                          <div className="space-y-6">
                            <span className="text-xl font-semibold">Benefits</span>

                            {formData.benefits.map((benefits, index) => (
                                <div key={index} className="space-y-4 mt-6">

                                  <div className="relative w-full flex items-center space-x-4">
                                    <div className="flex-1 mb-0">
                                      <select
                                          value={benefits.benefitType}
                                          onChange={handleChange}
                                          className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
                                      >
                                        <option value="" disabled>Select</option>
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
                                          onChange={handleChange}
                                          placeholder="Description"
                                          className="w-full border border-gray-300 p-3 rounded-md bg-white text-black focus:outline-none"
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
                            <br/>

                            <div className="space-y-6">
                              <span className="text-xl font-semibold">Language Skills</span>
                              {/* List of Language Skills */}
                              {formData.languageProficiency.map((languageProficiency, index) => (
                                  <div key={index} className="space-y-4 mt-6">
                                    <div className="relative w-full flex items-center space-x-4">
                                      <div className="flex-1 mb-0">
                                        <input
                                            type="text"
                                            value={languageProficiency.language}
                                            onChange={handleChange}
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
                                            onChange={handleChange}
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
                                            onChange={handleChange}
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
                                            onChange={handleChange}
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
                                            onChange={handleChange}
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

                            </div>
                          </div>
                          <br/>
                          <div className="flex justify-between mt-6">

                            {/* Next Step Button */}
                            <div style={{textAlign: 'right'}}>
                              <div className="flex justify-between">
                                <button onClick={handleBack}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Back
                                </button>
                                <button
                                    onClick={addBenefits}
                                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                >
                                  Add Benefits
                                </button>
                                <button
                                    onClick={addLanguageSkill}
                                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                >
                                  Add Language Skill
                                </button>
                                <button
                                    onClick={handleCloseForm}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
        </div>
      </div>
  );
}
