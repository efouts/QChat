function whiteboardToolbar(view, whiteboard, client) {
    var currentTool = 'marker';
    var currentSize;
    var currentColor = '#659b41';
    var colorPickerShown = false;
    
    this.getTool = function getTool() {
        return currentTool;
    };
    
    this.getSize = function getSize() {
        return currentSize;
    };
    
    this.getColor = function getColor() {
        return currentColor;
    };
    
    var addSizeOptions = function addSizeOptions() {
        var sizeSelect = $('#sizeSelect');
        for (var i = 1; i <= 20; i++)
            sizeSelect.append('<option>' + i + '</option>');
            
        sizeSelect.val('10').attr('selected', true);
        currentSize = '10';
    };
    
    $('#markerIcon').click(function () {
        currentTool = 'marker';
    });

    $('#eraserIcon').click(function () {
        currentTool = 'eraser';
    });
    
    $('#sizeSelect').change(function() {
        currentSize = $(this).val();
    });

    $('#deleteIcon').click(function () {
        whiteboard.clearCanvas();
        client.clearWhiteboard(view.aliasTextBox.val());
    });
    
    $('#colorPickerHolder').ColorPicker({
        flat: true,
        color: currentColor,
        onSubmit: function(hsb, hex, rgb) {
            currentColor = '#' + hex;
            $('#colorSelector div').css('backgroundColor', currentColor);
        }
    });
    
    $('#colorSelector div').css('backgroundColor', currentColor);
    
    $('#colorSelector').click(function() {
        $('#colorPickerHolder').stop().animate({ height: colorPickerShown ? 0 : 173}, 500);
        colorPickerShown = !colorPickerShown;
    });
    
    addSizeOptions();
};