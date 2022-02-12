const weekday = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

function getCalendarLiteral(time) {
    const date = time ? new Date(time) : new Date();
    return {
        weekday: `${weekday[date.getDay()]}`,
        date: `${date.getDate()} ${months[date.getMonth()]}`
    }
}

function getYear(time){
    const date = new Date(time);
    return date.getFullYear();
}

function getDay(time, offset) {
    const date = time ? new Date(time) : new Date();
    date.setDate(date.getDate() + offset);
    return date.toISOString().split('T')[0];
}

function monthInfo(time) {
    const date = new Date(time);
    return {
        firstDayIndex: new Date(date.getFullYear(), date.getMonth(), 1).getDay(),
        firstDay: new Date(date.getFullYear(), date.getMonth(), 2).toISOString().split('T')[0],
        numberDays: new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
        name: months[date.getMonth()],
        year: date.getFullYear()
    };
}

function monthsFirstDay(time) {
    const date = new Date(new Date(time).getFullYear(), 0, 1);
    let dates = [];
    for (let i = 0; i < 12; i++) {
        dates.push(new Date(date.getFullYear(), date.getMonth() + i, 2).toISOString().split('T')[0])
    }
    return dates;
}