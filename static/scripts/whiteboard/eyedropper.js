function eyedropper(context, toolbar, view) {
    var utilsObject = new utils();
    
    this.name = 'eyedropper';
    
    this.bindEvents = function bindEvents(canvas) {
        canvas.addEventListener('touchstart', getColorFromPixel, false);
        view.whiteboardCanvas.mousedown(getColorFromPixel);
    };
    
    this.unbindEvents = function unbindEvents(canvas) {
        canvas.removeEventListener('touchstart', getColorFromPixel, false);
        view.whiteboardCanvas.unbind('mousedown', getColorFromPixel);
    };
    
    var getColorFromPixel = function getColorFromPixel(event) {
        event.preventDefault();
        
        var clickPoint = utilsObject.getCanvasClickPointFromEvent(event);
        var pixelData = context.getImageData(clickPoint.x, clickPoint.y, 1, 1).data;
        toolbar.setColor('#' + utilsObject.rgbToHex(pixelData[0], pixelData[1], pixelData[2]));
    };
};