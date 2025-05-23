import React, { useEffect, useState, useCallback } from 'react';

export default function AdminReportMetrics() {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchMetrics = useCallback(async () => {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('token');
        if (!token) {
            setError("Admin token not found. Please log in.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:9090/admin/report-metrics', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to fetch report metrics: ${errorText || response.status}`);
            }
            const data = await response.json();
            setMetrics(data);
        } catch (err) {
            console.error("Error fetching report metrics:", err);
            setError(err.message || "Could not fetch report metrics.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMetrics();
    }, [fetchMetrics]);

    if (loading) {
        return <p className="text-gray-600 p-4">Loading report metrics...</p>;
    }

    if (error) {
        return <p className="text-red-600 p-4">Error: {error}</p>;
    }

    if (!metrics) {
        return <p className="text-gray-700 p-4">No report metrics data available.</p>;
    }

    const MetricCard = ({ title, count, statusCounts }) => (
        <div className="bg-white shadow-lg rounded-lg p-6 min-w-[250px]">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>
            <p className="text-3xl font-bold text-gray-900">{count}</p>
            {statusCounts && (
                <div className="mt-3 text-sm text-gray-600">
                    {Object.entries(statusCounts).map(([status, num]) => (
                        <p key={status}>{status}: {num}</p>
                    ))}
                </div>
            )}
        </div>
    );
    
    const renderStatusCounts = (counts) => {
      if (!counts) return null;
      return (
        <div className="mt-3 text-sm text-gray-600">
          {Object.entries(counts).map(([status, num]) => (
            <p key={status}><span className="font-medium">{status}:</span> {num}</p>
          ))}
        </div>
      );
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Report Metrics</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <MetricCard title="Total Reports" count={metrics.totalReports} />
                <MetricCard title="Pending Reports" count={metrics.totalPendingReports} />
                <MetricCard title="Resolved Reports" count={metrics.totalResolvedReports} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">User Reports by Status</h3>
                    {renderStatusCounts(metrics.userReportCountsByStatus)}
                </div>
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Job Reports by Status</h3>
                    {renderStatusCounts(metrics.jobReportCountsByStatus)}
                </div>
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Blog Reports by Status</h3>
                    {renderStatusCounts(metrics.blogReportCountsByStatus)}
                </div>
            </div>
        </div>
    );
} 