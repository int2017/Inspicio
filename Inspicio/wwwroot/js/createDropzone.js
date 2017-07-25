/*
encodeBase64
This function take the chosen file (image file) and 
converts it to base64encoding.This is then used to 
set a temp input tag value.This is then sent to 
the server when create new is pressed.
*/
    function encodeBase64(file) {

        if (file) {
            var FR = new FileReader();
            FR.addEventListener("load", function (e) {
                var images = $(".dropzone#uploader > .dz-preview >.dz-image > img");
                var l = images.length;
                for (var i = 0; i < l; i++) {
                    images[0].parentNode.removeChild(images[0]);
                }
                document.getElementById("b64").value = e.target.result;
                var image = new Image();
                image.src = e.target.result;
                $(image).appendTo(".dropzone#uploader > .dz-preview >.dz-image");
                $(image).click(function () {
                    $(".dropzone#uploader").click();
                })
            });

            FR.readAsDataURL(file);
        }
    }

    Dropzone.autoDiscover = false;
    var myDropzone = new Dropzone(".dropzone", {

        maxFiles: 1,
        autoProcessQueue: false,
        init: function () {

            this.on("addedfile", function (file) {

                encodeBase64(myDropzone.files[0]);
            });
        },

        // Function to be called on the server
        url: "doNothing"
    });

    myDropzone.on("maxfilesexceeded", function (file) {
        this.removeAllFiles();
        this.addFile(file);
    });


   
