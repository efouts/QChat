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
    
    this.getImageThumbnailDimension = function getImageThumbnailDimension(image) {
        var ratio = image.width / image.height;
        var maxWidth = 50;
        var maxHeight = 50;
        var minWidth = 50;
        var minHeight = 50;
        var width = 0;
        var height = 0;
        var padding2 = 0;
        
        if (width > maxWidth) {
            width = maxWidth;
            height = ((width - padding2) / ratio) + padding2;
        }

        if (height > maxHeight) {
            height = maxHeight;
            width = ((height - padding2) * ratio) + padding2;
        }

        if (width < minWidth) {
            width = minWidth;
            height = ((width - padding2) / ratio) + padding2;
        }

        if (height < minHeight) {
            height = minHeight;
            width = ((height - padding2) * ratio) + padding2;
        }
        
        return { width: parseInt(width), height: parseInt(height) };
    };
};