const url = new URL(window.location.href);
const weekDay = document.getElementById('weekday');
const stringDate = document.getElementById('string-date');
const options = document.getElementsByName('options');
const sharedData = url.searchParams.get("data");
const calendarDays = document.querySelectorAll('.cal-days');
const monthAb = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

let date = url.searchParams.get("date") || new Date().toISOString().split('T')[0];
let calendarDate = date;
let mode = 'light';

const calendarBigBar = document.getElementById('calendar-big-bar');
const resumeHolder = document.querySelectorAll('.resume-holder');

const getSelectedOption = () => document.querySelector('input[name="options"]:checked').value;
const retrieveOption = (date) => localStorage.getItem(date) ? localStorage.getItem(date)[0] : 5;
const retrieveText = (date) => localStorage.getItem(date) ? localStorage.getItem(date).substring(1) : '';
const checkOption = (option) => options[option].checked = true;
const deleteBar = (parent) => parent.innerHTML = null;
const resume = document.getElementById('resume');
const resumeLength = document.getElementById('resume-length');

resume.oninput = () => {
    resumeLength.innerHTML = `${resume.value.length}/100`;
    localStorage.setItem(date, getSelectedOption() + resume.value);
};

options.forEach(option => option.oninput = () => {
    localStorage.setItem(date, getSelectedOption() + resume.value);
    createMonth(date);
});

document.getElementById('next').onclick = () => {
    date = getDay(date, 1);
    createMonth(date)
    displayInfo(date);
};

document.getElementById('prev').onclick = () => {
    date = getDay(date, -1);
    createMonth(date)
    displayInfo(date);
};

function displayInfo(date) {
    const descriptions = getCalendarLiteral(date);
    weekDay.innerHTML = descriptions.weekday;
    stringDate.innerHTML = descriptions.date;
    resume.value = retrieveText(date);
    resumeLength.innerHTML = `${resume.value.length}/100`;
    checkOption(retrieveOption(date));
}
displayInfo(date);

const monthName = document.querySelectorAll('.month-name');
const yearName = document.querySelectorAll('.year-name');

document.querySelectorAll('.next-month').forEach(button => {
    button.onclick = () => {
        const d = new Date(calendarDate)
        const newDate = new Date(d.setMonth(d.getMonth() + 1));
        calendarDate = newDate.toISOString().split('T')[0];
        createMonth(calendarDate);
    }
});

document.querySelectorAll('.prev-month').forEach(button => {
    button.onclick = () => {
        const d = new Date(calendarDate)
        const newDate = new Date(d.setMonth(d.getMonth() - 1));
        calendarDate = newDate.toISOString().split('T')[0];
        createMonth(calendarDate);
    }
});

createMonth(date);

function createPlaceholder(num) {
    for (let i = 0; i < num; i++) {
        const placeholder = document.createElement('button');
        placeholder.setAttribute('disabled', '');
        placeholder.classList.add('btn', 'cal-btn');
        calendarDays.forEach(calendar => calendar.appendChild(placeholder.cloneNode(true)));
    }
}


function createYear(firstDay) {
    const yearReview = document.querySelectorAll('.year-review');
    yearReview.forEach(review => review.innerHTML = null);
    const monthsFirst = monthsFirstDay(firstDay);

    let yearValues = [];

    const p = document.createElement('p');
    p.style = 'font-size: xx-small';
    p.classList.add('m-0');

    for (let i = 0; i < monthsFirst.length; i++) {
        const month = monthInfo(monthsFirst[i]);
        p.innerHTML = monthAb[i];
        yearReview.forEach(review => review.appendChild(p.cloneNode(true)));
        for (let i = 0; i < month.numberDays; i++) {
            const tempDay = getDay(month.firstDay, i)
            const day = document.createElement('button');
            day.classList.add('btn', 'year-btn', 'position-relative');
            day.setAttribute('date', tempDay);
            const saved = retrieveOption(day.getAttribute('date'));
            if (saved != 5) yearValues.push(saved);
            let backgroud = 'bg-secondary';
            backgroud = saved == 5 ? 'bg-secondary' : `bg-${saved}`;
            day.innerHTML = `<span class="position-absolute ${backgroud} rounded-circle" style="width: .5em; height: .5em;top: 25%;left: 150%"></span>`;
            yearReview.forEach(review => review.appendChild(day.cloneNode(true)));
        }
        for (let i = 0; i < 31 - month.numberDays; i++) {
            const day = document.createElement('button');
            day.classList.add('btn', 'year-btn', 'position-relative');
            day.innerHTML =
                `<span class="position-absolute bg-none" style="width: .5em; height: .5em;top: 25%;"></span>`;
            yearReview.forEach(review => review.appendChild(day.cloneNode(true)));
        }
    }

    const yearSum = yearValues.reduce(function (obj, b) {
        obj[b] = ++obj[b] || 1;
        return obj;
    }, []);

    //Refactor
    for (let i = 5; i < 10; i++) {
        yearSum[i - 5] ? resumeHolder[i].childNodes[1].innerHTML = yearSum[i - 5] : resumeHolder[i].childNodes[1].innerHTML = '0';
    }
}

