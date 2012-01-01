function whiteboard(view, client) {
    var canvas = document.getElementById('whiteboardCanvas');
    var context = canvas.getContext('2d');
    var currentSize = 'small';
    var currentTool = 'marker';
    var points = new Array();
    var currentColor = '#659b41';
    var paint = false;
    var canvasHeight = 480;
    var canvasWidth = 640;

    $('#whiteboard').fancybox();
    $('#markerIcon').click(function () {
        currentTool = 'marker';
    });

    $('#eraserIcon').click(function () {
        currentTool = 'eraser';
    });

    $('#deleteIcon').click(function () {
        clearCanvas();
        client.clearWhiteboard(view.aliasTextBox.val());
    });
    
    canvas.addEventListener("touchstart", startDrag, false);
    canvas.addEventListener("touchmove", continueDrag, false);
    canvas.addEventListener("touchend", stopDrag, false);
    canvas.addEventListener("touchcancel", stopDrag, false);

    view.whiteboardCanvas.mousedown(startDrag);
    view.whiteboardCanvas.mousemove(continueDrag);
    view.whiteboardCanvas.mouseup(stopDrag);
    view.whiteboardCanvas.mouseleave(stopDrag);
    
    var clearCanvas = function clearCanvas() {
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvasWidth, canvasHeight);
        canvas.width = canvas.width;
        points = new Array();
    };
    
    function startDrag(event) {
        event.preventDefault();        
        paint = true;
        points = new Array();
        addPoint(event);
        draw();
    };
    
    var getPagePointFromEvent = function getPagePointFromEvent(event) {
        var pageX;
        var pageY;
        
        if (event.touches)
        {
            pageX = event.touches[0].pageX;
            pageY = event.touches[0].pageY;
        }
        else
        {  
            pageX = event.pageX;
            pageY = event.pageY;
        }
        
        return new point(pageX, pageY);
    };
    
    var getMouseClickX = function getMouseClickX(pageX, target) {
        var fancyBoxInner = target.offsetParent;
        var fancyBoxWrapper = fancyBoxInner.offsetParent;

        return pageX - fancyBoxWrapper.offsetLeft - 15 + fancyBoxInner.scrollLeft;
    };
    
    var getMouseClickY = function getMouseClickX(pageY, target) {
        var fancyBoxInner = target.offsetParent;
        var fancyBoxWrapper = fancyBoxInner.offsetParent;

        return pageY - fancyBoxWrapper.offsetTop - 15 + fancyBoxInner.scrollTop;
    };

    var addPoint = function addPoint(event) {
        var pagePoint = getPagePointFromEvent(event);        
        var newPoint = new point(getMouseClickX(pagePoint.x, event.target), getMouseClickY(pagePoint.y, event.target));
        
        points.push(newPoint);
    };

    var draw = function draw(pointsToDraw) {
        if (pointsToDraw === undefined)
            pointsToDraw = points;

        for (var i = 0; i < pointsToDraw.length; i++)
            drawPoint(pointsToDraw[i], i > 0 ? pointsToDraw[i - 1] : null);

        context.globalAlpha = 1;
    };
    
    var drawPoint = function drawPoint(point, lastPoint) {
        context.beginPath();

        if (lastPoint)                     
            context.moveTo(lastPoint.x, lastPoint.y);
        else
            context.moveTo(point.x, point.y);

        context.lineTo(point.x, point.y);
        context.closePath();

        if (currentTool == 'eraser')
            context.strokeStyle = '#ffffff';
        else
            context.strokeStyle = currentColor;

        context.lineJoin = 'round';
        context.lineWidth = getStrokeWidth();
        context.stroke();
    };

    var getStrokeWidth = function getStrokeWidth() {
        if (currentTool == 'eraser' || currentSize == 'huge')
            return 20;
        else if (currentSize == 'normal')
            return 5;
        else if (currentSize == 'large')
            return 10;

        return 2;
    };
    
    function continueDrag(event) {
        event.preventDefault();
        
        if (paint == true && event.shiftKey == false) {
            addPoint(event);
            draw();
            
            if (points.length % 10 == 0)
            {
                sendEdits();
                addPoint(event);
            }
        }
    };
    
    function stopDrag(event) {
        if (event.shiftKey == true)
            addPoint(event);
            
        paint = false;
        draw();
        sendEdits();
    };
    
    var sendEdits = function sendEdits() {
        if (points.length > 0) {
            client.editWhiteboard(view.aliasTextBox.val(), points, currentSize, currentColor, currentTool);
            points = new Array();            
        };
    };
    
    this.displayActivity = function displayActivity(activity) {
        if (activity.type == 'edit-whiteboard')
            addEdits(activity);
        else if (activity.type == 'clear-whiteboard')
            clearCanvas();
    };
    
    var addEdits = function addEdits(activity) {
        var oldSize = currentSize;
        var oldColor = currentColor;
        var oldTool = currentTool;
        currentSize = activity.size;
        currentColor = activity.color;
        currentTool = activity.tool;
        
        var newPoints = new Array();
        
        for (var i = 0; i < activity.points.length; i++) {
            var newPoint = new point(
                parseInt(activity.points[i].x), 
                parseInt(activity.points[i].y));
                
            newPoints.push(newPoint);
        }
        
        draw(newPoints);
        currentSize = oldSize;
        currentColor = oldColor;
        currentTool = oldTool;
    };
};