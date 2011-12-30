function whiteboard(view) {
    $('#whiteboard').fancybox();
    
    var canvas = document.getElementById('whiteboardCanvas');
    var context = canvas.getContext('2d');
    var currentSize = 'small';
    var edits = new Array();
    var currentColor = '#659b41';
    var paint = false;
    var canvasHeight = 600;
    var canvasWidth = 800;
    var drawingAreaX = 0;
    var drawingAreaY = 0;
    var drawingAreaWidth = 800;
    var drawingAreaHeight = 600;
    
    view.whiteboardCanvas.mousedown(function(eventData)
	{        
		paint = true;
		addEdit(getMouseClickX(eventData, this), getMouseClickY(eventData, this), false);
		draw();
	});
	
	view.whiteboardCanvas.mousemove(function(eventData){
		if(paint == true){
			addEdit(getMouseClickX(eventData, this), getMouseClickY(eventData, this), true);
			draw();
		}
	});
	
	view.whiteboardCanvas.mouseup(function(eventData){
		paint = false;
	  	draw();
	});
	
	view.whiteboardCanvas.mouseleave(function(eventData){
		paint = false;
	});
    
    this.getEdits = function getEdits() {
        return edits;
    };
    
    this.setEdits = function setEdits(newEdits) {
        edits = newEdits;
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
    
    var addEdit = function addEdit(x, y, dragging)
    {
        var edit = new whiteboardEdit(x, y, dragging, currentColor, currentSize, '');
        edits.push(edit);
    };

    var draw = function draw() {
        clearCanvas();        
        drawClippingRectangle();
        
        for(var i = 0; i < edits.length; i++)
            drawEdit(edits[i], i > 0 ? edits[i - 1] : null);
        
        context.restore();        
        context.globalAlpha = 1;
    };
    
    var clearCanvas = function clearCanvas() {
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvasWidth, canvasHeight);
        canvas.width = canvas.width; 
    };
    
    var drawClippingRectangle = function drawClippingRectangle() {
        context.save();
        context.beginPath();
        context.rect(drawingAreaX, drawingAreaY, drawingAreaWidth, drawingAreaHeight);
        context.clip();
    };
    
    var drawEdit = function drawEdit(edit, lastEdit) {            
        context.beginPath();
        if(edit.drag)
            context.moveTo(lastEdit.x, lastEdit.y);
        else
            context.moveTo(edit.x, edit.y);
        
        context.lineTo(edit.x, edit.y);
        context.closePath();
        
        if(edit.tool == "eraser")
            context.strokeStyle = 'white';
        else
            context.strokeStyle = edit.color;
        
        context.lineJoin = "round";
        context.lineWidth = getStrokeWidth(edit.size);
        context.stroke();   
    };
    
    var getStrokeWidth = function getStrokeWidth(size) {
        if(size == "normal")
            return 5;
        else if(size == "large")
            return 10;
        else if(size == "huge")
            return 20;
            
        return 2;
    };
};