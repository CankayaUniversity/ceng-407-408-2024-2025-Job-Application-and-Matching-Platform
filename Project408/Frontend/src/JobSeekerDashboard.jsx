import { FaBell, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from "axios";

export default function JobSeekerDashboard() {

  const [phone, setPhone] = useState("");
  const [biography, setBiography] = useState("");
  const [experiences, setExperiences] = useState([{ company: "", title: "" }]);
  const [educations, setEducations] = useState([
    { school: '', department: '', startDate: '', endDate: '', isOngoing: false }
  ]);
  const [skills, setSkills] = useState([""]);
  const [languages, setLanguages] = useState([""]);
  const [certificates, setCertificates] = useState([
    { name: '', url: '' }
  ]);
  const [exams, setExams] = useState([
    { name: '', year: '', score: '', rank: '' }
  ]);
  const [documents, setDocuments] = useState([]);
  const [projects, setProjects] = useState([
    { name: '', description: '', startDate: '', endDate: '', isOngoing: false }
  ]);

  const [userInfo, setUserInfo] = useState({
    name: 'İrem',
    jobTitle: 'Software Engineer',
    nationality: '',
    isWorking: '',
    phone: '',
    city: '',
    gender: '',
    militaryStatus: '',
    disabilityStatus: '',
    maritalStatus: '',
    drivingLicense: '',
    profilePrivacy: 'Visible to everyone',
    github: '',
    portfolio: '',
    jobPreferences: '',
    references: '',
    hobbies: ''
  });
  
  
  

  const handleUserInfoChange = (field, value) => {
    setUserInfo({ ...userInfo, [field]: value });
  };
  
  const handleSaveUserInfo = () => {
    console.log('👤 User Info:', userInfo);
  };
  


  const handleExperienceChange = (index, field, value) => {
    const updated = [...experiences];
    updated[index][field] = value;
    setExperiences(updated);
  };

  const handleAddExperience = () => {
    setExperiences([...experiences, { company: '', title: '' }]);
  };

  const handleSaveExperiences = () => {
    console.log('📌 Work Experiences:', experiences);
  };


  const handleEducationChange = (index, field, value) => {
    const updated = [...educations];
    updated[index][field] = value;
    setEducations(updated);
  };
  
  const handleAddEducation = () => {
    setEducations([
      ...educations,
      { school: '', department: '', startDate: '', endDate: '', isOngoing: false }
    ]);
  };
  
  const handleSaveEducation = () => {
    console.log('🎓 Education Info:', educations);
  };


  // Skills
  const handleSkillChange = (index, value) => {
    const updated = [...skills];
    updated[index] = value;
    setSkills(updated);
  };

  const handleAddSkill = () => {
    setSkills([...skills, ""]);
  };

  const handleSaveSkills = () => {
    console.log("🛠️ Skills:", skills);
  };

  // Languages
  const handleLanguageChange = (index, value) => {
    const updated = [...languages];
    updated[index] = value;
    setLanguages(updated);
  };

  const handleAddLanguage = () => {
    setLanguages([...languages, ""]);
  };

  const handleSaveLanguages = () => {
    console.log("🗣️ Languages:", languages);
  };

  // Certificates
  const handleCertificateChange = (index, field, value) => {
    const updated = [...certificates];
    updated[index][field] = value;
    setCertificates(updated);
  };
  
  const handleAddCertificate = () => {
    setCertificates([...certificates, { name: '', url: '' }]);
  };
  
  const handleSaveCertificates = () => {
    console.log("📜 Certificates:", certificates);
  };

  // Exams
  const handleExamChange = (index, field, value) => {
    const updated = [...exams];
    updated[index][field] = value;
    setExams(updated);
  };
  
  const handleAddExam = () => {
    setExams([...exams, { name: '', year: '', score: '', rank: '' }]);
  };
  
  const handleSaveExams = () => {
    console.log("🏆 Exams & Achievements:", exams);
  };

  // Documents
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setDocuments((prevDocs) => [...prevDocs, ...files]);
  };
  
  const handleRemoveDocument = (index) => {
    const updated = [...documents];
    updated.splice(index, 1);
    setDocuments(updated);
  };
  
  const handleSaveDocuments = async () => {
    const formData = new FormData();
  
    documents.forEach((doc) => {
      formData.append("files", doc); // backend'deki field adı "files"
    });
  
    try {
      const response = await axios.post("http://localhost:8080/api/documents/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
  
      console.log("✅ Upload success:", response.data);
    } catch (error) {
      console.error("❌ Upload failed:", error);
    }
  };

  // Projects
  const handleProjectChange = (index, field, value) => {
    const updated = [...projects];
    updated[index][field] = value;
    setProjects(updated);
  };
  
  const handleAddProject = () => {
    setProjects([...projects, { name: '', description: '', startDate: '', endDate: '', isOngoing: false }]);
  };
  
  const handleSaveProjects = () => {
    console.log("📁 Projects:", projects);
  };
  
  
  
  


  
  






  return (
    <div className="min-h-screen bg-white font-sans">
      {/* NAVBAR */}
      <nav className="w-full bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between w-full h-16 px-8">
          {/* Sol: Logo + Menü */}
          <div className="flex items-center gap-12">
            <Link to="/" className="text-blue-600 font-semibold text-lg">Logo</Link>

            <div className="flex items-center gap-8">
              <Link to="/profile" className="text-[15px] text-gray-700 hover:text-gray-900">Profile</Link>
              <Link to="/chat" className="text-[15px] text-gray-700 hover:text-gray-900">Chat</Link>
              <Link to="/blog" className="text-[15px] text-gray-700 hover:text-gray-900">Blog</Link>
              <Link to="/interviews" className="text-[15px] text-gray-700 hover:text-gray-900">Interviews</Link>
              <Link to="/my-jobs" className="text-[15px] text-gray-700 hover:text-gray-900">My Jobs</Link>
            </div>
          </div>

          {/* Sağ: Search + Bildirim + User */}
          <div className="flex items-center gap-6">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-[260px] h-9 pl-9 pr-4 text-sm rounded-full bg-gray-100 border border-gray-200 focus:outline-none"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            </div>

            {/* Notification */}
            <button className="relative p-2 hover:bg-gray-100 rounded-full transition">
              <FaBell className="text-gray-600 text-lg" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full" />
            </button>

            {/* User */}
            <button className="bg-blue-600 text-white px-4 py-1.5 text-sm rounded-full hover:bg-blue-700 transition">
              İrem
            </button>
          </div>
        </div>
      </nav>

      {/* İçerik */}
      <div className="w-full px-4 py-6">
        <div className="max-w-[1200px] mx-auto flex gap-6">
          {/* Sol Panel - Profil */}
          <div className="w-[280px] bg-[#061A40] text-white rounded-lg p-6">
  <div className="text-center">
    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white flex items-center justify-center">
      <span className="text-3xl">👤</span>
    </div>

    <input
      type="text"
      value={userInfo.name}
      onChange={(e) => handleUserInfoChange('name', e.target.value)}
      className="text-lg font-semibold mb-1 bg-transparent text-white text-center focus:outline-none"
    />
    <input
      type="text"
      value={userInfo.jobTitle}
      onChange={(e) => handleUserInfoChange('jobTitle', e.target.value)}
      className="text-sm text-gray-300 mb-6 bg-transparent text-center focus:outline-none"
    />

    <ul className="text-left space-y-2.5 text-sm text-gray-300">
      {[
        ['Nationality', 'nationality'],
        ['Currently Working', 'isWorking'],
        ['Phone Number', 'phone'],
        ['Country, City', 'city'],
        ['Gender', 'gender'],
        ['Military Status', 'militaryStatus'],
        ['Disability Status', 'disabilityStatus'],
        ['Marital Status', 'maritalStatus'],
        ['Driving License', 'drivingLicense'],
        ['Profile Privacy', 'profilePrivacy'],
        ['Github', 'github'],
        ['Portfolio', 'portfolio'],
        ['Job Preferences', 'jobPreferences'],
        ['References', 'references'],
        ['Hobbies', 'hobbies']
      ].map(([label, key]) => (
        <li key={key} className="flex flex-col gap-1">
          <span className="text-xs font-semibold">{label}</span>
          <input
            type="text"
            value={userInfo[key]}
            onChange={(e) => handleUserInfoChange(key, e.target.value)}
            className="bg-transparent border-b border-gray-500 text-white text-sm focus:outline-none"
          />
        </li>
      ))}
    </ul>

    <button
      onClick={handleSaveUserInfo}
      className="mt-6 bg-blue-600 hover:bg-blue-700 text-white text-sm px-6 py-1.5 rounded transition"
    >
      Save
    </button>
  </div>
</div>


          {/* Sağ Panel - Bilgiler */}
          <div className="flex-1 bg-white rounded-lg p-6 space-y-6">
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Biography</h3>
              <textarea
                value={biography}
                onChange={(e) => setBiography(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                rows={4}
                placeholder="Tell us about yourself..."
              />
              <button
                onClick={() => console.log("Biography saved:", biography)}
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>



            <div className="space-y-6">

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Work Experiences</h3>

                {experiences.map((exp, index) => (
                  <div key={index} className="mb-4 border-b pb-4">
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={exp.company}
                      onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                      className="w-full border-b border-gray-300 mb-2 p-1 text-sm focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Job Title"
                      value={exp.title}
                      onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                      className="w-full border-b border-gray-300 p-1 text-sm focus:outline-none"
                    />
                  </div>
                ))}

                <div className="flex items-center gap-4">
                  <button
                    onClick={handleAddExperience}
                    className="text-sm text-blue-600 underline"
                  >
                    + Add Experience
                  </button>

                  <button
                    onClick={handleSaveExperiences}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                  >
                    Save
                  </button>
                </div>
              </div>



              <div className="mb-6">
                <h3 className="font-semibold mb-2">Education</h3>

                {educations.map((edu, index) => (
                  <div key={index} className="mb-4 border-b pb-4 space-y-2">
                    <input
                      type="text"
                      placeholder="School Name"
                      value={edu.school}
                      onChange={(e) => handleEducationChange(index, 'school', e.target.value)}
                      className="w-full border-b border-gray-300 p-1 text-sm focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Department"
                      value={edu.department}
                      onChange={(e) => handleEducationChange(index, 'department', e.target.value)}
                      className="w-full border-b border-gray-300 p-1 text-sm focus:outline-none"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Start Date"
                        value={edu.startDate}
                        onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
                        className="w-full border-b border-gray-300 p-1 text-sm focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="End Date"
                        value={edu.endDate}
                        onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
                        disabled={edu.isOngoing}
                        className="w-full border-b border-gray-300 p-1 text-sm focus:outline-none"
                      />
                    </div>
                    <label className="text-sm flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={edu.isOngoing}
                        onChange={(e) =>
                          handleEducationChange(index, 'isOngoing', e.target.checked)
                        }
                      />
                      Ongoing
                    </label>
                  </div>
                ))}

                <div className="flex items-center gap-4">
                  <button
                    onClick={handleAddEducation}
                    className="text-sm text-blue-600 underline"
                  >
                    + Add Education
                  </button>

                  <button
                    onClick={handleSaveEducation}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                  >
                    Save
                  </button>
                </div>
              </div>


              <div className="mb-6">
              <h3 className="font-semibold mb-2">Skills</h3>

              {skills.map((skill, index) => (
                <input
                  key={index}
                  type="text"
                  value={skill}
                  onChange={(e) => handleSkillChange(index, e.target.value)}
                  placeholder="Skill"
                  className="w-full border-b border-gray-300 p-1 text-sm mb-2 focus:outline-none"
                />
              ))}

              <div className="flex items-center gap-4">
                <button onClick={handleAddSkill} className="text-sm text-blue-600 underline">
                  + Add Skill
                </button>
                <button
                  onClick={handleSaveSkills}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                >
                  Save
                </button>
              </div>
            </div>

            <div className="mb-6">
            <h3 className="font-semibold mb-2">Languages</h3>

            {languages.map((lang, index) => (
              <input
                key={index}
                type="text"
                value={lang}
                onChange={(e) => handleLanguageChange(index, e.target.value)}
                placeholder="Language"
                className="w-full border-b border-gray-300 p-1 text-sm mb-2 focus:outline-none"
              />
            ))}

            <div className="flex items-center gap-4">
              <button onClick={handleAddLanguage} className="text-sm text-blue-600 underline">
                + Add Language
              </button>
              <button
                onClick={handleSaveLanguages}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
              >
                Save
              </button>
            </div>
          </div>



          <div className="mb-6">
          <h3 className="font-semibold mb-2">Certificates</h3>

          {certificates.map((cert, index) => (
            <div key={index} className="mb-4 border-b pb-4 space-y-2">
              <input
                type="text"
                placeholder="Certificate Name"
                value={cert.name}
                onChange={(e) => handleCertificateChange(index, 'name', e.target.value)}
                className="w-full border-b border-gray-300 p-1 text-sm focus:outline-none"
              />
              <input
                type="text"
                placeholder="Certificate URL (optional)"
                value={cert.url}
                onChange={(e) => handleCertificateChange(index, 'url', e.target.value)}
                className="w-full border-b border-gray-300 p-1 text-sm focus:outline-none"
              />
            </div>
          ))}

          <div className="flex items-center gap-4">
            <button onClick={handleAddCertificate} className="text-sm text-blue-600 underline">
              + Add Certificate
            </button>
            <button
              onClick={handleSaveCertificates}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
            >
              Save
            </button>
          </div>
        </div>


        <div className="mb-6">
        <h3 className="font-semibold mb-2">Exams and Achievements</h3>

        {exams.map((exam, index) => (
          <div key={index} className="mb-4 border-b pb-4 space-y-2">
            <input
              type="text"
              placeholder="Exam or Achievement Name"
              value={exam.name}
              onChange={(e) => handleExamChange(index, 'name', e.target.value)}
              className="w-full border-b border-gray-300 p-1 text-sm focus:outline-none"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Year"
                value={exam.year}
                onChange={(e) => handleExamChange(index, 'year', e.target.value)}
                className="w-1/3 border-b border-gray-300 p-1 text-sm focus:outline-none"
              />
              <input
                type="text"
                placeholder="Score (optional)"
                value={exam.score}
                onChange={(e) => handleExamChange(index, 'score', e.target.value)}
                className="w-1/3 border-b border-gray-300 p-1 text-sm focus:outline-none"
              />
              <input
                type="text"
                placeholder="Rank (optional)"
                value={exam.rank}
                onChange={(e) => handleExamChange(index, 'rank', e.target.value)}
                className="w-1/3 border-b border-gray-300 p-1 text-sm focus:outline-none"
              />
            </div>
          </div>
        ))}

        <div className="flex items-center gap-4">
          <button onClick={handleAddExam} className="text-sm text-blue-600 underline">
            + Add Exam or Achievement
          </button>
          <button
            onClick={handleSaveExams}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
          >
            Save
          </button>
        </div>
      </div>


      <div className="mb-6">
      <h3 className="font-semibold mb-2">Uploaded Documents</h3>

      <input
        type="file"
        multiple
        onChange={handleFileUpload}
        className="mb-3 text-sm"
      />

      {documents.length > 0 && (
        <ul className="space-y-2 text-sm text-gray-700 mb-4">
          {documents.map((doc, index) => (
            <li key={index} className="flex items-center justify-between border-b pb-1">
              <span>{doc.name}</span>
              <button
                onClick={() => handleRemoveDocument(index)}
                className="text-red-500 text-xs hover:underline"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={handleSaveDocuments}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
      >
        Save
      </button>
    </div>


    <div className="mb-6">
  <h3 className="font-semibold mb-2">Projects</h3>

  {projects.map((proj, index) => (
    <div key={index} className="mb-4 border-b pb-4 space-y-2">
      <input
        type="text"
        placeholder="Project Name"
        value={proj.name}
        onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
        className="w-full border-b border-gray-300 p-1 text-sm focus:outline-none"
      />
      <textarea
        placeholder="Description"
        value={proj.description}
        onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
        className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none"
        rows={3}
      />
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Start Date"
          value={proj.startDate}
          onChange={(e) => handleProjectChange(index, 'startDate', e.target.value)}
          className="w-1/2 border-b border-gray-300 p-1 text-sm focus:outline-none"
        />
        <input
          type="text"
          placeholder="End Date"
          value={proj.endDate}
          onChange={(e) => handleProjectChange(index, 'endDate', e.target.value)}
          disabled={proj.isOngoing}
          className="w-1/2 border-b border-gray-300 p-1 text-sm focus:outline-none"
        />
      </div>
      <label className="text-sm flex items-center gap-2">
        <input
          type="checkbox"
          checked={proj.isOngoing}
          onChange={(e) =>
            handleProjectChange(index, 'isOngoing', e.target.checked)
          }
        />
        Ongoing
      </label>
    </div>
  ))}

  <div className="flex items-center gap-4">
    <button onClick={handleAddProject} className="text-sm text-blue-600 underline">
      + Add Project
    </button>
    <button
      onClick={handleSaveProjects}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
    >
      Save
    </button>
  </div>
</div>




            </div>

            <div className="text-center pt-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg transition">
                Update Information
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
