import React from 'react';
import { createRoot } from 'react-dom/client';

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

function DaySelector() {
    return (
        <>
            <label htmlFor="daySelect">Day:</label>
            <select id="daySelect" defaultValue="monday">
                {days.map((day) => (
                    <option value={day} key={day}>
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                    </option>
                ))}
            </select>
        </>
    );
}

const container = document.getElementById('day-selector-root');
if (container) {
    const root = createRoot(container);
    root.render(<DaySelector />);
}

export default DaySelector;
