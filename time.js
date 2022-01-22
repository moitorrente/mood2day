const weekday = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

function getCalendarLiteral(time) {
    let date;
    if (time) {
        date = new Date(time);
    } else {
        date = new Date();
    }

    return {
        weekday: `${weekday[date.getDay()]}`,
        date: `${date.getDate()} ${months[date.getMonth()]}`
    }
}

function getDay(time, offset) {
    let date;
    time ? date = new Date(time) : date = new Date();
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
