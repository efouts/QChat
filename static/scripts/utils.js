function utils() {
    this.format12HourTime = function format12HourTime(dateTime) {
        var hours = dateTime.getHours();
        var ampm = 'AM';

        if (hours >= 12) {
            ampm = 'PM';
            hours -= 12;
        }

        if (hours === 0)
            hours = 12;

        var minutes = dateTime.getMinutes();
        if (minutes < 10)
            minutes = '0' + minutes;

        var seconds = dateTime.getSeconds();
        if (seconds < 10)
            seconds = '0' + seconds;

        return hours + ':' + minutes + ':' + seconds + ' ' + ampm;
    }
};