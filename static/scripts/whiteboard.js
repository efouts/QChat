function whiteboard(view, client) {
    var canvas = document.getElementById('whiteboardCanvas');
    var context = canvas.getContext('2d');
    var points = new Array();
    var paint = false;
    var canvasHeight = 480;
    var canvasWidth = 800;
    var currentPoint = null;
    var lastPoint = null;
    var utilsObject = new utils();
    var padding = 15;
    var cursorOffset = 6;
    
    this.clearCanvas = function clearCanvas() {
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvasWidth, canvasHeight);
        points = new Array();
    };
    
    var startDrag = function startDrag(event) {
        event.preventDefault();        
        paint = true;
        points = new Array();
        addPoint(event);
        client.status(view.aliasTextBox.val(), 'drawing');
    };
    
    var addPoint = function addPoint(event) {
        var newPoint = getCanvasClickPointFromEvent(event);
        
        points.push(newPoint);
        lastPoint = currentPoint;
        currentPoint = newPoint;
        drawPoint(currentPoint, lastPoint, toolbar.getSize(), toolbar.getColor(), toolbar.getTool());
    };
    
    var getCanvasClickPointFromEvent = function getCanvasClickPointFromEvent(event) {
        var pagePoint = utilsObject.getPageClickPointFromEvent(event);        
        var fancyBoxInner = event.target.offsetParent;
        var fancyBoxWrapper = fancyBoxInner.offsetParent;
        var x = pagePoint.x - fancyBoxWrapper.offsetLeft + fancyBoxInner.scrollLeft - padding - cursorOffset;
        var y = pagePoint.y - fancyBoxWrapper.offsetTop + fancyBoxInner.scrollTop - padding - cursorOffset;
        
        return new point(x, y);
    };
    
    var drawPoint = function drawPoint(point, lastPoint, size, color, tool) {        
        context.save();
        context.beginPath();

        if (lastPoint)                     
            context.moveTo(lastPoint.x, lastPoint.y);
        else
            context.moveTo(point.x, point.y);

        context.lineTo(point.x, point.y);
        context.closePath();

        if (tool == 'eraser')
            context.strokeStyle = '#ffffff';
        else
            context.strokeStyle = color;

        context.lineJoin = 'bevel';
        context.lineWidth = parseInt(size);
        context.stroke();
        context.restore();
    };
    
    var continueDrag = function continueDrag(event) {
        event.preventDefault();
        
        if (paint == true && event.shiftKey == false) {
            addPoint(event);
            
            if (points.length == 5)
            {
                sendEdit();
                addPoint(event);
            }
        }
    };
    
    var stopDrag = function stopDrag(event) {
        if (paint == true) {
            if (event.shiftKey == true)
                addPoint(event);
                
            paint = false;
            currentPoint = null;
            lastPoint = null;
            sendEdit();
            client.status(view.aliasTextBox.val(), '');
        }
    };
    
    var sendEdit = function sendEdit() {
        if (points.length > 0) {
            var edit = new whiteboardEdit(points, toolbar.getSize(), toolbar.getColor(), toolbar.getTool());
            client.editWhiteboard(view.aliasTextBox.val(), edit);
            points = new Array();            
        };
    };
    
    this.displayActivity = function displayActivity(activity) {
        if (activity.type == 'edit-whiteboard' && activity.alias != view.aliasTextBox.val())
            addActivity(activity);
        else if (activity.type == 'clear-whiteboard')
            this.clearCanvas();
    };
    
    var addActivity = function addActivity(activity) {        
        var newPoints = new Array();
        var newPoint = null;
        var lastNewPoint = null;
        
        for (var i = 0; i < activity.edit.points.length; i++) {
            if (i > 0)
                lastNewPoint = newPoint;
                
            newPoint = new point(
                parseInt(activity.edit.points[i].x), 
                parseInt(activity.edit.points[i].y));
                
            drawPoint(newPoint, lastNewPoint, activity.edit.size, activity.edit.color, activity.edit.tool);
        }
    };
    
    var getColorFromPixel = function getColorFromPixel(event) {
        var clickPoint = getCanvasClickPointFromEvent(event);
        var pixelData = context.getImageData(clickPoint.x, clickPoint.y, 1, 1).data;
        toolbar.setColor('#' + utilsObject.rgbToHex(pixelData[0], pixelData[1], pixelData[2]));
    };    
    
    
    this.bindEventsForDrawing = function bindEventsForDrawing() {
        removeBoundedEvents();
        canvas.addEventListener('touchstart', startDrag, false);
        canvas.addEventListener('touchmove', continueDrag, false);
        canvas.addEventListener('touchend', stopDrag, false);
        canvas.addEventListener('touchcancel', stopDrag, false);

        view.whiteboardCanvas.mousedown(startDrag);
        view.whiteboardCanvas.mousemove(continueDrag);
        view.whiteboardCanvas.mouseup(stopDrag);
    };
    
    this.bindEventsForEyedropper = function bindEventsForEyedropper() {
        removeBoundedEvents();
        canvas.addEventListener('touchstart', getColorFromPixel, false);
        view.whiteboardCanvas.mousedown(getColorFromPixel);
    };
    
    var removeBoundedEvents = function removeBoundedEvents() {
        canvas.removeEventListener('touchstart', startDrag, false);
        canvas.removeEventListener('touchstart', getColorFromPixel, false);

        view.whiteboardCanvas.unbind('mousedown', startDrag);
        view.whiteboardCanvas.unbind('mousedown', getColorFromPixel);
    };
    
    $('#whiteboard').fancybox({ padding: padding });
        
    view.whiteboardCanvas.attr('height', canvasHeight);
    view.whiteboardCanvas.attr('width', canvasWidth);
    
    this.bindEventsForDrawing();
    this.clearCanvas();
    var toolbar = new whiteboardToolbar(view, this, client);
};