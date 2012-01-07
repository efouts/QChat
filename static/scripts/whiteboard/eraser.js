function eraser(context, toolbar, client, view) {
    var eraserTool = new freestyleTool(context, toolbar, client, view);
    eraserTool.name = 'eraser';
    eraserTool.getStrokeStyle = function() { return '#ffffff'; };
    
    return eraserTool;
};