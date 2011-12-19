function fileUploader(view)
{
  var dropZone = null;  
  
  $(document).ready(function() {
    dropZone = $('body');
   
    if (window.File && window.FileList && window.FileReader && (new XMLHttpRequest()).upload) {
      dropZone.bind('dragover', onDrag);
      dropZone.bind('dragleave', onDrag);
      dropZone.bind('drop', onDrop);
    }
  });

  var onDrag = function onDrag(e) {
    e.stopPropagation();
    e.preventDefault();
  };
  
  var onDrop = function onDrop(e) {
    onDrag(e);
 
    var files = e.originalEvent.dataTransfer.files;
  
    for(i = 0; i < files.length; i++) 
      uploadFile(files[i]);
  };
  
  var uploadFile = function uploadFile(file) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/upload', true);
    xhr.setRequestHeader('X-Filename', file.name);
    xhr.send(file);
  };
};