function createMonth(dateu) {
    createYear(date);
    const month = monthInfo(dateu);
    calendarDays.forEach(calendar => calendar.innerHTML = null)
    let monthValues = [];
    createPlaceholder(month.firstDayIndex - 1)

    for (let i = 0; i < month.numberDays; i++) {
        const day = document.createElement('button');
        if (mode == 'light') {
            day.classList.add('btn', 'cal-btn', 'text-dark', 'position-relative');
        } else {
            day.classList.add('btn', 'cal-btn', 'text-white', 'position-relative');
        }
        day.innerHTML = i + 1;
        day.setAttribute('date', getDay(month.firstDay, i));
        const saved = retrieveOption(day.getAttribute('date'));
        let backgroud;
        if (saved) {
            monthValues.push(saved);
            backgroud = `bg-${saved}`
        }

        if (backgroud) {
            day.innerHTML = `
            <span class="position-absolute" style="top: 10%;">${i + 1}</span>
            <span class="position-absolute ${backgroud} rounded-circle" style="width: .5em; height: .5em;top: 60%;"></span>`;
        } else {
            day.innerHTML = `<span class="position-absolute" style="top: 10%;">${i + 1}</span>`;
        }

        if (date == day.getAttribute('date')) day.classList.add('btn-outline-secondary');

        calendarDays.forEach((calendar, i) => {
            if (i > 0) day.setAttribute('data-bs-dismiss', 'modal');
            const clone = day.cloneNode(true);
            clone.onclick = () => {
                date = day.getAttribute('date');
                displayInfo(date);
                createMonth(date)
            }
            calendar.appendChild(clone);
        });
    }

    const monthSum = monthValues.reduce(function (obj, b) {
        obj[b] = ++obj[b] || 1;
        return obj;
    }, []);

    createBar(calendarBigBar, 'bar', monthSum, month.numberDays);

    for (let i = 0; i < 5; i++) monthSum[i] ? resumeHolder[i].childNodes[1].innerHTML = monthSum[i] : resumeHolder[i].childNodes[1].innerHTML = '0';

    createPlaceholder(42 - (month.firstDayIndex + month.numberDays));
    monthName.forEach(container => container.innerHTML = month.name);
    yearName.forEach(container => container.innerHTML = month.year);
}

function createBar(parent, name, number, numberDays) {
    deleteBar(parent);
    const backgrouds = ['bg-0', 'bg-1', 'bg-2', 'bg-3', 'bg-4'];
    const group = document.createElement('div');
    group.classList.add('progress', 'my-3');
    group.setAttribute('id', 'month-recap');

    for (let i = 0; i < 5; i++) {
        const bar = document.createElement('div');
        bar.classList.add('progress-bar', backgrouds[i]);
        bar.setAttribute('aria-valuemax', '100', 'role', 'progressbar', 'name', name, 'aria-valuemin', '0');
        bar.style = `width: ${number[i] / numberDays * 100}%`;
        number[i] ? bar.innerHTML = number[i] : bar.innerHTML;
        group.appendChild(bar);
    }
    parent.appendChild(group);
}

const today = document.getElementById('today');
today.onclick = () => displayInfo(new Date().toISOString().split('T')[0]);

