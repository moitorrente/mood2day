const url = new URL(window.location.href);
const weekDay = document.getElementById('weekday');
const stringDate = document.getElementById('string-date');
const options = document.getElementsByName('options');
const next = document.getElementById('next');
const prev = document.getElementById('prev');
let date = url.searchParams.get("date") || new Date().toISOString().split('T')[0];
let calendarDate = date;

options.forEach(option => option.addEventListener('input', () => {
    localStorage.setItem(date, getSelectedOption());
    createMonth(date)
}));


next.addEventListener('click', () => {
    date = getDay(date, 1);
    createMonth(date)
    displayInfo(date);
});
prev.addEventListener('click', () => {
    date = getDay(date, -1);
    createMonth(date)
    displayInfo(date);
});

displayInfo(date);

function displayInfo(date) {
    const descriptions = getCalendarLiteral(date);
    weekDay.innerHTML = descriptions.weekday;
    stringDate.innerHTML = descriptions.date;
    checkOption(retrieveOption(date));
}

function getSelectedOption() {
    return document.querySelector('input[name="options"]:checked').value;
}

function retrieveOption(date) {
    return localStorage.getItem(date) || 5;
}

function checkOption(option) {
    options[option].checked = true;
}

//---------------------------------------------------------------------------------
const nextMonth = document.getElementById('next-month');
const prevMonth = document.getElementById('prev-month');
const calendarDays = document.getElementById('cal-days');

const monthName = document.getElementById('month-name');
const yearName = document.getElementById('year-name');

createMonth(date);


nextMonth.addEventListener('click', () => {
    let d = new Date(calendarDate)
    var newDate = new Date(d.setMonth(d.getMonth() + 1));
    calendarDate = newDate.toISOString().split('T')[0];
    createMonth(calendarDate);
});
prevMonth.addEventListener('click', () => {
    let d = new Date(calendarDate)
    var newDate = new Date(d.setMonth(d.getMonth() - 1));
    calendarDate = newDate.toISOString().split('T')[0];
    createMonth(calendarDate);
});

function createMonth(dateu) {
    const month = monthInfo(dateu);
    calendarDays.innerHTML = null;

    for (let i = 0; i < month.firstDayIndex - 1; i++) {
        let placeholder = document.createElement('button');
        placeholder.classList.add('btn', 'cal-btn');
        placeholder.setAttribute('disabled', '')
        calendarDays.appendChild(placeholder);
    }
    for (let i = 0; i < month.numberDays; i++) {
        const day = document.createElement('button');
        day.classList.add('btn', 'cal-btn');
        day.innerHTML = i + 1;
        day.setAttribute('date', getDay(month.firstDay, i));
        day.setAttribute('data-bs-dismiss', 'modal');
        const saved = localStorage.getItem(day.getAttribute('date'));

        let backgroud;
        switch (saved) {
            case '0':
                backgroud = 'bg-success';
                break;
            case '1':
                backgroud = 'bg-info'
                break;
            case '2':
                backgroud = 'bg-warning'
                break;
            case '3':
                backgroud = 'bg-danger'
                break;
            case '4':
                backgroud = 'bg-dark'
                break;
        }
        if (backgroud) day.classList.add(backgroud, 'text-white');

        day.addEventListener('click', () => {
            date = day.getAttribute('date');
            displayInfo(date);
        });
        calendarDays.appendChild(day);
    }

    const total = month.firstDayIndex + month.numberDays;
    const remaining = 42 - total;

    for (let i = 0; i < remaining; i++) {
        const placeholder = document.createElement('button');
        placeholder.classList.add('btn', 'cal-btn');
        placeholder.setAttribute('disabled', '')
        calendarDays.appendChild(placeholder);
    }

    monthName.innerHTML = month.name;
    yearName.innerHTML = month.year;
}

const today = document.getElementById('today');
today.addEventListener('click', () => {
    date = new Date().toISOString().split('T')[0];
    displayInfo(date);

})
