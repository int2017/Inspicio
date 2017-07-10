
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
//Array of all the popups and markers
var markersArray = new Array();
var popupsArray = new Array();


//listener for clicks
function mapOnClick(e) {
    createMarker(e.latlng, true);
}
//Creating individual markers. Needed because onClick event sends a different object than createMarkers()
//clickBool determines wether the markers and popups are created by clicking on map or by fetching data from DB
function createMarker(latlng, clickBool) {
    var uniqID = Math.round(new Date().getTime() + (Math.random() * 100));
    var marker = new L.marker(latlng).addTo(markerGroup);
    var popup = new L.Popup();

    //Removes marker if popup is empty
    marker.on('popupclose', function (e) {
        if (($("#popup" + uniqID).html().indexOf("popup-comment")) === -1) {
            imageMap.removeLayer(marker);
        }
    });
    popup.setContent(createBtn(uniqID));
    popup.options.autoPan = false;
    //Focusing the textarea of the popup
    marker.on("click", function () {
        setTimeout(
            function () {
                $("#popuptext" + uniqID).focus();
            }, 50);

    });
    popup.myData = { id: uniqID };
    popupsArray.push(popup);
    markersArray.push(marker);
    marker.bindPopup(popup);
    marker.myData = { id: uniqID };
    if (clickBool) {
        marker.openPopup();
        $(".popup-textarea").focus();
    }
    return uniqID;
}
//Creates initial text
function createBtn(uniqID) {


    var btn = "<button onclick='commentClick(" + uniqID + ")' class='btn btn-success popup-btn'> <i class='glyphicon glyphicon-share-alt'></i></button>";
    Math.floor(Math.random() * 100);
    var strng = "<div id='popup" + uniqID + "' class='container-fluid popup-comment-container'></div> <div id=popupinput" + uniqID + "' class='row comment-popup-input'><div class='col-xs-4 col-sm-4 col-md-4 text-center'>You</div><div class='col-xs-8 col-sm-8 col-md-8 input-group'><textarea id='popuptext" + uniqID + "' rows= '2' class='form-control popup-textarea' o id='popuptext" + uniqID + "' ></textarea > <span class='input-group-btn'> " + btn + " </span></div > ";
    setTimeout(
        function () {
            $("#popuptext" + uniqID).keypress(function (e) {
                if (e.which === 13) {
                    commentClick(uniqID);
                }
            })
        }, 50);
    return strng;
}

//Creating a new comment row
function createCommentRow(user, comment, uniqID) {
    var row = "<div class='row popup-comment'> <div class='col-xs-4 col-sm-4 col-md-4'><p>" + user + "</p></div><div class='col-xs-8 col-sm-8 col-md-8'>" + comment + "</div></div>";
    $(popupsArray).each(function () {
        if (this.myData.id === uniqID) {
            this.setContent(appendRow(row, uniqID));
        }
    });

    return row;
}
//Since the whole popup has to be recreated, this method clones it's previous HTML
function appendRow(row, uniqID) {

    var containerFront = "<div id='popup" + uniqID + "' class='container-fluid popup-comment-container'>" + $("#popup" + uniqID).html() + row + "</div>";
    var containerTail = "<div class='row comment-popup-input'>" + $(".comment-popup-input").html();
    return containerFront + containerTail;

}
//Creates markers from existing comments in the DB
function createMarkers(comment, userId, lat, lng) {
    if (lat != 0 && lng != 0) {
        var latlng = L.latLng(lat, lng);
        var uniqID = createMarker(latlng, false);
        createBtn(uniqID);
        createCommentRow(userId, comment, uniqID);
    }
}

//Changing map size/location when window is resized
$(window).resize(function () {
    imageMap.invalidateSize();
})
