var pins = require("./pinComments.js");

//A class for creating comments without sending them to the database ( only for maps within dropzones )
function dropzoneComments() {

}

//Dropzone class
//mapRequired (bool) - determines if the dropzone will implement a map for pinning comments
function dropzoneClass(area, mapRequired, mapArea, addImageButton , titleField,hidePopupsButton) {
    
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

    //Button for hiding the pins.
    this.pinsEnabler = hidePopupsButton;

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

    //--- METHODS RELATED TO PINNED COMMENTS AND MAPS BELOW

    //Function for destroying the map
    this.destroyMap = function () {
        //If map exists, destroy it and all elements associated with it
        if (self.map.mapLeaf) {
            try {
                self.map.mapLeaf.remove();
            }
            catch (e) {

            }
            
            var clone = $("#" + self.mapArea).clone();
            var parent = $("#" + self.mapArea).parent();
            $("#" + self.mapArea).remove();
            $(clone).removeClass("leaflet-container leaflet-touch leaflet-fade-anim").prependTo(parent).css("height",0).css("width","0");     
        }
    }

    //Initializing map
    this.initMap = function () {
        $(document).off("click", ".popup-btn");
        $(self.pinsEnabler).off();
        $(self.pinsEnabler).removeClass("disabled");
        if (self.map) {
            self.destroyMap();
        }

        //Boolean value to determine if updates to the map are being sent to the database
        //isLocal - true
        self.map = pins.newMap(self.mapArea,true);
        $(self.pinsEnabler).on("click", function () {
            self.map.popupState(this);
        })
        $(document).on("click",".popup-btn",function () {
            var id = $(this).attr("id").slice(4);
            var parent;
            var isInitial = false;
            if ($(this).hasClass("initial-button")) {
                isInitial = true;
                parent = id;
            }
            else {
                isInitial = false;
                parent = $(this).data("parent");
               
            }
            self.map.markersArray[id].markerLeaf.dragging.enable();
            self.map.markersArray[id].popupObject.addRow($(".main-user").html(), $(".popup-textarea").val(), parent, isInitial, false);
        })
        
    }
}

var createDropzone = function (area, mapRequired, mapArea, button, title, hidePopupsButton) {
    var dropzoneObject = new dropzoneClass(area, mapRequired, mapArea, button, title, hidePopupsButton);
    return dropzoneObject;
}

module.exports.createDropzone = createDropzone;