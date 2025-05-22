import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

function addMinutes(time, minsToAdd) {
    const [h, m] = time.split(":").map(Number);
    const totalMins = h * 60 + m + minsToAdd;
    const newH = Math.floor(totalMins / 60).toString().padStart(2, '0');
    const newM = (totalMins % 60).toString().padStart(2, '0');
    return `${newH}:${newM}`;
}

function formatDate(dateTimeString) {
    return dateTimeString.replace(/[-:]/g, "").split(".")[0];
}

function formatReadableDate(dateString) {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
}

function formatReadableTime(dateString) {
    const date = new Date(dateString);
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    return `${hour}:${minute}`;
}

function generateGoogleCalendarLink(interview) {
    const start = new Date(interview.date);
    const end = new Date(start.getTime() + 30 * 60000);

    const details = encodeURIComponent(`Interview with ${interview.interviewer}`);
    const location = encodeURIComponent(interview.link || "Online");

    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${details}&dates=${formatDate(start.toISOString())}/${formatDate(end.toISOString())}&details=${details}&location=${location}`;
}

export default function InterviewPage() {
    const [interviews, setInterviews] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [filterType, setFilterType] = useState("All");
    const [selectedInterview, setSelectedInterview] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchInterviews() {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("http://localhost:9090/api/job-adv/getInterviews", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch interviews");
                }
                const data = await response.json();
                setInterviews(data);
                console.log(interviews);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchInterviews();
    }, []);

    const today = new Date();

    const upcomingInterviews = interviews.filter(interview => {
        console.log(interview.date)
        const interviewDate = new Date(interview.date);
        console.log(interview.date)
        return interviewDate >= today;
    });

    const sortedInterviews = [...upcomingInterviews].sort((a, b) =>
        new Date(a.date) - new Date(b.date)
    );

    const filteredByStatus = filterType === "All"
        ? sortedInterviews
        : sortedInterviews.filter(i => i.status.toLowerCase() === filterType.toLowerCase());

    const filteredInterviews = selectedDate
        ? filteredByStatus.filter(interview =>
            new Date(interview.date).toISOString().split("T")[0] === selectedDate.toISOString().split("T")[0]
        )
        : filteredByStatus;

    return (
        <div style={{padding: "20px"}}>
            <h1 style={{
                fontSize: "32px", fontWeight: "bold",
                marginBottom: "20px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                Scheduled Interviews
            </h1>

            {loading && <p>Loading interviews...</p>}
            {error && <p style={{color: "red"}}>Error: {error}</p>}

            <div style={{marginBottom: "20px"}}>
                <label style={{fontWeight: "bold", marginRight: "10px"}}>Filter:</label>
                <select
                    value={filterType}
                    onChange={(e) => {
                        setFilterType(e.target.value);
                        setSelectedDate(null);
                    }}
                    style={{padding: "5px 10px", borderRadius: "5px"}}
                >
                    <option value="All">All</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Waiting">Waiting</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>
            <div style={{flex: "1 1 500px", minWidth: "300px"}}>
                <div style={{marginBottom: "20px"}}>
                    <Calendar
                        locale="en-US"
                        onChange={setSelectedDate}
                        value={selectedDate}
                        tileClassName={({date, view}) => {
                            if (view === 'month') {
                                const formatted = formatReadableDate(date);
                                const matchingInterviews = upcomingInterviews.filter(i =>
                                    formatReadableDate(i.date) === formatted
                                );
                                if (matchingInterviews.length > 1) return 'highlight-multi';
                                if (matchingInterviews.length === 1) {
                                    const status = matchingInterviews[0].status;
                                    if (status === "CONFIRMED") return "highlight-confirmed";
                                    if (status === "WAITING") return "highlight-waiting";
                                    if (status === "CANCELLED") return "highlight-cancelled";
                                }
                            }
                        }}
                    />
                </div>
            </div>
            <div style={{flex: "2 1 500px", minWidth: "300px"}}>
                <div style={{display: "flex", flexWrap: "wrap", gap: "20px",}}>
                    {filteredInterviews.length === 0 ? (
                        <p>No interviews scheduled for this date.</p>
                    ) : (
                        filteredInterviews.map(interview => (
                            <div
                                key={interview.date + interview.interviewer}
                                onClick={() => {
                                    setSelectedInterview(interview);
                                    setIsModalOpen(true);
                                }}
                                style={{
                                    width: "48%", // Yarısı ve arada boşluk kalacak şekilde
                                    border: "1px solid #ddd",
                                    borderRadius: "8px",
                                    padding: "20px",
                                    marginBottom: "20px",
                                    boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
                                    cursor: "pointer"
                                }}
                            >
                                <h2 style={{fontSize: "24px", fontWeight: "600", marginBottom: "10px"}}>
                                    Interview with: {interview.interviewer}
                                </h2>
                                <p>Date: {formatReadableDate(interview.date)}</p>
                                <p>Time: {formatReadableTime(interview.date)}</p>
                                <span
                                    style={{
                                        padding: "6px 12px",
                                        borderRadius: "20px",
                                        color: "white",
                                        fontSize: "14px",
                                        backgroundColor:
                                            interview.status === "CONFIRMED"
                                                ? "green"
                                                : interview.status === "WAITING"
                                                    ? "orange"
                                                    : "red"
                                    }}
                                >
                    {interview.status}
                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>

                {isModalOpen && selectedInterview && (
                    <div style={{
                        position: "fixed",
                        top: "0",
                        left: "0",
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 9999
                    }}>
                        <div style={{
                            backgroundColor: "white",
                            padding: "30px",
                            borderRadius: "8px",
                            width: "90%",
                            maxWidth: "500px",
                            textAlign: "center"
                        }}>
                            <h2 style={{fontSize: "24px", marginBottom: "10px"}}>
                                Interview with: {selectedInterview.interviewer}
                            </h2>

                            <p>Date: {formatReadableDate(selectedInterview.date)}</p>
                            <p>Time: {formatReadableTime(selectedInterview.date)}</p>

                            <p>Status: {selectedInterview.status}</p>
                            <p>Interview Type: {selectedInterview.interviewType}</p>

                            {selectedInterview.description && (
                                <p style={{marginTop: "10px", fontStyle: "italic"}}>
                                    Job Description: {selectedInterview.description}
                                </p>
                            )}

                            {selectedInterview.notes && (
                                <p style={{marginTop: "10px"}}>
                                    Notes: {selectedInterview.notes}
                                </p>
                            )}

                            {selectedInterview.status !== "CANCELLED" && (
                                <>
                                    <div style={{marginTop: "20px"}}>
                                        {selectedInterview.link && (
                                            <a
                                                href={selectedInterview.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    margin: "10px",
                                                    backgroundColor: "blue",
                                                    color: "white",
                                                    padding: "10px 20px",
                                                    borderRadius: "5px",
                                                    textDecoration: "none"
                                                }}
                                            >
                                                Join Meeting
                                            </a>
                                        )}
                                        <a
                                            href={generateGoogleCalendarLink(selectedInterview)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                margin: "10px",
                                                backgroundColor: "green",
                                                color: "white",
                                                padding: "10px 20px",
                                                borderRadius: "5px",
                                                textDecoration: "none"
                                            }}
                                        >
                                            Add to Calendar
                                        </a>
                                    </div>
                                </>
                            )}

                            <button
                                onClick={() => setIsModalOpen(false)}
                                style={{
                                    marginTop: "20px",
                                    backgroundColor: "red",
                                    color: "white",
                                    padding: "10px 20px",
                                    borderRadius: "5px",
                                    border: "none"
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
            );
            }