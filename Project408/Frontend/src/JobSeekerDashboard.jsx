// GÜNCELLENMİŞ: Sağ panelin inputları profileData yapısına bağlandı
import { FaBell, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from "axios";

export default function JobSeekerDashboard() {
  const [profileData, setProfileData] = useState({
    profileDetails: {
      aboutMe: '',
      nationality: '',
      gender: '',
      militaryStatus: '',
      militaryDefermentDate: '',
      disabilityStatus: '',
      maritalStatus: '',
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
      country: '',
      city: ''
    },
    jobPreferences: {
      preferredPositions: [{ positionType: '' }],
      preferredWorkType: '',
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
        readingLevel: '',
        writingLevel: '',
        speakingLevel: '',
        listeningLevel: ''
      }
    ],
    hobbies: [
      {
        hobbyName: '',
        description: ''
      }
    ],
    education: {
      degreeType: '',
      associateDepartment: '',
      associateStartDate: '',
      associateEndDate: '',
      associateIsOngoing: false,
      bachelorDepartment: '',
      bachelorStartDate: '',
      bachelorEndDate: '',
      bachelorIsOngoing: false,
      masterDepartment: '',
      masterStartDate: '',
      masterEndDate: '',
      masterIsOngoing: false,
      masterThesisTitle: '',
      masterThesisDescription: '',
      masterThesisUrl: '',
      doctorateDepartment: '',
      doctorateStartDate: '',
      doctorateEndDate: '',
      doctorateIsOngoing: false,
      doctorateThesisTitle: '',
      doctorateThesisDescription: '',
      doctorateThesisUrl: '',
      isDoubleMajor: false,
      doubleMajorDepartment: '',
      doubleMajorStartDate: '',
      doubleMajorEndDate: '',
      doubleMajorIsOngoing: false,
      isMinor: false,
      minorDepartment: '',
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
        employmentType: '',
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
        documentType: '',
        documentCategory: '',
        documentUrl: '',
        isPrivate: false
      }
    ],
    skills: [
      {
        skillName: '',
        skillLevel: ''
      }
    ],
    projects: [
      {
        projectName: '',
        projectDescription: '',
        projectStartDate: '',
        projectEndDate: '',
        projectStatus: '',
        isPrivate: false,
        company: ''
      }
    ]
  });

  const handleProfileFieldChange = (path, value) => {
    setProfileData((prev) => {
      const updated = { ...prev };
      let target = updated;
      for (let i = 0; i < path.length - 1; i++) {
        target = target[path[i]];
      }
      target[path[path.length - 1]] = value;
      return updated;
    });
  };

  const validateProfileData = () => {
    const requiredFields = [
      profileData.profileDetails.firstName,
      profileData.profileDetails.jobTitle,
      profileData.profileDetails.aboutMe,
      profileData.contactInformation.phoneNumber,
      profileData.education.degreeType,
      profileData.skills[0]?.skillName,
      profileData.projects[0]?.projectName
    ];
    return requiredFields.every(field => field && field.trim() !== '');
  };

  const handleSaveAllProfile = async () => {
    if (!validateProfileData()) {
      alert('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }

    try {
      const response = await axios.post("http://localhost:9090/api/profile/save", profileData);
      console.log("✅ Profile saved:", response.data);
    } catch (error) {
      console.error("❌ Error saving profile:", error.response?.data || error.message);
    }
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
      value={profileData.profileDetails.firstName}
      onChange={(e) => handleProfileFieldChange(['profileDetails', 'firstName'], e.target.value)}

      className="text-lg font-semibold mb-1 bg-transparent text-white text-center focus:outline-none"
    />
    <input
      type="text"
      value={profileData.profileDetails.jobTitle}
      onChange={(e) => handleProfileFieldChange(['profileDetails', 'jobTitle'], e.target.value)}
      className="text-sm text-gray-300 mb-6 bg-transparent text-center focus:outline-none"
    />

    <ul className="text-left space-y-2.5 text-sm text-gray-300">
  {[
    ['Nationality', ['profileDetails', 'nationality']],
    ['Currently Working', ['profileDetails', 'currentEmploymentStatus']],
    ['Phone Number', ['contactInformation', 'phoneNumber']],
    ['Country', ['contactInformation', 'country']],
    ['City', ['contactInformation', 'city']],
    ['Gender', ['profileDetails', 'gender']],
    ['Military Status', ['profileDetails', 'militaryStatus']],
    ['Disability Status', ['profileDetails', 'disabilityStatus']],
    ['Marital Status', ['profileDetails', 'maritalStatus']],
    ['Driving License', ['profileDetails', 'drivingLicense']],
    ['Profile Privacy', ['profileDetails', 'isPrivateProfile']],
    ['Github', ['socialLinks', 'githubUrl']],
    ['Portfolio', ['socialLinks', 'websiteUrl']]
  ].map(([label, path]) => (
    <li key={path.join('.')} className="flex flex-col gap-1">
      <span className="text-xs font-semibold">{label}</span>
      <input
        type="text"
        value={path.reduce((acc, curr) => acc?.[curr], profileData) || ''}
        onChange={(e) => handleProfileFieldChange(path, e.target.value)}
        className="bg-transparent border-b border-gray-500 text-white text-sm focus:outline-none"
      />
    </li>
  ))}
</ul>

    <button
      onClick={handleSaveAllProfile}
      className="mt-6 bg-blue-600 hover:bg-blue-700 text-white text-sm px-6 py-1.5 rounded transition"
    >
      Save
    </button>
  </div>
</div>


      {/* Sağ Panel - Bilgiler */}
      <div className="flex-1 bg-white rounded-lg p-6 space-y-6">
        {/* Biography */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Biography</h3>
          <textarea
            value={profileData.profileDetails.aboutMe}
            onChange={(e) => handleProfileFieldChange(['profileDetails', 'aboutMe'], e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
            rows={4}
            placeholder="Tell us about yourself..."
          />
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Phone Number</h3>
          <input
            type="text"
            value={profileData.contactInformation.phoneNumber}
            onChange={(e) => handleProfileFieldChange(['contactInformation', 'phoneNumber'], e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
            placeholder="Enter phone number"
          />
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Github URL</h3>
          <input
            type="text"
            value={profileData.socialLinks.githubUrl}
            onChange={(e) => handleProfileFieldChange(['socialLinks', 'githubUrl'], e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
            placeholder="Enter github profile url"
          />
        </div>

        {/* Work Experiences */}
        {profileData.workExperiences.map((exp, index) => (
          <div key={index} className="mb-6 border-b pb-4">
            <h3 className="font-semibold mb-2">Work Experience #{index + 1}</h3>
            <input
              type="text"
              placeholder="Company Name"
              value={exp.companyName}
              onChange={(e) => {
                const updated = [...profileData.workExperiences];
                updated[index].companyName = e.target.value;
                handleProfileFieldChange(['workExperiences'], updated);
              }}
              className="w-full border-b border-gray-300 p-1 text-sm mb-2"
            />
            <input
              type="text"
              placeholder="Job Title"
              value={exp.jobTitle}
              onChange={(e) => {
                const updated = [...profileData.workExperiences];
                updated[index].jobTitle = e.target.value;
                handleProfileFieldChange(['workExperiences'], updated);
              }}
              className="w-full border-b border-gray-300 p-1 text-sm"
            />
          </div>
        ))}

        {/* Education */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Education</h3>
          <input
            type="text"
            placeholder="Degree Type"
            value={profileData.education.degreeType}
            onChange={(e) => handleProfileFieldChange(['education', 'degreeType'], e.target.value)}
            className="w-full border-b border-gray-300 p-1 text-sm"
          />
          <input
            type="text"
            placeholder="Bachelor Department"
            value={profileData.education.bachelorDepartment}
            onChange={(e) => handleProfileFieldChange(['education', 'bachelorDepartment'], e.target.value)}
            className="w-full border-b border-gray-300 p-1 text-sm"
          />
        </div>

        {/* Skills */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Skills</h3>
          {profileData.skills.map((skill, index) => (
            <input
              key={index}
              type="text"
              value={skill.skillName}
              onChange={(e) => {
                const updated = [...profileData.skills];
                updated[index].skillName = e.target.value;
                handleProfileFieldChange(['skills'], updated);
              }}
              placeholder="Skill"
              className="w-full border-b border-gray-300 p-1 text-sm mb-2"
            />
          ))}
        </div>

        {/* Projects */}
        {profileData.projects.map((proj, index) => (
          <div key={index} className="mb-6 border-b pb-4">
            <h3 className="font-semibold mb-2">Project #{index + 1}</h3>
            <input
              type="text"
              placeholder="Project Name"
              value={proj.projectName}
              onChange={(e) => {
                const updated = [...profileData.projects];
                updated[index].projectName = e.target.value;
                handleProfileFieldChange(['projects'], updated);
              }}
              className="w-full border-b border-gray-300 p-1 text-sm"
            />
          </div>
        ))}

        {/* Certifications */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Certifications</h3>
          {profileData.certifications.map((cert, index) => (
            <input
              key={index}
              type="text"
              placeholder="Certification Name"
              value={cert.certificationName}
              onChange={(e) => {
                const updated = [...profileData.certifications];
                updated[index].certificationName = e.target.value;
                handleProfileFieldChange(['certifications'], updated);
              }}
              className="w-full border-b border-gray-300 p-1 text-sm mb-2"
            />
          ))}
        </div>

        {/* Language Proficiency */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Languages</h3>
          {profileData.languageProficiency.map((lang, index) => (
            <input
              key={index}
              type="text"
              placeholder="Language"
              value={lang.language}
              onChange={(e) => {
                const updated = [...profileData.languageProficiency];
                updated[index].language = e.target.value;
                handleProfileFieldChange(['languageProficiency'], updated);
              }}
              className="w-full border-b border-gray-300 p-1 text-sm mb-2"
            />
          ))}
        </div>

        {/* References */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">References</h3>
          {profileData.references.map((ref, index) => (
            <input
              key={index}
              type="text"
              placeholder="Reference Name"
              value={ref.referenceName}
              onChange={(e) => {
                const updated = [...profileData.references];
                updated[index].referenceName = e.target.value;
                handleProfileFieldChange(['references'], updated);
              }}
              className="w-full border-b border-gray-300 p-1 text-sm mb-2"
            />
          ))}
        </div>

        {/* Exams and Achievements */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Exams and Achievements</h3>
          {profileData.examsAndAchievements.map((exam, index) => (
            <input
              key={index}
              type="text"
              placeholder="Exam Name"
              value={exam.examName}
              onChange={(e) => {
                const updated = [...profileData.examsAndAchievements];
                updated[index].examName = e.target.value;
                handleProfileFieldChange(['examsAndAchievements'], updated);
              }}
              className="w-full border-b border-gray-300 p-1 text-sm mb-2"
            />
          ))}
        </div>

        <div className="text-center pt-4">
          <button
            onClick={handleSaveAllProfile}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg transition"
          >
            Update Information
          </button>
        </div>

      </div>
    </div>
    </div>
    </div>
  );
}
