const url = new URL(window.location.href);
const weekDay = document.getElementById('weekday');
const stringDate = document.getElementById('string-date');
const options = document.getElementsByName('options');
const next = document.getElementById('next');
const prev = document.getElementById('prev');
let date = url.searchParams.get("date") || new Date().toISOString().split('T')[0];
let calendarDate = date;

let mode = 'light';

options.forEach(option => option.addEventListener('input', () => {
    localStorage.setItem(date, getSelectedOption());
    createMonth(date);
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
        day.classList.add('btn', 'cal-btn', 'text-dark');
        day.innerHTML = i + 1;
        day.setAttribute('date', getDay(month.firstDay, i));
        day.setAttribute('data-bs-dismiss', 'modal');
        const saved = localStorage.getItem(day.getAttribute('date'));

        let backgroud;
        switch (saved) {
            case '0':
                backgroud = 'bg-info';
                break;
            case '1':
                backgroud = 'bg-success'
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

});

//----------------------------------------------------------
const download = document.getElementById('download');
const upload = document.getElementById('upload');
const uploadFile = document.getElementById('upload-file');

download.addEventListener('click', () => {
    const d = new Date().toISOString().split('T')[0];
    saveTextAsFile(JSON.stringify(localStorage), `mood2day-${d}.txt`)
});

function saveTextAsFile(textToWrite, fileNameToSaveAs) {
    const textFileAsBlob = new Blob([textToWrite], { type: 'text/plain' });
    const downloadLink = document.createElement('a');
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = 'Download File';
    if (window.webkitURL != null) {
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    } else {
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
    }
    downloadLink.click();
}

upload.addEventListener('click', () => {
    uploadFile.click();
});

uploadFile.addEventListener('change', (event) => {
    console.log('pasa')
    const fileList = event.target.files;

    getAsText(fileList[0])

});

function getAsText(fileToRead) {
    const reader = new FileReader();
    reader.readAsText(fileToRead);
    reader.onload = (event) => {
        const file = event.target.result;
        localStorage.clear();
        const data = Object.entries(JSON.parse(file));

        try {
            data.forEach(day => {
                if (isValidData(day[0], day[1])) localStorage.setItem(day[0], day[1]);
            });
            createMonth(date);
            displayInfo(date);


        } catch (e) {
            alert(e)
        }
    };
    reader.onerror = errorHandler;
}

function errorHandler(evt) {
    if (evt.target.error.name == 'NotReadableError') {
        alert('No se puede leer el fichero');
    } else {
        alert(evt);
    }
}

function isValidData(day, value) {
    const validDate = Date.parse(day);
    const validValue = value.length == 1 && !isNaN(parseInt(value));
    return validDate && validValue;
}

/*-----------------------------------*/

const theme = document.getElementById('theme');

theme.addEventListener('click', changeMode)

function changeMode() {
    if (mode == 'light') {
        darkMode();
    } else {
        lightMode();
    }

}

function lightMode() {
    mode = 'light';
    document.body.classList.remove('dark-mode');
    let textDark = document.querySelectorAll('.text-white');
    textDark.forEach(x => x.classList.add('text-dark'));
    textDark.forEach(x => x.classList.remove('text-white'));

    const carouselDark = document.querySelectorAll('.carousel-white');
    carouselDark.forEach(x => x.classList.remove('carousel-white'));
    carouselDark.forEach(x => x.classList.add('carousel-dark'));

    const dark = document.querySelectorAll('.dark');
    dark.forEach(x => x.classList.remove('dark'));

    theme.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
    class="bi bi-moon-fill" viewBox="0 0 16 16" id="theme">
    <path
        d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z" />
</svg>`;
}

function darkMode() {
    mode = 'dark';
    document.body.classList.add('dark-mode');
    let textDark = document.querySelectorAll('.text-dark');
    textDark.forEach(x => x.classList.remove('text-dark'));
    textDark.forEach(x => x.classList.add('text-white'));

    const carouselDark = document.querySelectorAll('.carousel-dark');
    carouselDark.forEach(x => x.classList.remove('carousel-dark'));
    carouselDark.forEach(x => x.classList.add('carousel-white'));
    theme.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-brightness-high-fill" viewBox="0 0 16 16">
    <path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
  </svg>`;

    const modal = document.querySelectorAll('.modal-content');
    modal.forEach(x => x.classList.add('dark'));

    const textMuted = document.querySelectorAll('.text-muted');
    textMuted.forEach(x => x.classList.remove('text-muted'));
    textMuted.forEach(x => x.classList.add('text-not-muted'));
}

const deleteData = document.getElementById('delete');
deleteData.addEventListener('click', () => {

    if (confirm("¿Quieres borrar los datos")) {
        localStorage.clear();
        createMonth(date);
        displayInfo(date);
    }
});

//-----------------------------------------


