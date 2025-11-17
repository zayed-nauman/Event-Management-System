import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CheckInPanel = () => {
    const [attendees, setAttendees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttendees = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/attendees');
                setAttendees(response.data);
            } catch (error) {
                console.error('Error fetching attendees:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAttendees();
    }, []);

    const handleCheckIn = async (id) => {
        try {
            await axios.post(`http://localhost:5000/api/attendees/${id}/checkin`);
            setAttendees(attendees.map(attendee => 
                attendee.id === id ? { ...attendee, checked_in: true } : attendee
            ));
        } catch (error) {
            console.error('Error checking in attendee:', error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2>Check-In Panel</h2>
            <ul>
                {attendees.map(attendee => (
                    <li key={attendee.id}>
                        {attendee.name} 
                        {attendee.checked_in ? (
                            <span> - Checked In</span>
                        ) : (
                            <button onClick={() => handleCheckIn(attendee.id)}>Check In</button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CheckInPanel;