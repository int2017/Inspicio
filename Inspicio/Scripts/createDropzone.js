var pins = require("./pinComments.js");

//Dropzone class
//mapRequired (bool) - determines if the dropzone will implement a map for pinning comments
function dropzoneClass(area, mapRequired, mapArea, addImageButton , titleField) {
    
    //Additional variable to be used in functions
    var self = this;

    //Assigning the appropriate area
    this.area = area;

    //Title field, update when file is added
    this.screenTitleField = titleField;

    //A bool for determining if a map is required and a string for it's location
    this.mapRequired = mapRequired;
    this.mapArea = mapArea;

    //Add button, to change classes
    this.addImageButton = addImageButton;

    //Getting the initial text for the area, specified in the HTML file
    this.dropzoneInitialHtml = $("#" + area + " .dz-message");

    //Creating the b64 input element and adding it to the document
    this.b64input = $(document.createElement("input")).attr("type", "hidden").attr("id", "b64" + this.area);
    $("body").append(this.b64input);

    /*
    encodeBase64
    This function take the chosen file (image file) and 
    converts it to base64encoding.This is then used to 
    set a temp input tag value.This is then sent to 
    the server when create new is pressed.*/
    this.encodeBase64 = function (file) {
        if (file) {
            var FR = new FileReader();
            FR.addEventListener("load", function (e) {
                document.getElementById("b64" + area).value = e.target.result;
            });

            FR.readAsDataURL(file);
        }
    }

    //Dropzone element
    this.dropzoneDrop = new Dropzone("#"+area, {
        maxFiles: 1,
        autoProcessQueue: false,
        thumbnailWidth: null,
        thumbnailHeight: null,
        init: function () {
            this.on("addedfile", function (file) {
                
                if (this.files[1]) {
                    this.removeFile(this.files[0]);
                }
                file.previewElement.addEventListener("click", function () {
                    $("#"+self.area).click();
                });
                $("#" + area).css("width", "auto");

                //If map is required, initialize it
                if (self.mapRequired) {
                    self.initMap();
                }

                //If the type is string (b64),the try will fail,  do not convert it and just change the value of b64 input, otherwise convert it and add ready class to the button
                try {
                    self.encodeBase64(file);

                    //Add the ready class to the button if it is passed into the constructor
                    if (self.addImageButton && (!$(self.addImageButton).hasClass("ready"))) {
                        $(self.addImageButton).addClass("ready");
                    }
                    if (self.screenTitleField) {
                        $(self.screenTitleField).val(file.name.split(".")[0] );
                    }
                }
                catch (e) {
                    self.b64input.value = file;
                }
               
            });
        },

        // Function to be called on the server
        url: "doNothing"
    });

    //Function to programatically add a file to the dropzone
    this.addFile = function (file,title) {
        self.dropzoneDrop.removeAllFiles();
        $(area).html("");
        var myImage = {
            name: title
        }
        self.dropzoneDrop.emit("addedfile", myImage);
        self.dropzoneDrop.emit("thumbnail", myImage, file);
        self.dropzoneDrop.files.push(myImage); 
        
    }

    //A function to reset the dropzone area to initial state
    this.clearDropzone = function () {
        $("#add-img").removeClass("ready");
        self.dropzoneDrop.removeAllFiles();
        $(area).html(self.dropzoneInitialHtml);
        $(self.b64input).val("");
        $("#" + area).css("width", "100%");
    }

    //--- METHODS RELATED TO PINNED COMMENTS BELOW
    this.initMap = function () {
        if (self.map) {
            self.map.mapLeaf.remove();
        }
        self.map = pins.newMap(self.mapArea);
    }
}

var createDropzone = function (area,mapRequired,mapArea,button,title) {
    var dropzoneObject = new dropzoneClass(area, mapRequired, mapArea, button, title);
    return dropzoneObject;
}

module.exports.createDropzone = createDropzone;