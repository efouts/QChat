function freestyleTool(context, toolbar, client, view) {
    var points = new Array();
    var paint = false;
    var currentPoint = null;
    var lastPoint = null;
    var utilsObject = new utils();
    var self = this;
    
    this.name = undefined;
    
    this.bindEvents = function bindEvents(canvas) {
        canvas.addEventListener('touchstart', self.startDrag, false);
        canvas.addEventListener('touchmove', self.continueDrag, false);
        canvas.addEventListener('touchend', self.stopDrag, false);
        canvas.addEventListener('touchcancel', self.stopDrag, false);

        view.whiteboardCanvas.bind('mousedown', self.startDrag);
        view.whiteboardCanvas.bind('mousemove', self.continueDrag);
        view.whiteboardCanvas.bind('mouseup', self.stopDrag);
    };
    
    this.unbindEvents = function unbindEvents(canvas) {
        canvas.removeEventListener('touchstart', self.startDrag, false);
        canvas.removeEventListener('touchmove', self.continueDrag, false);
        canvas.removeEventListener('touchend', self.stopDrag, false);
        canvas.removeEventListener('touchcancel', self.stopDrag, false);

        view.whiteboardCanvas.unbind('mousedown', self.startDrag);
        view.whiteboardCanvas.unbind('mousemove', self.continueDrag);
        view.whiteboardCanvas.unbind('mouseup', self.stopDrag);
    };
    
    this.startDrag = function startDrag(event) {
        event.preventDefault();        
        paint = true;
        points = new Array();
        self.addPoint(event);
        client.status(view.aliasTextBox.val(), 'drawing');
    };
    
    this.addPoint = function addPoint(event) {
        var newPoint = utilsObject.getClickPointOnElement(event);
        
        points.push(newPoint);
        lastPoint = currentPoint;
        currentPoint = newPoint;
        self.drawPoint(currentPoint, lastPoint, toolbar.getSize(), toolbar.getColor());
    };
    
    this.drawPoint = function drawPoint(point, lastPoint, size, color) {        
        context.save();
        context.beginPath();

        if (lastPoint)                     
            context.moveTo(lastPoint.x, lastPoint.y);
        else
            context.moveTo(point.x, point.y);

        context.lineTo(point.x, point.y);        
        context.lineWidth = parseInt(size);
        context.lineCap = 'round';
        context.strokeStyle = self.getStrokeStyle(color);
        context.stroke();
        context.restore();
    };
    
    this.getStrokeStyle = function getStrokeStyle(color) {
        return color;
    };
    
    this.continueDrag = function continueDrag(event) {
        event.preventDefault();
        
        if (paint == true && event.shiftKey == false) {
            self.addPoint(event);
            
            if (points.length == 5)
            {
                self.submitEdit();
                self.addPoint(event);
            }
        }
    };
    
    this.submitEdit = function submitEdit() {
        if (points.length > 0) {
            var edit = { points: points, size: toolbar.getSize(), color: toolbar.getColor(), tool: self.name };
            
            client.editWhiteboard(view.aliasTextBox.val(), edit);
            points = new Array();            
        };
    };
    
    this.stopDrag = function stopDrag(event) {
        if (paint == true) {
            if (event.shiftKey == true)
                self.addPoint(event);
                
            paint = false;
            currentPoint = null;
            lastPoint = null;
            self.submitEdit();
            client.status(view.aliasTextBox.val(), '');
        }
    };
    
    this.addActivity = function addActivity(activity) {
        var newPoint = null;
        var lastNewPoint = null;
        
        for (var i = 0; i < activity.edit.points.length; i++) {
            if (i > 0)
                lastNewPoint = newPoint;
                
            newPoint = new point(
                parseInt(activity.edit.points[i].x), 
                parseInt(activity.edit.points[i].y));
                
            self.drawPoint(newPoint, lastNewPoint, activity.edit.size, activity.edit.color);
        }
    };
};