//----------------------------------------------------------
// const download = document.getElementById('download');
// const upload = document.getElementById('upload');
// const uploadFile = document.getElementById('upload-file');

// download.addEventListener('click', () => {
//     const d = new Date().toISOString().split('T')[0];
//     saveTextAsFile(JSON.stringify(localStorage), `mood2day-${d}.txt`)
// });

function downloadData() {
    const d = new Date().toISOString().split('T')[0];
    saveTextAsFile(JSON.stringify(localStorage), `mood2day-${d}.txt`);
}

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

// upload.addEventListener('click', () => {
//     uploadFile.click();
// });

// uploadFile.addEventListener('change', (event) => {
//     const fileList = event.target.files;
//     getAsText(fileList[0])
// });

// function getAsText(fileToRead) {
//     const reader = new FileReader();
//     reader.readAsText(fileToRead);
//     reader.onload = (event) => {
//         const file = event.target.result;
//         loadLocalStorage(file)
//     };
//     reader.onerror = errorHandler;
// }

function loadLocalStorage(data) {
    localStorage.clear();
    const parsed = Object.entries(JSON.parse(data));
    try {
        parsed.forEach(day => {
            if (isValidData(day[0], day[1])) localStorage.setItem(day[0], day[1]);
        });
        createMonth(date);
        displayInfo(date);
    } catch (e) {
        alert(e)
    }
}
const errorHandler = (evt) => evt.target.error.name == 'NotReadableError' ? alert('No se puede leer el fichero') : alert(evt);

function isValidData(day, value) {
    const validDate = Date.parse(day);
    const validValue = value.length == 1 && !isNaN(parseInt(value));
    return validDate && validValue;
}

const changeMode = () => mode == 'light' ? darkMode() : lightMode();
const theme = document.getElementById('theme');
theme.onclick = changeMode;

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
    const dark2 = document.querySelectorAll('.dark-mode-2');
    dark2.forEach(x => x.classList.remove('dark-mode-2'));
    const dark3 = document.querySelectorAll('.dark-mode-3');
    dark3.forEach(x => x.classList.remove('dark-mode-3'));

    theme.innerHTML =
        `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-moon-fill" viewBox="0 0 16 16" id="theme">
            <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z" />
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
    theme.innerHTML =
        `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-brightness-high-fill" viewBox="0 0 16 16" id="theme">
            <path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
         </svg>`;

    const modal = document.querySelectorAll('.modal-content');
    modal.forEach(x => x.classList.add('dark'));

    const textMuted = document.querySelectorAll('.text-muted');
    textMuted.forEach(x => x.classList.remove('text-muted'));
    textMuted.forEach(x => x.classList.add('text-not-muted'));

    const listGroupItem = document.querySelectorAll('.list-group-item');
    listGroupItem.forEach(x => x.classList.add('dark-mode-2'));
    const formControl = document.querySelectorAll('.form-control');
    formControl.forEach(x => x.classList.add('dark-mode-3'));
}

// const deleteData = document.getElementById('delete');
// deleteData.addEventListener('click', () => {

//     if (confirm("¿Quieres borrar los datos")) {
//         localStorage.clear();
//         createMonth(date);
//         displayInfo(date);
//     }
// });

//-----------------------------------------

// if (sharedData) {
//     let result = window.confirm('Quieres cargar la información compartida? Esto eliminará tu información actual.');
//     if (result) loadLocalStorage(atob(sharedData));
// }
// const shareButton = document.getElementById('share');

// shareButton.addEventListener('click', async () => {
//     const shareData = {
//         title: 'mood2day',
//         text: 'mood2day',
//         url: `https://moitorrente.github.io/mood2day?data=${btoa(JSON.stringify(localStorage))}`
//     }
//     try {
//         await navigator.share(shareData)
//     } catch (err) {
//         alert(err)
//     }
// });
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    mode = 'dark';
    darkMode();
}

window.matchMedia('(prefers-color-scheme: dark)').onchange = (event) => {
    const mode = event.matches ? "dark" : "light";
    if (mode == 'dark') darkMode();
    if (mode == 'light') lightMode();
};