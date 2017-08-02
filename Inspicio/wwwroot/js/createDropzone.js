/*
encodeBase64
This function take the chosen file (image file) and 
converts it to base64encoding.This is then used to 
set a temp input tag value.This is then sent to 
the server when create new is pressed.
*/
    function encodeBase64(file,area) {

        if (file) {
            var FR = new FileReader();
            FR.addEventListener("load", function (e) {
                var images = $(".dropzone#"+area+" img");
                var l = images.length;
                for (var i = 0; i < l; i++) {
                    $(images[i]).remove();
                }
                document.getElementById("b64"+area).value = e.target.result;
                var image = document.createElement("img");
                
                image.src = e.target.result;
                $(image).appendTo(".dropzone#" + area+" > .dz-preview >.dz-image");
                
                $(image).click(function () {
                    
                    myDropzone.removeAllFiles();
                    $(area).html("");
                    $(".dropzone#" + area).click();
                })
            });

            FR.readAsDataURL(file);
        }
    }

    Dropzone.autoDiscover = false;
    var myDropzone = new Dropzone("#uploader", {

        maxFiles: 1,
        autoProcessQueue: false,
        init: function () {

            this.on("addedfile", function (file) {
                $("#uploader").css("width", "auto");
                $("#add-img").addClass("ready");
                encodeBase64(myDropzone.files[0],"uploader");
            });
        },

        // Function to be called on the server
        url: "doNothing"
    });
    var thumbDropzone = new Dropzone("#uploaderThumb", {
        maxFiles: 1,
        autoProcessQueue: false,
        init: function () {
            this.on("addedfile", function (file) {
                $("#thumbUploader img").remove();
                $("#uploaderThumb").css("width", "auto");
                encodeBase64(thumbDropzone.files[0],"uploaderThumb");
            });
        },

        // Function to be called on the server
        url: "doNothing"
    })
    thumbDropzone.on("maxfilesexceeded", function (file) {
        $("#thumbUploader img").remove();
        thumbDropzone.removeAllFiles();
    this.addFile(file);
    });
    myDropzone.on("maxfilesexceeded", function (file) {
        $("#uploader img").remove();
        myDropzone.removeAllFiles();
        this.addFile(file);
    });


   
