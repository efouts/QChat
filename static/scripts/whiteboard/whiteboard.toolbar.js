function whiteboardToolbar(view, whiteboard, client) {
    var currentTool = 'marker';
    var currentSize;
    var currentColor = '#659b41';
    var colorPickerShown = false;
    var maximumSize = 50;
    var self = this;
    
    this.getTool = function getTool() {
        return currentTool;
    };
    
    this.getSize = function getSize() {
        return currentSize;
    };
    
    this.getColor = function getColor() {
        return currentColor;
    };
    
    this.setColor = function setColor(color) {
        currentColor = color;
        $('#colorPickerHolder').ColorPickerSetColor(color);
        setColorSelectorBackground();
    };
    
    var addSizeOptions = function addSizeOptions() {
        var sizeSelect = $('#sizeSelect');
        for (var i = 1; i <= maximumSize; i++)
            sizeSelect.append('<option>' + i + '</option>');
            
        sizeSelect.val('10').attr('selected', true);
        currentSize = '10';
    };
    
    this.selectTool = function selectTool() {
        $('#whiteboardToolbar img[tool="' + currentTool + '"]').removeClass('selected-tool');
        currentTool = $(this).attr('tool');
        $(this).addClass('selected-tool');
        
        self.onToolChanged(currentTool);
    };
    
    this.onToolChanged = function onToolChanged() { };
    
    var setColorSelectorBackground = function setColorSelectorBackground() {
        $('#colorSelector div').css('backgroundColor', currentColor);
    };
    
    var toggleColorPicker = function toggleColorPicker() {
        $('#colorPickerHolder').toggle(200);
    };
    
    $('#whiteboardToolbar img[tool]').click(this.selectTool);
        
    $('#sizeSelect').change(function() {
        currentSize = $(this).val();
    });

    $('#clearIcon').click(function () {
        whiteboard.clearCanvas();
        client.clearWhiteboard(view.aliasTextBox.val());
    });
    
    $('#colorPickerHolder').ColorPicker({
        flat: true,
        color: currentColor,
        onSubmit: function(hsb, hex, rgb) {
            currentColor = '#' + hex;
            setColorSelectorBackground();
            toggleColorPicker();
        }
    });
    
    $('#colorSelector').click(toggleColorPicker);
    
    addSizeOptions();
    setColorSelectorBackground();
};