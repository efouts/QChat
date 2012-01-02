function whiteboard(view, client) {
    var canvas = document.getElementById('whiteboardCanvas');
    var context = canvas.getContext('2d');
    var points = new Array();
    var paint = false;
    var canvasHeight = 480;
    var canvasWidth = 800;
    var currentPoint = null;
    var lastPoint = null;
    var toolbar = new whiteboardToolbar(view, this, client);
    
    this.clearCanvas = function clearCanvas() {
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvasWidth, canvasHeight);
        canvas.width = canvas.width;
        points = new Array();
    };
    
    var startDrag = function startDrag(event) {
        event.preventDefault();        
        paint = true;
        points = new Array();
        addPoint(event);
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
    
    var getCanvasClickX = function getCanvasClickX(pageX, target) {
        var fancyBoxInner = target.offsetParent;
        var fancyBoxWrapper = fancyBoxInner.offsetParent;

        return pageX - fancyBoxWrapper.offsetLeft - 15 + fancyBoxInner.scrollLeft;
    };
    
    var getCanvasClickY = function getCanvasClickY(pageY, target) {
        var fancyBoxInner = target.offsetParent;
        var fancyBoxWrapper = fancyBoxInner.offsetParent;

        return pageY - fancyBoxWrapper.offsetTop - 15 + fancyBoxInner.scrollTop;
    };

    var addPoint = function addPoint(event) {
        var pagePoint = getPagePointFromEvent(event);        
        var newPoint = new point(getCanvasClickX(pagePoint.x, event.target), getCanvasClickY(pagePoint.y, event.target));
        
        points.push(newPoint);
        lastPoint = currentPoint;
        currentPoint = newPoint;
        drawPoint(currentPoint, lastPoint, toolbar.getSize(), toolbar.getColor(), toolbar.getTool());
    };
    
    var drawPoint = function drawPoint(point, lastPoint, size, color, tool) {
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
        if (event.shiftKey == true)
            addPoint(event);
            
        paint = false;
        currentPoint = null;
        lastPoint = null;
        sendEdit();
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
            addEdit(activity.edit);
        else if (activity.type == 'clear-whiteboard')
            this.clearCanvas();
    };
    
    var addEdit = function addEdit(edit) {        
        var newPoints = new Array();
        var newPoint = null;
        var lastNewPoint = null;
        
        for (var i = 0; i < edit.points.length; i++) {
            if (i > 0)
                lastNewPoint = newPoint;
                
            newPoint = new point(
                parseInt(edit.points[i].x), 
                parseInt(edit.points[i].y));
                
            drawPoint(newPoint, lastNewPoint, edit.size, edit.color, edit.tool);
        }
    };
    
    $('#whiteboard').fancybox();
    
    canvas.addEventListener("touchstart", startDrag, false);
    canvas.addEventListener("touchmove", continueDrag, false);
    canvas.addEventListener("touchend", stopDrag, false);
    canvas.addEventListener("touchcancel", stopDrag, false);

    view.whiteboardCanvas.mousedown(startDrag);
    view.whiteboardCanvas.mousemove(continueDrag);
    view.whiteboardCanvas.mouseup(stopDrag);
    view.whiteboardCanvas.mouseleave(stopDrag);
    view.whiteboardCanvas.attr('height', canvasHeight);
    view.whiteboardCanvas.attr('width', canvasWidth);
};