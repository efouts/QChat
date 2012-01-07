function marker(context, toolbar, client, view) {
    var markerTool = new freestyleTool(context, toolbar, client, view);
    markerTool.name = 'marker';
    
    return markerTool;
};