function whiteboard(view, client) {
    var canvas = document.getElementById('whiteboardCanvas');
    var context = canvas.getContext('2d');
    var currentSize = 'small';
    var currentTool = 'marker';
    var points = new Array();
    var currentColor = '#659b41';
    var paint = false;
    var canvasHeight = 600;
    var canvasWidth = 800;

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

    view.whiteboardCanvas.mousedown(function (eventData) {
        paint = true;
        points = new Array();
        addPoint(getMouseClickX(eventData, this), getMouseClickY(eventData, this), false);
        draw();
    });

    view.whiteboardCanvas.mousemove(function (eventData) {
        if (paint == true) {
            addPoint(getMouseClickX(eventData, this), getMouseClickY(eventData, this), true);
            draw();
        }
    });

    view.whiteboardCanvas.mouseup(function (eventData) {
        paint = false;
        draw();
        sendEdits();
    });

    view.whiteboardCanvas.mouseleave(function (eventData) {
        paint = false;
        sendEdits();
    });
    
    this.displayActivity = function displayActivity(activity) {
        if (activity.type == 'edit-whiteboard')
            addEdits(activity.points, activity.size, activity.color, activity.tool);
        else if (activity.type == 'clear-whiteboard')
            clearCanvas();
    };
    
    var addEdits = function addEdits(jsonPoints, size, color, tool) {
        var oldSize = currentSize;
        var oldColor = currentColor;
        var oldTool = currentTool;
        currentSize = size;
        currentColor = color;
        currentTool = tool;
        
        var newPoints = new Array();
        
        for (var i = 0; i < jsonPoints.length; i++) {
            var newPoint = new whiteboardPoint(
                parseInt(jsonPoints[i].x), 
                parseInt(jsonPoints[i].y));
                
            newPoints.push(newPoint);
        }
        
        draw(newPoints);
        currentSize = oldSize;
        currentColor = oldColor;
        currentTool = oldTool;
    };
    
    var sendEdits = function sendEdits() {
        if (points.length > 0) {
            client.editWhiteboard(view.aliasTextBox.val(), points, currentSize, currentColor, currentTool);
            points = new Array();            
        };
    };

    var getMouseClickX = function getMouseClickX(eventData, clickedElement) {
        var fancyBoxInner = clickedElement.offsetParent;
        var fancyBoxWrapper = fancyBoxInner.offsetParent;

        return eventData.pageX - fancyBoxWrapper.offsetLeft - 15 + fancyBoxInner.scrollLeft;
    };

    var getMouseClickY = function getMouseClickX(eventData, clickedElement) {
        var fancyBoxInner = clickedElement.offsetParent;
        var fancyBoxWrapper = fancyBoxInner.offsetParent;

        return eventData.pageY - fancyBoxWrapper.offsetTop - 15 + fancyBoxInner.scrollTop;
    };

    var addPoint = function addPoint(x, y) {
        var point = new whiteboardPoint(x, y);
        points.push(point);
    };

    var draw = function draw(pointsToDraw) {
        if (pointsToDraw === undefined)
            pointsToDraw = points;

        for (var i = 0; i < pointsToDraw.length; i++)
            drawPoint(pointsToDraw[i], i > 0 ? pointsToDraw[i - 1] : null);

        context.globalAlpha = 1;
    };

    var clearCanvas = function clearCanvas() {
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvasWidth, canvasHeight);
        canvas.width = canvas.width;
        points = new Array();
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
};