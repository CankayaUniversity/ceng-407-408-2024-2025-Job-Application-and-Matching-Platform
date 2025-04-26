import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CreateJobForm({ onClose }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    jobPosition: '',
    jobDescription: '',
    startDate: '',
    endDate: '',
    isActive: true,
    workType: '',
    city: '',
    country: '',
    minWorkHours: '',
    maxWorkHours: '',
    salaryRange: '',
    canWorkRemote: false,
    skills: [],
    languages: [],
    minExperience: '',
    degreeType: '',
  });

  const [direction, setDirection] = useState(1);  // 1: ileri, -1: geri
  const [skillInput, setSkillInput] = useState('');
  const [languageInput, setLanguageInput] = useState('');


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

  const handleSkillAdd = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };
  
  const removeSkill = (skill) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };
  
  const handleLanguageAdd = () => {
    if (languageInput.trim() && !formData.languages.includes(languageInput.trim())) {
      setFormData({ ...formData, languages: [...formData.languages, languageInput.trim()] });
      setLanguageInput('');
    }
  };
  
  const removeLanguage = (lang) => {
    setFormData({ ...formData, languages: formData.languages.filter(l => l !== lang) });
  };
  

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col max-w-2xl w-full h-full right-0 shadow-lg">
      <div className="bg-white rounded-lg w-full max-w-3xl overflow-y-auto max-h-[90vh] p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Create New Job Posting</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          {step === 1 && (
             <motion.div
             key={step}
             custom={direction}
             initial={{ x: direction === 1 ? '100%' : '-100%' }}
             animate={{ x: 0 }}
             exit={{ x: direction === 1 ? '-100%' : '100%' }}
             transition={{ type: 'tween', ease: 'easeInOut', duration: 0.4 }}
           >
          
              <label className="block">
                <span className="text-gray-700">Job Position</span>
                <input type="text" name="jobPosition" value={formData.jobPosition} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md" />
              </label>
              <label className="block">
                <span className="text-gray-700">Job Description</span>
                <textarea name="jobDescription" value={formData.jobDescription} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md" />
              </label>
              <div className="flex space-x-4">
                <label className="block flex-1">
                  <span className="text-gray-700">Start Date</span>
                  <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md" />
                </label>
                <label className="block flex-1">
                  <span className="text-gray-700">End Date</span>
                  <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md" />
                </label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="mr-2" />
                <span>Is Active</span>
              </div>

              <div className="flex justify-end">
                <button onClick={handleNext} className="bg-blue-600 text-grey px-4 py-2 rounded-md hover:bg-blue-700">Next</button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
             <motion.div
             key={step}
             custom={direction}
             initial={{ x: direction === 1 ? '100%' : '-100%' }}
             animate={{ x: 0 }}
             exit={{ x: direction === 1 ? '-100%' : '100%' }}
             transition={{ type: 'tween', ease: 'easeInOut', duration: 0.4 }}
           >
              <label className="block">
                <span className="text-gray-700">Work Type</span>
                <select name="workType" value={formData.workType} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md">
                  <option value="">Select</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                </select>
              </label>
              <label className="block">
                <span className="text-gray-700">City</span>
                <input type="text" name="city" value={formData.city} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md" />
              </label>
              <label className="block">
                <span className="text-gray-700">Country</span>
                <input type="text" name="country" value={formData.country} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md" />
              </label>
              <div className="flex space-x-4">
                <label className="block flex-1">
                  <span className="text-gray-700">Min Work Hours</span>
                  <input type="number" name="minWorkHours" value={formData.minWorkHours} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md" />
                </label>
                <label className="block flex-1">
                  <span className="text-gray-700">Max Work Hours</span>
                  <input type="number" name="maxWorkHours" value={formData.maxWorkHours} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md" />
                </label>
              </div>
              <label className="block">
                <span className="text-gray-700">Salary Range (Optional)</span>
                <input type="text" name="salaryRange" value={formData.salaryRange} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md" />
              </label>
              <div className="flex items-center">
                <input type="checkbox" name="canWorkRemote" checked={formData.canWorkRemote} onChange={handleChange} className="mr-2" />
                <span>Can Work Remote</span>
              </div>

              <div className="flex justify-between">
                <button onClick={handleBack} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Back</button>
                <div className="flex justify-end">
                  <button onClick={handleNext} className="bg-blue-600 text-grey px-4 py-2 rounded-md hover:bg-blue-700">Next</button>
                </div>
              </div>
            </motion.div>
          )}

            {step === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                initial={{ x: direction === 1 ? '100%' : '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: direction === 1 ? '-100%' : '100%' }}
                transition={{ type: 'tween', ease: 'easeInOut', duration: 0.4 }}
                className="space-y-4"
              >
                {/* Skills */}
                <label className="block">
                  <span className="text-gray-700">Required Skills</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleSkillAdd(); }} className="flex-1 border border-gray-300 rounded-md px-3 py-2" />
                    <button type="button" onClick={handleSkillAdd} className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700">+</button>
                  </div>
                  <div className="flex flex-wrap mt-2">
                    {formData.skills.map((skill, idx) => (
                      <div key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center mr-2 mb-2">
                        <span>{skill}</span>
                        <button type="button" onClick={() => removeSkill(skill)} className="ml-2 text-blue-500 hover:text-blue-700">x</button>
                      </div>
                    ))}
                  </div>
                </label>

                {/* minExperience */}
                <label className="block">
                  <span className="text-gray-700">Minimum Experience (years)</span>
                  <input type="number" name="minExperience" value={formData.minExperience} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
                </label>

                {/* degreeType */}
                <label className="block">
                  <span className="text-gray-700">Degree Type</span>
                  <select name="degreeType" value={formData.degreeType} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                    <option value="">Select</option>
                    <option value="BACHELOR">Lisans</option>
                    <option value="MASTER">Yüksek Lisans</option>
                    <option value="PHD">Doktora</option>
                  </select>
                </label>

                {/* Languages */}
                <label className="block">
                  <span className="text-gray-700">Languages</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <input type="text" value={languageInput} onChange={(e) => setLanguageInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleLanguageAdd(); }} className="flex-1 border border-gray-300 rounded-md px-3 py-2" />
                    <button type="button" onClick={handleLanguageAdd} className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700">+</button>
                  </div>
                  <div className="flex flex-wrap mt-2">
                    {formData.languages.map((lang, idx) => (
                      <div key={idx} className="bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center mr-2 mb-2">
                        <span>{lang}</span>
                        <button type="button" onClick={() => removeLanguage(lang)} className="ml-2 text-green-500 hover:text-green-700">x</button>
                      </div>
                    ))}
                  </div>
                </label>

                <div className="flex justify-between">
                <button onClick={handleBack} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Back</button>
                <div className="flex justify-end">
                  <button onClick={handleNext} className="bg-blue-600 text-grey px-4 py-2 rounded-md hover:bg-blue-700">Next</button>
                </div>
              </div>

              </motion.div>
            )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  custom={direction}
                  initial={{ x: direction === 1 ? '100%' : '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: direction === 1 ? '-100%' : '100%' }}
                  transition={{ type: 'tween', ease: 'easeInOut', duration: 0.4 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold">Review Job Posting</h3>
                  <pre className="bg-gray-100 p-4 rounded-lg text-sm">{JSON.stringify(formData, null, 2)}</pre>
                  <div className="flex justify-between">
                  <button onClick={handleBack} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Back</button>
                  <button
                    type="submit"
                    disabled={false}  // şimdilik false tut, test için
                    className="px-4 py-2 bg-green-600 text-grey rounded-md hover:bg-green-700 transition-colors duration-300 disabled:opacity-100 disabled:pointer-events-auto"
                  >Submit
                  </button>
                </div>
                </motion.div>
              )}


        </AnimatePresence>
      </div>
    </div>
  );
}
