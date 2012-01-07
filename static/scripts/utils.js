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
    
    this.getPageClickPointFromEvent = function getPageClickPointFromEvent(event) {
        if (event.touches)
            return new point(event.touches[0].pageX, event.touches[0].pageY);
        else
            return new point(event.pageX, event.pageY);
    };
    
    this.getCanvasClickPointFromEvent = function getCanvasClickPointFromEvent(event) {
        var padding = 0;
        var cursorOffsetX = 3;
        var cursorOffsetY = 0;
        var pagePoint = this.getPageClickPointFromEvent(event);        
        var fancyBoxInner = event.target.offsetParent;
        var fancyBoxWrapper = fancyBoxInner.offsetParent;
        var x = pagePoint.x - fancyBoxWrapper.offsetLeft + fancyBoxInner.scrollLeft - padding - cursorOffsetX;
        var y = pagePoint.y - fancyBoxWrapper.offsetTop + fancyBoxInner.scrollTop - padding - cursorOffsetY;
        
        return new point(x, y);
    };
    
    this.rgbToHex = function rgbToHex(red, green, blue) {
        return red.toString(16) + green.toString(16) + blue.toString(16);
    };
};