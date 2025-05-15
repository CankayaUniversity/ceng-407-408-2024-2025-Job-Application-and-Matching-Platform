import React, { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css'; // Calendar'ın kendi CSS'i

const interviews = [
    {
        id: 1,
        interviewer: "Acme Inc.",
        date: "2025-05-19",
        time: "14:30",
        status: "Confirmed",
        link: "https://zoom.us/meetinglink1",
        description: "Technical Interview for Frontend Developer position."
    },
    {
        id: 2,
        interviewer: "John Doe",
        date: "2025-05-16",
        time: "10:00",
        status: "Waiting",
        link: "https://meet.google.com/meetinglink2",
        description: "Technical Interview for Frontend Developer position."
    },
    {
        id: 3,
        interviewer: "TechCorp HR",
        date: "2025-05-20",
        time: "16:00",
        status: "Cancelled",
        link: "#",
        description: "Technical Interview for Frontend Developer position."
    }
];

// Google Calendar link oluşturucu
function generateGoogleCalendarLink(interview) {
    const startDateTime = `${interview.date}T${interview.time}:00`;
    const endDateTime = `${interview.date}T${addMinutes(interview.time, 30)}:00`;

    const details = encodeURIComponent(`Interview with ${interview.interviewer}`);
    const location = encodeURIComponent(interview.link || "Online");

    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${details}&dates=${formatDate(startDateTime)}/${formatDate(endDateTime)}&details=${details}&location=${location}`;
}

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
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', options);
}

function formatReadableTime(timeString) {
    const [hour, minute] = timeString.split(":");
    return `${hour}:${minute}`;
}


export default function InterviewPage() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [filterType, setFilterType] = useState("All");
    const [selectedInterview, setSelectedInterview] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const today = new Date();

    // Geçmiş tarihleri filtreleyelim
    const upcomingInterviews = interviews.filter(interview => {
        const interviewDate = new Date(interview.date + "T" + interview.time);
        return interviewDate >= today;
    });

    // Statü filtresi
    const sortedInterviews = [...upcomingInterviews].sort((a, b) =>
        new Date(a.date + "T" + a.time) - new Date(b.date + "T" + b.time)
    );

    const filteredByStatus = filterType === "All"
        ? sortedInterviews
        : sortedInterviews.filter(i => i.status === filterType);

    const filteredInterviews = selectedDate
        ? filteredByStatus.filter(interview =>
            interview.date === selectedDate.toISOString().split("T")[0]
        )
        : filteredByStatus;

    return (
        <div style={{ padding: "20px" }}>
            <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "20px" }}>
                Scheduled Interviews
            </h1>

            {/* Filtre */}
            <div style={{ marginBottom: "20px" }}>
                <label style={{ fontWeight: "bold", marginRight: "10px" }}>Filter:</label>
                <select
                    value={filterType}
                    onChange={(e) => {
                        setFilterType(e.target.value);
                        setSelectedDate(null); // her filtre değişiminde tarih seçim sıfırlanır
                    }}
                    style={{ padding: "5px 10px", borderRadius: "5px" }}
                >
                    <option value="All">All</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Waiting">Waiting</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>

            {/* Takvim */}
            <div style={{ marginBottom: "20px" }}>
                <Calendar
                    onChange={setSelectedDate}
                    value={selectedDate}
                    tileClassName={({ date, view }) => {
                        if (view === 'month') {
                            const formatted = date.toISOString().split('T')[0];
                            const matchingInterviews = upcomingInterviews.filter(i => i.date === formatted);

                            if (matchingInterviews.length > 1) {
                                return 'highlight-multi';
                            } else if (matchingInterviews.length === 1) {
                                const interview = matchingInterviews[0];
                                if (interview.status === "Confirmed") return "highlight-confirmed";
                                if (interview.status === "Waiting") return "highlight-waiting";
                                if (interview.status === "Cancelled") return "highlight-cancelled";
                            }
                        }
                    }}
                />
            </div>

            {/* Görüşme Listesi */}
            {filteredInterviews.length === 0 ? (
                <p>No interviews scheduled for this date.</p>
            ) : (
                filteredInterviews.map(interview => (
                    <div
                        key={interview.id}
                        onClick={() => {
                            setSelectedInterview(interview);
                            setIsModalOpen(true);
                        }}
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            padding: "20px",
                            marginBottom: "20px",
                            boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
                            cursor: "pointer"
                        }}
                    >
                        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "10px" }}>
                            Interview with: {interview.interviewer}
                        </h2>
                        <p>Date: {formatReadableDate(interview.date)}</p>
                        <p>Time: {formatReadableTime(interview.time)}</p>

                        <span
                            style={{
                                padding: "6px 12px",
                                borderRadius: "20px",
                                color: "white",
                                fontSize: "14px",
                                backgroundColor:
                                    interview.status === "Confirmed"
                                        ? "green"
                                        : interview.status === "Waiting"
                                            ? "orange"
                                            : "red"
                            }}
                        >
                            {interview.status}
                        </span>
                    </div>
                ))
            )}

            {/* Modal */}
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
                        <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>
                            Interview with: {selectedInterview.interviewer}
                        </h2>
                        <p>Date: {formatReadableDate(selectedInterview.date)}</p>
                        <p>Time: {formatReadableTime(selectedInterview.time)}</p>
                        <p>Status: {selectedInterview.status}</p>

                        {selectedInterview.description && (
                            <p style={{ marginTop: "10px", fontStyle: "italic" }}>
                                {selectedInterview.description}
                            </p>
                        )}

                        {selectedInterview.status !== "Cancelled" && (
                            <>
                                <div style={{ marginTop: "20px" }}>
                                    <a
                                        href={selectedInterview.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ margin: "10px", backgroundColor: "blue", color: "white", padding: "10px 20px", borderRadius: "5px", textDecoration: "none" }}
                                    >
                                        Join Meeting
                                    </a>
                                    <a
                                        href={generateGoogleCalendarLink(selectedInterview)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ margin: "10px", backgroundColor: "green", color: "white", padding: "10px 20px", borderRadius: "5px", textDecoration: "none" }}
                                    >
                                        Add to Calendar
                                    </a>
                                </div>
                            </>
                        )}
                        <button
                            onClick={() => setIsModalOpen(false)}
                            style={{ marginTop: "20px", backgroundColor: "red", color: "white", padding: "10px 20px", borderRadius: "5px", border: "none" }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
