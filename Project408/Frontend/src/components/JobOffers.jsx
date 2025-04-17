import { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaBuilding, FaCalendarAlt, FaMoneyBillWave, FaMapMarkerAlt } from 'react-icons/fa';

export default function JobOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [respondingToOffer, setRespondingToOffer] = useState(null);
  const [responseSuccess, setResponseSuccess] = useState(false);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:9090/api/job-offer/my-offers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch offers');
      }

      const data = await response.json();
      setOffers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRespondToOffer = async (offerId, accept) => {
    try {
      setRespondingToOffer(offerId);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:9090/api/job-adv/offer/${offerId}/respond?accept=${accept}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to respond to offer');
      }

      // Update the offer status in the UI
      setOffers(offers.map(offer => 
        offer.id === offerId 
          ? { ...offer, status: accept ? 'ACCEPTED' : 'REJECTED' } 
          : offer
      ));
      
      setResponseSuccess(true);
      setTimeout(() => {
        setResponseSuccess(false);
      }, 3000);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setRespondingToOffer(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'Not specified';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Job Offers</h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 mb-6 rounded-md">
            {error}
          </div>
        )}
        
        {responseSuccess && (
          <div className="bg-green-50 text-green-600 p-4 mb-6 rounded-md">
            Your response has been submitted successfully!
          </div>
        )}

        {offers.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
              <FaMoneyBillWave className="h-full w-full" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No job offers yet</h3>
            <p className="text-gray-500">When employers send you job offers, they'll appear here</p>
          </div>
        ) : (
          <div className="space-y-6">
            {offers.map((offer) => (
              <div key={offer.id} className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-4 border-b">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">
                      {offer.jobTitle || 'Job Offer'}
                    </h3>
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(offer.status)}`}>
                      {offer.status}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <FaBuilding className="mr-1" /> 
                    {offer.companyName || 'Company'}
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center">
                      <FaMoneyBillWave className="text-gray-400 mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Salary Offer</p>
                        <p className="font-medium">{formatCurrency(offer.salaryOffer)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-gray-400 mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Start Date</p>
                        <p className="font-medium">{formatDate(offer.startDate)}</p>
                      </div>
                    </div>
                    
                    {offer.location && (
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="text-gray-400 mr-2" />
                        <div>
                          <p className="text-xs text-gray-500">Location</p>
                          <p className="font-medium">{offer.location}</p>
                        </div>
                      </div>
                    )}
                    
                    {offer.workHours && (
                      <div className="flex items-center">
                        <div className="text-gray-400 mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Work Hours</p>
                          <p className="font-medium">{offer.workHours}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {offer.benefits && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-1">Benefits & Details</h4>
                      <p className="text-gray-600 text-sm whitespace-pre-line">{offer.benefits}</p>
                    </div>
                  )}
                  
                  {offer.status === 'PENDING' && (
                    <div className="mt-4 flex space-x-3">
                      <button
                        onClick={() => handleRespondToOffer(offer.id, true)}
                        disabled={respondingToOffer === offer.id}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300"
                      >
                        <FaCheck className="mr-2" /> Accept Offer
                      </button>
                      <button
                        onClick={() => handleRespondToOffer(offer.id, false)}
                        disabled={respondingToOffer === offer.id}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:text-gray-400"
                      >
                        <FaTimes className="mr-2" /> Decline
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 