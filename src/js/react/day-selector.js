/* global React, ReactDOM */

function DaySelector() {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    return React.createElement(
        React.Fragment,
        null,
        React.createElement('label', { htmlFor: 'daySelect' }, 'Day:'),
        React.createElement(
            'select',
            { id: 'daySelect', defaultValue: 'monday' },
            days.map((day) => React.createElement(
                'option',
                { value: day, key: day },
                day.charAt(0).toUpperCase() + day.slice(1),
            )),
        ),
    );
}

const container = document.getElementById('day-selector-root');
if (container) {
    ReactDOM.render(React.createElement(DaySelector), container);
}
