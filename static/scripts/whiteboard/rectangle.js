function rectangle(context, toolbar, client, view) {
    var points = new Array();
    var paint = false;
    var startingPoint = null;
    var endingPoint = null;
    var utilsObject = new utils();
    var self = this;
    
    this.name = 'rectangle';
    
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
        paint = true;
        startingPoint = utilsObject.getClickPointOnElement(event);
    };

    this.continueDrag = function continueDrag(event) {
        event.preventDefault();
        
        if (paint)
        {
            var mousePoint = utilsObject.getClickPointOnElement(event);
            var x = Math.min(mousePoint.x,  startingPoint.x),
            y = Math.min(mousePoint.y,  startingPoint.y),
            w = Math.abs(mousePoint.x - startingPoint.x),
            h = Math.abs(mousePoint.y - startingPoint.y);
            
            context.fillStyle = '#ffffff';
            context.clearRect(0, 0, view.whiteboardCanvas.width(), view.whiteboardCanvas.height());
            
            if (w && h) {
                context.strokeStyle = toolbar.getColor();
                context.strokeRect(x, y, w, h);
            }
        }        
    };

    this.stopDrag = function stopDrag(event) {
        if (paint) {
            paint = false;
            //img_update();
        }
    };
};