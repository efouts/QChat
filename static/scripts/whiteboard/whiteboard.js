function whiteboard(view, client) {
    var canvas = document.getElementById('whiteboardCanvas');
    var context = canvas.getContext('2d');
    var canvasHeight = 480;
    var canvasWidth = 800;
    var currentTool;
    var tools = new Array();
    var toolbar = new whiteboardToolbar(view, this, client);
    
    this.clearCanvas = function clearCanvas() {
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvasWidth, canvasHeight);
    };   
    
    this.displayActivity = function displayActivity(activity) {
        if (shouldDisplayEditActivity(activity))
            addActivity(activity);
        else if (activity.type == 'clear-whiteboard')
            this.clearCanvas();
    };
    
    var shouldDisplayEditActivity = function shouldDisplayEditActivity(activity) {
        return activity.type == 'edit-whiteboard' && 
               activity.alias != view.aliasTextBox.val() && 
               view.aliasTextBox.val() != '';
    };
    
    var addActivity = function addActivity(activity) {
        var tool = getTool(activity.edit.tool);        
        tool.addActivity(activity);
    };
    
    var onToolChanged = function onToolChanged(toolName) {
        if (currentTool)
            currentTool.unbindEvents(canvas);
            
        currentTool = getTool(toolName);
        currentTool.bindEvents(canvas);
    };
    
    var getTool = function getTool(toolName) {
        for (var i = 0; i < tools.length; i++) {
            if (tools[i].name == toolName)
                return tools[i];
        }
        
        return null;
    };
    
    $('#whiteboard').fancybox({ padding: 0 });        
    view.whiteboardCanvas.attr('height', canvasHeight);
    view.whiteboardCanvas.attr('width', canvasWidth);    
    this.clearCanvas();
    
    toolbar.onToolChanged = onToolChanged;
    tools.push(new marker(context, toolbar, client, view));
    tools.push(new eraser(context, toolbar, client, view));
    tools.push(new eyedropper(context, toolbar, view));
    $('#whiteboardToolbar img[tool="marker"]').trigger('click');
};