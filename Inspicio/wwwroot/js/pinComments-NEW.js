
//Map class
var imageMapObj = new function () {

    //Creating the map
    this.map = L.map("imageMap", {
        crs: L.CRS.Simple,
        zoomControl: false,
        unitsPer1000px: 1000
    });

    //Additional variables
    this.markersArray = [];
    this.popupsArray = [];
    this.locations = [[]];

    //Marker layer
    this.markerGroup = L.featureGroup().addTo(this.map);

    //Adding custom id attribute to the map layer element
    $(".leaflet-map-pane").attr("id", "map-pane");

    //Setting map bounds
    var h = $("#image-container img").height();
    var w = $("#image-container img").width();
    var bound = [[1, 1], [h, w]];
    this.map.fitBounds(bound);

    //Setting additional map settings
    this.map.fitBounds(bound);
    this.map.dragging.disable();
    this.map.touchZoom.disable();
    this.map.doubleClickZoom.disable();
    this.map.scrollWheelZoom.disable();
    this.map.boxZoom.disable();
    this.map.keyboard.disable();
    this.map.setView([0, 0]);
    if (this.map.tap) this.map.tap.disable();

    //Map on click listener
    this.map.on('click', function (e) {
        var marker = new markerObj(e.latlng);
        $(markersArray).push(marker);
    });
    //Adding invalidateSize() function on window resize
    $(window).resize(function () {
        setTimeout(
            function () {
                this.map.invalidateSize();
            }, 1000);

    });




    //Hide/show popups listener
    this.popupState = function () {
        if ($("#map-pane").hasClass("hidden")) {
            $("#map-pane").removeClass("hidden");
            this.map.on('click', function (e) {
                this.createMarker(e.latlng, true);
            });
        }
        else {
            $("#map-pane").addClass("hidden");
            this.map.off('click');
        }
    }

}

//Marker class
var markerObj = new function (location) {

    //Assing location
    this.location = location;

    //Creating Leaftlet marker
    this.marker = new L.marker(location, { icon: customPin, draggable: true });

    //Adding a popup
    this.popup = new popup(location);
    

    //Assigning temporary ID for markers without a comment inside
    this.id = Math.round(new Date().getTime() + (Math.random() * 100));

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

    //Function to assign a parent id once it's available
    this.assignId = function (id) {
        this.id = id;
        this.popup.assignId(id);
        this.popup.inputContainer.id = id;
    }
}

var popup = function (location,id) {

    //Creating popup object
    this.popup = new L.Rrose({ offset: new L.Point(-4, -10) ,autoPan: false, closeOnClick: true} ).setLatLng(location);

    //Assign temp. id
    this.id = id;

    //Comment container
    this.commentContainer = $(document.createElement("div")).addClass("container-fluid popup-comment-container");

    this.inputContainer = new inputContainer(id);

    //Get content
    this.content = function () {
        return this.popup.getContent();
    }
    //Comment row definition
    this.row = $(document.createElement("div")).addClass("row-eq-height popup-comment");
    $(this.row).append($(document.createElement("div")).addClass("col-xs-4 col-sm-4 col-md-4 user"));
    $(this.row).append($(document.createElement("div")).addClass("col-xs-8 col-sm-8 col-md-8 message"));

    //Initial popup content
    this.init = function () {
        this.
            popup.setContent(this.commentContainer + this.inputContainer);
    }
    //If it's the first comment,update the button
    this.timesUpdated = 0;
    //Add row
    this.addRow = function (user,message) {
        var row =$(this.row).clone().children(".user").html(user);
        $(row).children(".message").html(message);
        $(this.content()).children(".popup-comment-container").append(row);
        if (this.timesUpdated == 0) {
            this.timesUpdated++;
            this.inputContainer.updateButton(this.id);
        }
    }
    //Input container object
    var inputContainer = function (id) {
        //temp Id;
        this.id = id;

        //Send icon
        this.sendIcon = "<i class='glyphicon glyphicon-share-alt'></i></button>";

        //Initial button
        this.sendButton = $(document.createElement("button")).click(commentClick(id)).addClass("btn btn-success popup-btn").append(sendIcon);

        //Text area
        this.textarea = $(document.createElement("textarea")).addClass("form-control popup-textarea").attr("rows", "2").attr("popuptext" + id);

        //Initial container
        this.container = this.init();

        this.init = function (){
            var inputGroup = $(document.createElement("span")).addClass("input-group-btn").append(this.sendButton);
            this.urgentContainer = $((document).createElement("div")).addClass("comment-status").append("<label><input type='checkbox' class='urgency-popup'>Urgent</input></label>");
            var inputContainer = $(document.createElement("div")).addClass("col-xs-8 col-sm-8 col-md-8 input-group").append(this.textarea).append(urgentContainer).append(inputGroup);
            var userContainer = $(document.createElement("div")).addClass("col-xs-4 col-sm-4 col-md-4 text-center").html("You");
            var inputRowContainer = $(document.createElement("div")).addClass("row comment-popup-input").attr("id", "popupinput" + id);
            $(inputRowContainer).append(userContainer).append(inputContainer);
        }

        this.updateButton = function (parent) {
            $(this.sendButton).off().addClass("reply-btn").attr("data-parent", parent);
            $(this.urgentContainer).remove();
        }

    }

   
}



$(window).ready(function () {
    var map = new imageMapObj();
    module.exports = map;
    $("#imageMap").width($("#image-container >img").width());
    $("#imageMap").height($("#image-container >img").height());
})