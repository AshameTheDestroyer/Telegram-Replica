import React from 'react';

const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

export default function Time({
    time = { hour: 12, minute: 0, year: 2022, month: 1, day: 1 }
}) {
    time.hour ??= 12;
    time.minute ??= 0;
    time.year ??= 2022;
    time.month ??= 1;
    time.day ??= 1;

    time.hour = ClampHour(time.hour);
    time.minute = ClampMinute(time.minute);
    time.year = ClampYear(time.year);
    time.month = ClampMonth(time.month);
    time.day = ClampDay(time.day);

    function ToTwoDigit(number) {
        return number > 9 ?
            ("" + number).substring(0, 2) :
            '0' + ("" + number)[0];
    }

    function ClampHour(hour) {
        hour = Math.abs(hour);
        return hour > 24 ? 24 : hour;
    }

    function ClampMinute(minute) {
        minute = Math.abs(minute);
        return minute > 59 ? 0 : minute;
    }

    function ClampYear(year) {
        year = Math.abs(year);
        return year < 2012 ? 2012 : year > 2022 ? 2022 : year;
    }
    
    function ClampMonth(month) {
        month = Math.abs(month);
        return month > 12 ? 12 : month === 0 ? 1 : month;
    }

    function ClampDay(day) {
        day = Math.abs(day);
        let maximumDay = GetMaximumDay();
        return day > maximumDay ? maximumDay : day === 0 ? 1 : day;
    }

    function GetMaximumDay() {
        return [1, 3, 5, 7, 8, 10, 12].includes(time.month) ? 31 :
            time.month === 2 ? (time.year % 4 === 0 ? 29 : 28) : 30;
    }

    function GetTime() {
        return ToTwoDigit([0, 12].includes(time.hour) > 0 ? 12 : time.hour % 12)
            + ":" + ToTwoDigit(time.minute)
            + " " + (time.hour > 12 ? 'PM' : 'AM')
    }

    function GetDate() {
        return time.day + "/"
            + MONTHS[time.month - 1] + " (" + time.month + ")/" 
            + time.year;
    }

    function GetFullTime() {
        return GetDate + " " + GetTime();
    }

    return (
        <abbr class='time' title={GetDate()}>{ GetTime() }</abbr>
    );
}