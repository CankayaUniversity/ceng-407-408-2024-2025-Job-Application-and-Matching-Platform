import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaEye, FaSearch, FaMapMarkerAlt, FaBriefcase, FaCalendarAlt, FaUserFriends, FaMoneyBillWave } from 'react-icons/fa';

export default function JobListings() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });
  
  // activeFilter will now be an object to hold multiple filter aspects
  const [filters, setFilters] = useState({
    status: 'ALL', // 'ALL', 'ACTIVE', 'EXPIRED'
    workType: 'ALL', // 'ALL', 'REMOTE', 'OFFICE', 'HYBRID'
    // Add more specific filters here if needed, e.g., minSalary, maxSalary
  });

  // Combined function to fetch and filter jobs from backend
  const applyEmployerFilters = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams();

      if (searchTerm) {
        queryParams.append('positionName', searchTerm);
      }
      if (filters.status && filters.status !== 'ALL') {
        queryParams.append('status', filters.status);
      }
      if (filters.workType && filters.workType !== 'ALL') {
        // Backend expects OFFICE for onsite
        const backendWorkType = filters.workType === 'ONSITE' ? 'OFFICE' : filters.workType;
        queryParams.append('workType', backendWorkType);
      }
      // Add other filters to queryParams here if they are added to the state

      const response = await fetch(`http://localhost:9090/api/job-adv/my-jobadvs?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch job listings: ${errorText || response.status}`);
      }

      const data = await response.json();
      setJobs(data);
      if (data.length === 0) setError('No job listings match your filters.');
      else setError(''); // Clear error if jobs are found

    } catch (err) {
      setError(err.message);
      setJobs([]); // Clear jobs on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    applyEmployerFilters(); // Fetch on initial load and when filters change
  }, [searchTerm, filters]); // Re-fetch when searchTerm or filters change

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:9090/api/job-adv/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete job listing');
      }

      // Update jobs state after successful deletion
      setJobs(jobs.filter(job => job.id !== id));
      setDeleteConfirm({ show: false, id: null });
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (deadline) => {
    if (!deadline) return 'bg-gray-100 text-gray-800';
    return new Date(deadline) > new Date() 
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  const getStatusText = (job) => { // Modified to take the whole job DTO
    if (!job.active) return 'Inactive'; // If manually set to inactive
    if (!job.lastDate) return 'Active (No Deadline)';
    return new Date(job.lastDate) > new Date() ? 'Active' : 'Expired';
  };

  const getWorkTypeStyle = (workType) => {
    switch (workType) {
      case 'REMOTE':
        return 'bg-indigo-100 text-indigo-800';
      case 'ONSITE':
        return 'bg-amber-100 text-amber-800';
      case 'HYBRID':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatSalaryRange = (min, max) => {
    if (!min && !max) return "Salary not specified";
    if (min && !max) return `${min}₺+`;
    if (!min && max) return `Up to ${max}₺`;
    return `${min}₺ - ${max}₺`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const filteredJobs = jobs; // Data is now pre-filtered by backend

  return (
    <div className="bg-white rounded-lg">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">İş İlanları</h2>
          <button
            onClick={() => navigate('/employer/jobs/create')}
            className="flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 w-full sm:w-auto transition duration-150"
          >
            <FaPlus className="mr-2" /> Yeni İlan Oluştur
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 mb-6 rounded-md">
            {error}
          </div>
        )}

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
          <button 
            onClick={() => setFilters(prev => ({...prev, status: 'ALL', workType: 'ALL'}))} // Reset all relevant filters
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filters.status === 'ALL' && filters.workType === 'ALL' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } transition-colors duration-200`}
          >
            Tümünü Göster
          </button>
          <button 
            onClick={() => setFilters(prev => ({...prev, status: 'ACTIVE'}))}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filters.status === 'ACTIVE' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } transition-colors duration-200`}
          >
            Aktif İlanlar
          </button>
          <button 
            onClick={() => setFilters(prev => ({...prev, status: 'EXPIRED'}))}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filters.status === 'EXPIRED' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } transition-colors duration-200`}
          >
            Süresi Dolmuş
          </button>
          <button 
            onClick={() => setFilters(prev => ({...prev, workType: 'REMOTE'}))}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filters.workType === 'REMOTE' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } transition-colors duration-200`}
          >
            Remote
          </button>
          <button 
            onClick={() => setFilters(prev => ({...prev, workType: 'ONSITE'}))} // ONSITE will be mapped to OFFICE for backend
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filters.workType === 'ONSITE' 
                ? 'bg-amber-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } transition-colors duration-200`}
          >
            Ofis
          </button>
          <button 
            onClick={() => setFilters(prev => ({...prev, workType: 'HYBRID'}))}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filters.workType === 'HYBRID' 
                ? 'bg-emerald-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } transition-colors duration-200`}
          >
            Hybrid
          </button>
          {/* Remove other specific filter buttons unless new state fields are added for them */}
          {/* Example: 
          <input 
            type="number" 
            placeholder="Min Salary" 
            onChange={e => setFilters(prev => ({...prev, minSalary: e.target.value}))} 
            className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500" 
          /> 
          */}
        </div>

        {/* Search bar - uses searchTerm state, triggers useEffect */}
        <div className="mb-8 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="İş ilanlarında ara..."
            className="pl-12 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
          />
        </div>

        {/* Filter button */}
        <div className="flex justify-center mb-8">
          <button 
            onClick={applyEmployerFilters} // Explicit filter button if needed, though useEffect handles changes too
            className="px-6 py-2.5 rounded-lg text-sm font-medium bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-200"
          >
            Filtrele (Yenile)
          </button>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz iş ilanı yok</h3>
            <p className="text-gray-500 mb-6">İlk iş ilanınızı oluşturarak başlayın</p>
            <button
              onClick={() => navigate('/employer/jobs/create')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              <FaPlus className="mr-2" /> İlan Oluştur
            </button>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Arama kriterlerinize uygun iş ilanı bulunamadı</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <div 
                key={job.id} 
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 100%)',
                  backgroundSize: 'cover'
                }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900 truncate">{job.jobPositions && job.jobPositions.length > 0 ? (job.jobPositions[0].positionType === 'OTHER' ? job.jobPositions[0].customJobPosition?.positionName : job.jobPositions[0].positionType?.replace('_', ' ')) : 'Job Title Not Available'}</h3>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(job.lastDate)}`}>
                      {getStatusText(job)}
                    </span>
                  </div>
                  
                  <div className="mb-1">
                    <div className="text-sm text-gray-800 font-medium">
                      {job.companyName || '-'}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 my-3">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getWorkTypeStyle(job.workType)}`}>
                      {job.workType || 'REMOTE'}
                    </span>
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {job.employmentType?.replace('_', ' ') || 'FULL TIME'}
                    </span>
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center text-gray-700">
                      <FaMapMarkerAlt className="mr-2 text-gray-500" />
                      <span className="text-sm">{job.location || 'Remote'}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-700">
                      <FaMoneyBillWave className="mr-2 text-gray-500" />
                      <span className="text-sm">{formatSalaryRange(job.minSalary, job.maxSalary)}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-700">
                      <FaCalendarAlt className="mr-2 text-gray-500" />
                      <span className="text-sm">Son Başvuru: {formatDate(job.deadline || new Date())}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-700">
                      <FaUserFriends className="mr-2 text-gray-500" />
                      <Link 
                        to={`/employer/jobs/${job.id}/applications`}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        {job.applicationCount || 0} başvuru
                      </Link>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between">
                    <Link 
                      to={`/employer/jobs/${job.id}`}
                      className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
                    >
                      <FaEye className="mr-1" /> Görüntüle
                    </Link>
                    
                    <div className="flex space-x-3">
                      <Link 
                        to={`/employer/jobs/${job.id}/edit`}
                        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit className="mr-1" /> Düzenle
                      </Link>
                      
                      <button
                        onClick={() => setDeleteConfirm({ show: true, id: job.id })}
                        className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-800"
                      >
                        <FaTrash className="mr-1" /> Sil
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      İlanı Sil
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Bu iş ilanını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => handleDelete(deleteConfirm.id)}
                >
                  Sil
                </button>
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setDeleteConfirm({ show: false, id: null })}
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 