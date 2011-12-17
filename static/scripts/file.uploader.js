function fileUploader(view)
{
    var dropContainer = document.getElementById("fileUploader");
         
    dropContainer.addEventListener("dragenter", function(event){ 
        dropContainer.innerHTML = 'DROP';
        event.stopPropagation();
        event.preventDefault();
    }, false);
    
    dropContainer.addEventListener("dragover", function(event) {
        event.stopPropagation();
        event.preventDefault();
    }, false);
    
    dropContainer.addEventListener("drop", upload, false);

    function upload(event) {
        event.stopPropagation();
        var data = event.dataTransfer;        
        var xhr = new XMLHttpRequest();
        var boundary = '------multipartformboundary' + (new Date).getTime();
        var dashdash = '--';
        var crlf     = '\r\n';
        var builder = '';
        
        /* For each dropped file. */
        for (var i = 0; i < data.files.length; i++) {
            var file = data.files[i];
            
            var reader = new FileReader();
            reader.onload = (function(theFile) {
                return function(e) {
                    /* Build RFC2388 string. */
                    
                    builder += dashdash;
                    builder += boundary;
                    builder += crlf;
                    
                    /* Generate headers. */            
                    builder += 'Content-Disposition: form-data; name="user_file[]"';
                    if (file.fileName) {
                      builder += '; filename="' + file.fileName + '"';
                    }
                    builder += crlf;

                    builder += 'Content-Type: application/octet-stream';
                    builder += crlf;
                    builder += crlf;
                    
                    builder += e.target.result;
                    
                    builder += crlf;

                    /* Write boundary. */
                    builder += dashdash;
                    builder += boundary;
                    builder += crlf;
                    
                    builder += dashdash;
                    builder += boundary;
                    builder += dashdash;
                    builder += crlf;

                    /* Mark end of the request. */
                    
                    xhr.open("POST", "/upload", true);
                    xhr.setRequestHeader('content-type', 'multipart/form-data; boundary=' + boundary);
                    xhr.sendAsBinary(builder);        
                    
                    xhr.onload = function(event) { 
                        /* If we got an error display it. */
                        if (xhr.responseText) {
                            alert(xhr.responseText);
                        }
                    };
                };
            })(file);

            // Read in the image file as a data URL.
            reader.readAsBinaryString(file);
        }        
    }
}