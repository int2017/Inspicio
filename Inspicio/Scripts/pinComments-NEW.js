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

    //A collection for all the comments
    this.commentList = [];

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
        //Pushing the new comment into the popup comment collection. For editing the comments later on.
        var newComment = {
            user: user,
            message: message,
            parent: parent
        }
        self.commentList.push(newComment);
        
        //Cloning the comment row
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

    //Creating Leaftlet marker and adding a dragging listener that updates it's location in the DB
    this.markerLeaf = new L.marker(location, { icon: self.customPin });
    $(this.markerLeaf).on("dragend", function (e) {
        if (self.popupObject.commentList.length > 0) {
            parent = self.popupObject.parentId;
            self.location = self.markerLeaf.getLatLng();
            self.updateMarker(self.location, parent);
        }
        
    })
  
    //Assigning temporary ID for markers without a comment inside
    this.id = id;

    //Adding a popup
    this.popupObject = new popupClass(this.location, this.id);
    this.markerLeaf.bindPopup(this.popupObject.popupLeaf);

    //Open popup function, only called by clicks on map and the open pink link
    this.openPopup = function(){
    setTimeout(function () {
        self.markerLeaf.openPopup();
        }, 50)
    }

    //Updating marker and its content. Will need to be reworked for the edit comments feature
    this.updateMarker = function (latlng, parent, message,id ) {
        $("#loc-" + parent).attr("data-location", Math.round(self.location.lat) + "  " + Math.round(self.location.lng));
        var CommentUpdateModel = {
            "Message": message,
            "Lat": Math.round(latlng.lat),
            "Lng": Math.round(latlng.lng),
            "ParentId": parent
        }
        $.ajax(
            {
                type: "POST", //HTTP POST Method  
                url: "../UpdateCommentLocation", // Controller/View  
                contentType: "application/json;",
                dataType: "text",
                data: JSON.stringify(CommentUpdateModel)
            })
    }

}


//Map class
function mapClass() {

    //Separate variable to be used in functions
    var self = this;

    var h = $("#image-container img").height();
    var w = $("#image-container img").width();

    //Creating the map
    this.mapLeaf = L.map("imageMap", {
        crs: L.CRS.Simple,
        zoomControl: false,
        maxBounds: [
            [w, 0],
            [0,h]
        ]
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

    //Setting additional map settings
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
        self.addMarkerToMap(markerObject);
        markerObject.openPopup();
    });

    //Required to fix the bounding of the map and stop the user from dragging the markers out of the map
    setTimeout(
       function () {
          self.mapLeaf.invalidateSize();
        }, 500);

    //Creating a separate function for adding markers to the map. ( To avoid duplicating code)
    this.addMarkerToMap = function (markerObject) {

        //The drag listener, which checks if the marker is still inside the image.
        //This had to be put here because access to the marker and the map is required
        var lastValidPosition;
        markerObject.markerLeaf.on("drag", function (event) {
            var latLng = markerObject.markerLeaf.getLatLng();
            if (self.mapLeaf.getBounds().contains(latLng)) {
                lastValidPosition = latLng;
            } else {
                if (lastValidPosition) {
                    markerObject.markerLeaf.setLatLng(lastValidPosition);
                }
            }
        }, markerObject.markerLeaf);

        self.markersArray.push(markerObject);
        markerObject.markerLeaf.addTo(self.markerGroupLeaf);
        //Deleting popup and marker if popup has not been commented in
        markerObject.markerLeaf.on("popupclose", function (e) {
            if (markerObject.popupObject.popupLeaf.getContent().indexOf("row-eq-height popup-comment") === -1) {
                self.mapLeaf.removeLayer(markerObject.markerLeaf);
                $(self.markersArray).slice(self.markersArray.indexOf(markerObject), 1)
            }
        })
    }
    //Create markers programmaticaly
    this.createMarker = function (message, username, lat, lng, parent,isInitial ,urgency) {
        var latlng = new L.latLng(lat, lng);
        var markerObject;
        //Checks if the message is an initial comment in the popup, if it is = new marker, else, get the existing marker
        if (isInitial) { 
            markerObject = new markerClass(latlng, self.markersArray.length);
            self.addMarkerToMap(markerObject);

            //Enabling dragging, because this marker will naturally have a comment inside
            markerObject.markerLeaf.dragging.enable();
        }
        else {
            $(self.markersArray).each(function (i) {
                if (self.markersArray[i].popupObject.parentId == parent) {
                    markerObject = self.markersArray[i];
                    return false;
                }
            })
        }
        //Adding the comment row to the popup
        markerObject.popupObject.addRow(username, message, parent, isInitial, urgency);
    }

    //Hide/show popups listener
    this.popupState = function () {
        if ($("#map-pane").hasClass("hidden")) {
            $("#map-pane").fadeIn(300);
            $("#map-pane").removeClass("hidden");
            self.mapLeaf.on('click', function (e) {
                var markerObject = new markerClass(e.latlng, self.markersArray.length);
                self.addMarkerToMap(markerObject);
                markerObject.openPopup();
            });
        }
        else {
            $("#map-pane").fadeOut(500);
            self.mapLeaf.off('click');
            setTimeout(function () {
                $("#map-pane").addClass("hidden");
            },600)
            
        }
    }

}

//Resizing the map according to the image and exporting map
var newMap = function(){
    var map = new mapClass();
    $("#imageMap").width($("#image-container >img").width());
    $("#imageMap").height($("#image-container >img").height());
    return map;
}
module.exports.newMap = newMap;