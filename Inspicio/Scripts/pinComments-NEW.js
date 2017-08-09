//NAMING : 
// *Leaf - leaflet.js objects
// *Object - objects created using *Class ( a class)


//Input container object
function inputContainerClass(id) {

    //Separate variable to be used in functions
    var self = this;

    //temp Id;
    this.id = id;

    //Send icon
    this.sendIcon = "<i class='glyphicon glyphicon-share-alt'></i></button>";

    //Initial button
    this.sendButton = $(document.createElement("button")).addClass("btn btn-success popup-btn initial-button").attr("id","btn-"+this.id).append(this.sendIcon);

    //Text area
    this.textarea = $(document.createElement("textarea")).addClass("form-control popup-textarea").attr("rows", "2").attr("id","popuptext" + id);

    //Urgent box
    this.urgentContainer = $((document).createElement("div")).addClass("comment-status").append("<label><input type='checkbox' class='urgency-popup'>Urgent</input></label>");


    this.init = function () {
        var inputGroup = $(document.createElement("span")).addClass("input-group-btn").append(self.sendButton);
        var inputWrapper = $(document.createElement("div")).addClass("col-xs-8 col-sm-8 col-md-8 input-group").append(self.textarea).append(self.urgentContainer).append(inputGroup);
        var userContainer = $(document.createElement("div")).addClass("col-xs-4 col-sm-4 col-md-4 text-center").html("You");
        var inputRowContainer = $(document.createElement("div")).addClass("row comment-popup-input").attr("id", "popupinput" + id);
        $(inputRowContainer).append(userContainer).append(inputWrapper);
        return inputRowContainer;
    }

    //Initial container for initial comment
    this.container = this.init();

    //Button is updated after the initial comment, so it becomes a reply button instead of an "initial comment (new thread)" button.
    this.updateButton = function (parent) {
        $(self.container).find(".initial-button").removeClass("initial-button").addClass("reply-button").attr("data-parent",parent);
        $(self.container).find(".comment-status").remove();
    }

}

//Popup class
function popupClass(location, id) {

    //Separate variable to be used in functions
    var self = this;

    //Creating popup object
    this.popupLeaf = new L.Rrose({ offset: new L.Point(-4, -10), autoPan: false, closeOnClick: true }).setLatLng(location);

    //Assign temp. id
    this.id = id;

    //Parent id
    this.parentId;

    //Comment container
    this.commentContainer = $(document.createElement("div")).addClass("container-fluid popup-comment-container");

    //Input container
    this.inputContainerObject = new inputContainerClass(this.id);

    //Get content
    this.content = function () {
        return self.popupLeaf.getContent();
    }

    //Urgency element
    this.urgencyElement = $(document.createElement("div")).addClass("urgent").append($(document.createElement("span")).addClass("glyphicon glyphicon-star").attr("aria-hidden", "true"));

    //Comment row definition
    this.row = $(document.createElement("div")).addClass("row-eq-height popup-comment");
    $(this.row).append($(document.createElement("div")).addClass("col-xs-4 col-sm-4 col-md-4 username"));
    $(this.row).append($(document.createElement("div")).addClass("col-xs-8 col-sm-8 col-md-8 message"));

    //Initial popup content
    this.init = function () {
        var wrapper = $(document.createElement("div")).append(self.inputContainerObject.container);
        self.popupLeaf.setContent($(wrapper).html());
    }
    this.init();

    //Add row
    //IsInitial - boolean to check wether it's a new thread or a reply
    this.addRow = function (user, message, parent, isInitial, urgency) {
        
        var row = $(self.row).clone();
        $(row).find(".username").append(user);
        $(row).find(".message").append(message);
        var wrapper;
        if (isInitial) {
            self.parentId = parent;
            self.inputContainerObject.updateButton(parent);
            wrapper = $(document.createElement("div")).append(self.commentContainer).append(self.inputContainerObject.container);
            if (urgency === 1) {
                $(row).append(self.urgencyElement);
            }
        }
        else {
            wrapper = $(document.createElement("div")).append(self.popupLeaf.getContent());
        }
        $(row).appendTo($(wrapper).find(".popup-comment-container"));
        self.popupLeaf.setContent($(wrapper).html());
    }
}

