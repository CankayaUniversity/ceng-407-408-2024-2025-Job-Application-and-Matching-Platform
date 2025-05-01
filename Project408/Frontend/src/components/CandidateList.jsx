import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Collapse } from 'react-collapse'; // react-collapse ile açılıp kapanabilen alanlar

function CandidateList() {
    const [applications, setApplications] = useState([]);
    const [expandedIndex, setExpandedIndex] = useState(null); // Hangi başvuru detayının açıldığını takip eder
    const { jobAdvId } = useParams(); // URL parametresinden jobAdvId'yi alıyoruz
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchApplications(jobAdvId);
    }, [jobAdvId]);

    const fetchApplications = async (jobAdvId) => {
        console.log('gelen ' + jobAdvId);

        try {
            const response = await axios.get(`http://localhost:9090/api/job-adv/application/${jobAdvId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
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

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Başvurular</h2>
            {applications.length > 0 ? (
                applications.map((app, index) => (
                    <div key={index} className="border p-4 mb-4 rounded shadow bg-gray-100">
                        <div
                            onClick={() => toggleExpand(index)}
                            className="cursor-pointer text-xl font-semibold text-blue-600"
                        >
                            {app.candidate?.firstName} {app.candidate?.lastName} Başvurusu
                        </div>

                        <Collapse isOpened={expandedIndex === index}>
                            <div className="mt-4">
                                {/* Sertifikalar */}
                                <div className="mb-4">
                                    <h3 className="font-semibold">Sertifikalar</h3>
                                    {app.candidate?.certifications && app.candidate.certifications.length > 0 ? (
                                        app.candidate.certifications.map((certification, certIndex) => (
                                            <div key={certIndex} className="mb-2">
                                                {certification.certificationName && <p><strong>Sertifika Adı:</strong> {certification.certificationName}</p>}
                                                {certification.certificationUrl &&
                                                    <p><strong>Sertifika Linki:</strong> <a href={certification.certificationUrl} target="_blank" rel="noopener noreferrer">Bağlantı</a></p>}
                                                {certification.certificateValidityDate && <p><strong>Geçerlilik Tarihi:</strong> {certification.certificateValidityDate}</p>}
                                                {certification.issuedBy && <p><strong>Verilen Kurum:</strong> {certification.issuedBy}</p>}
                                            </div>
                                        ))
                                    ) : (
                                        <p>Bilgi yok</p>
                                    )}
                                </div>

                                {/* İş Deneyimleri */}
                                <div className="mb-4">
                                    <h3 className="font-semibold">İş Deneyimleri</h3>
                                    {app.candidate?.workExperiences && app.candidate.workExperiences.length > 0 ? (
                                        app.candidate.workExperiences.map((experience, expIndex) => (
                                            <div key={expIndex} className="mb-2">
                                                {experience.companyName && <p><strong>Şirket Adı:</strong> {experience.companyName}</p>}
                                                {experience.industry && <p><strong>Sektör:</strong> {experience.industry}</p>}
                                                {experience.jobTitle && <p><strong>Pozisyon:</strong> {experience.jobTitle}</p>}
                                                {experience.jobDescription && <p><strong>İş Tanımı:</strong> {experience.jobDescription}</p>}
                                                {experience.employmentType && <p><strong>Çalışma Türü:</strong> {experience.employmentType}</p>}
                                                {experience.startDate && <p><strong>Başlangıç Tarihi:</strong> {experience.startDate}</p>}
                                                {experience.endDate && <p><strong>Bitiş Tarihi:</strong> {experience.endDate}</p>}
                                                <p><strong>Devam Ediyor:</strong> {experience.isGoing ? 'Evet' : 'Hayır'}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>Bilgi yok</p>
                                    )}
                                </div>
                            </div>
                        </Collapse>
                    </div>
                ))
            ) : (
                <p>Başvuru bulunamadı.</p>
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
