﻿
if ($(".img-wrapper").first().innerHeight() < $("#comment-section").height())
    $("img-wrapper").affix({})

//Creates the map
var imageMap = L.map("imageMap", {
    crs: L.CRS.Simple,
    zoomControl: false
});


var markerGroup = L.layerGroup().addTo(imageMap);
//Setting the bounds
var height = $("#image-container img").height();
var width = $("#image-container img").width(); 
var bound = [[0, 0], [height, width]];

//Disabling all the controls for the map
imageMap.fitBounds(bound);
imageMap.dragging.disable();
imageMap.touchZoom.disable();
imageMap.doubleClickZoom.disable();
imageMap.scrollWheelZoom.disable();
imageMap.boxZoom.disable();
imageMap.keyboard.disable();
if (imageMap.tap) imageMap.tap.disable();

//Test marker

imageMap.setView([0, 0], 1);

//Setting the correct size for the map if the window is resized
window.onresize = function (event) {
    imageMap.invalidateSize();
};


imageMap.on('click', function (e) {
    mapOnClick(e);
    
});
    

//Button control
$(".leaflet-map-pane").attr("id", "map-pane");
function popupState() {
    if ($("#map-pane").hasClass("hidden")) {
        $("#map-pane").removeClass("hidden");
        imageMap.on('click', function (e) {
            mapOnClick(e);
        });
    }
    else {
        $("#map-pane").addClass("hidden");
        imageMap.off('click');
    }
}
//Array of all the popups
var popups = new Array();
//listener for clicks
function mapOnClick(e) {
    var uniqID = Math.round(new Date().getTime() + (Math.random() * 100));
    var marker = new L.marker(e.latlng).addTo(markerGroup);
    var popup = new L.Popup();
    popup.setContent(createBtn(uniqID));
    popup.options.autoPan = false;
    popup.myData = { id: uniqID };
    popups.push(popup);
    marker.bindPopup(popup);
    marker.openPopup();

}
//Creates initial text
function createBtn(uniqID) {
    
    
    var btn = "<button onclick='commentClick("+uniqID+")' class='btn btn-success popup-btn'> <i class='glyphicon glyphicon-share-alt'></i></button>";
    Math.floor(Math.random() * 100);
    var strng = "<div id='popup" + uniqID +"' class='container-fluid popup-comment-container'></div> <div class='row comment-popup-input'><div class='col-xs-4 col-sm-4 col-md-4 text-center'>You</div><div class='col-xs-8 col-sm-8 col-md-8 input-group'><textarea  rows='2' class='form-control popup-textarea'></textarea><span class='input-group-btn'> " + btn + " </span></div>";
    return strng;
}

function createCommentRow(user, comment, uniqID) {
    var row = "<div class='row popup-comment'> <div class='col-xs-4 col-sm-4 col-md-4'><p>" + user + "</p></div><div class='col-xs-8 col-sm-8 col-md-8'>" + comment + "</div></div>";
    
    $(popups).each(function () {
        if (this.myData.id == uniqID) {
            this.setContent(appendRow(row, uniqID));
        }
    })
    return row;
}

function appendRow(row, uniqID) {
    var containerFront = "<div id='popup" + uniqID + "' class='container-fluid popup-comment-container'>" + $("#popup" + uniqID).html() + row + "</div>";
    var containerTail = "<div class='row comment-popup-input'>" + $(".comment-popup-input").html() ;
    return containerFront +  containerTail;
}