//Marker class
function markerClass(location,id) {

    //Separate variable to be used in functions
    var self = this;

    //Creates custom pin icons
    this.customPin = L.icon({
        iconUrl: "../../images/pinNormal.svg",
        shadowUrl: "../../images/pinshadow.svg",
        iconSize: [38, 58], // size of the icon
        shadowSize: [80, 120], // size of the shadow
        iconAnchor: [15, 58], // point of the icon which will correspond to marker's location
        shadowAnchor: [11, 62],  // the same for the shadow
        popupAnchor: [3, -45]
    });

    this.hoverPin = L.icon({
        iconUrl: "../../images/pinLit.svg",
        shadowUrl: "../../images/pinshadow.svg",
        iconSize: [38, 58], // size of the icon
        shadowSize: [80, 120], // size of the shadow
        iconAnchor: [15, 58], // point of the icon which will correspond to marker's location
        shadowAnchor: [11, 62],  // the same for the shadow
        popupAnchor: [3, -45]
    });

    //Assing location
    this.location = location;

    //Creating Leaftlet marker
    this.markerLeaf = new L.marker(location, { icon: self.customPin, draggable: true });

    //Assigning temporary ID for markers without a comment inside
    this.id = id;

    //Adding a popup
    this.popupObject = new popupClass(this.location, this.id);
    this.markerLeaf.bindPopup(this.popupObject.popupLeaf);

    //Open popup after marker has been created
    setTimeout(function () {
        self.markerLeaf.openPopup();
    }, 50)
    

    //Function to assign a parent id once it's available
    this.assignId = function (id) {
        this.id = id;
        this.popupObject.assignId(id);
        this.popupObject.inputContainerObj.id = id;
    }
}


//Map class
function mapClass() {

    //Separate variable to be used in functions
    var self = this;

    //Creating the map
    this.mapLeaf = L.map("imageMap", {
        crs: L.CRS.Simple,
        zoomControl: false,
        unitsPer1000px: 1000
    });

    //Additional variables
    this.markersArray = [];
    this.popupsArray = [];
    this.locations = [[]];

    //Marker layer
    this.markerGroupLeaf = new L.featureGroup();
    this.markerGroupLeaf.addTo(this.mapLeaf);

    //Adding custom id attribute to the map layer element
    $(".leaflet-map-pane").attr("id", "map-pane");

    //Setting map bounds
    var h = $("#image-container img").height();
    var w = $("#image-container img").width();
    var bound = [[1, 1], [h, w]];
    this.mapLeaf.fitBounds(bound);

    //Setting additional map settings
    this.mapLeaf.fitBounds(bound);
    this.mapLeaf.dragging.disable();
    this.mapLeaf.touchZoom.disable();
    this.mapLeaf.doubleClickZoom.disable();
    this.mapLeaf.scrollWheelZoom.disable();
    this.mapLeaf.boxZoom.disable();
    this.mapLeaf.keyboard.disable();
    this.mapLeaf.setView([0, 0]);
    if (this.mapLeaf.tap) this.mapLeaf.tap.disable();

    //Map on click listener
    this.mapLeaf.on('click', function (e) {
        var markerObject = new markerClass(e.latlng, self.markersArray.length);
        markerObject.markerLeaf.addTo(self.markerGroupLeaf);
        self.markersArray.push(markerObject);
        self.popupsArray.push(markerObject.popupObject);
   
        //Deleting popup and marker if popup has not been commented in
        markerObject.markerLeaf.on("popupclose", function (e) {
            if (markerObject.popupObject.popupLeaf.getContent().indexOf("row-eq-height popup-comment") === -1) {
                self.mapLeaf.removeLayer(markerObject.markerLeaf);
                $(self.markersArray).slice(self.markersArray.indexOf(markerObject),1)
            }
        })
    });
    //Adding invalidateSize() function on window resize
    $(window).resize(function () {
        setTimeout(
            function () {
                self.mapLeaf.invalidateSize();
            }, 1000);

    });

    //Hide/show popups listener
    this.popupState = function () {
        if ($("#map-pane").hasClass("hidden")) {
            $("#map-pane").removeClass("hidden");
            this.mapLeaf.on('click', function (e) {
                this.createMarker(e.latlng, true);
            });
        }
        else {
            $("#map-pane").addClass("hidden");
            self.mapLeaf.off('click');
        }
    }

}

//Exporting map
var map = new mapClass();
module.exports = map;

//Resizing the map according to the image
$(window).ready(function () {
    $("#imageMap").width($("#image-container >img").width());
    $("#imageMap").height($("#image-container >img").height());
})