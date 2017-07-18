
//Creates the map
var imageMap = L.map("imageMap", {
    crs: L.CRS.Simple,
    zoomControl: false,
    unitsPer1000px: 1000
});
//Creates custom pin
var customPin = L.icon({
    iconUrl: "../../images/pin.svg",
    shadowUrl: "../../images/pinshadow.svg",
    iconSize: [38, 58], // size of the icon
    shadowSize: [80, 120], // size of the shadow
    iconAnchor: [15, 58], // point of the icon which will correspond to marker's location
    shadowAnchor: [11, 62],  // the same for the shadow
    popupAnchor: [3, -45]
})
var hoverPin = L.icon({
    iconUrl: "../../images/pinLit.svg",
    shadowUrl: "../../images/pinshadow.svg",
    iconSize: [38, 58], // size of the icon
    shadowSize: [80, 120], // size of the shadow
    iconAnchor: [15, 58], // point of the icon which will correspond to marker's location
    shadowAnchor: [11, 62],  // the same for the shadow
    popupAnchor: [3, -45]
})
//Changing map size/location when window is resized
$(window).resize(function () {
    setTimeout(
        function () {
            imageMap.invalidateSize();
        }, 1000);

});
var markerGroup = L.featureGroup().addTo(imageMap);
//Setting the bounds
var height = $("#image-container img").height();
var width = $("#image-container img").width();
var bound = [[1, 1], [height, width]];

//Disabling all the controls for the map
imageMap.fitBounds(bound);
imageMap.dragging.disable();
imageMap.touchZoom.disable();
imageMap.doubleClickZoom.disable();
imageMap.scrollWheelZoom.disable();
imageMap.boxZoom.disable();
imageMap.keyboard.disable();
imageMap.setView([0, 0]);
if (imageMap.tap) imageMap.tap.disable();

//Test marker



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
var locations = [[]];

//listener for clicks
function mapOnClick(e) {
    createMarker(e.latlng, true);
}
//Creating individual markers. Needed because onClick event sends a different object than createMarkers()
//clickBool determines wether the markers and popups are created by clicking on map or by fetching data from DB
function createMarker(latlng, clickBool) {
    var uniqID = Math.round(new Date().getTime() + (Math.random() * 100));
    var marker = new L.marker(latlng, { icon: customPin }).addTo(markerGroup);
    var popup = new L.Popup();
    //Removes marker if popup is empty
    marker.on('popupclose', function (e) {
        if (($("#popup" + uniqID).html().indexOf("popup-comment")) === -1) {
            imageMap.removeLayer(marker);
        }
    });
    popup.options.autoPan = false;
    popup.options.closeOnClick = true;
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
    locations.push(latlng);
    marker.bindPopup(popup);
    marker.myData = { id: uniqID };
    if (clickBool) {
        popup.setContent(createBtn(uniqID));
        marker.openPopup();
        $(".popup-textarea").focus();
        return;
    }

    return uniqID;
}
//Creates initial text
function createBtn(uniqID) {

    var btn = "<button onclick='commentClick(" + uniqID + ")' class='btn btn-success popup-btn'> <i class='glyphicon glyphicon-share-alt'></i></button>";
    Math.floor(Math.random() * 100);
    var strng = "<div id='popup" + uniqID + "' class='container-fluid popup-comment-container'></div> <div id=popupinput" + uniqID + "' class='row comment-popup-input'><div class='col-xs-4 col-sm-4 col-md-4 text-center'>You</div><div class='col-xs-8 col-sm-8 col-md-8 input-group'><textarea id='popuptext" + uniqID + "' rows= '2' class='form-control popup-textarea' o id='popuptext" + uniqID + "' ></textarea ><div class='comment-status'><label><input type='checkbox' class='urgency-popup'>Urgent</label></div> <span class='input-group-btn'> " + btn + " </span></div > ";



    return strng;
}

//Creating a new comment row
function createCommentRow(user, comment, uniqID, parent, urgency) {

    var urgencyEl; //Urgency element
    if (urgency === 1) {
        urgencyEl = "<div class='urgent'><span class='glyphicon glyphicon-star' aria-hidden='true'></span></div>"
    }
    else urgencyEl = "";
    var row = "<div class='row-eq-height popup-comment'> <div class='col-xs-4 col-sm-4 col-md-4'><p>" + user + "</p></div><div class='col-xs-8 col-sm-8 col-md-8'>" + comment + "</div>" + urgencyEl + "</div>";
    popupX = popupsArray[popupsArray.findIndex(x => parseInt(x.myData.id) === parseInt(uniqID))].setContent(appendRow(row, uniqID, parent));

}
//Since the whole popup has to be recreated, this method clones it's previous HTML and adds a new comment row
function appendRow(row, uniqID, parent) {
    markerX = markersArray[markersArray.findIndex(x => parseInt(x.myData.id) === parseInt(uniqID))];
    var popupContent = markerX.getPopup().getContent();
    //When changing the HTML of a popup, this code will have to be updated!
    var openingTag = "<div id='popup" + uniqID + "' class='container-fluid popup-comment-container'>";
    var div = $(document.createElement('div'));
    div.addClass("container-fluid popup-comment-container").attr("id", "popup" + uniqID);
    var inputBox = createInputRow(uniqID, parent);

    if (popupContent === undefined) {
        $(row).appendTo(div);

    }
    else {
        $(popupContent.slice(openingTag.length, popupContent.length - 3 - inputBox.length)).appendTo(div);
        $(row).appendTo(div);

    }
    //A new input section has to be created each time to keep things consistent, otherwise it messes up the HTML
    var result = $('<div>').append($(div).clone()).html() + inputBox;
    return openingTag + div.html() + "</div>" + inputBox;

}


//Creates markers from existing comments in the DB
function createMarkers(comment, user, lat, lng, parent,urgency, reload) {
    

    if (lat !== 0 && lng !== 0) {
        var latCollection = locations.map(function (value, index) { return value[1] });
        var lngCollection = locations.map(function (value, index) { return value[2] });
        if ($.inArray(lat, latCollection) !== -1 && $.inArray(lng, lngCollection) !== -1) {

            if ($.inArray(lat, latCollection) === $.inArray(lng, lngCollection)) {
                var idCollection = locations.map(function (value, index) { return value[0] });
                var uniqID = idCollection[$.inArray(lat, latCollection)];
                createCommentRow(user, comment, uniqID, parent,urgency);

            }
        }
        else {
            var latlng = L.latLng(lat, lng);
            var uniqID = createMarker(latlng, false);
            locations.push([uniqID, lat, lng]);
            createCommentRow(user, comment, uniqID, parent, urgency);
        }

    }
}

//These two are only for markers that are being created from the DB
function createInputRow(uniqID, parent) {
    var btn = "<button data-parent='" + parent + "' class='btn btn-success popup-btn reply-button'> <i class='glyphicon glyphicon-share-alt'></i></button>";
    setTimeout(
        function () {
            $("#popuptext" + uniqID).keypress(function (e) {
                if (e.which === 13) {
                    commentClick(uniqID);
                }
            });
        }, 50);
    return "<div id='popupinput" + uniqID + "' class='row comment-popup-input'><div class='col-xs-4 col-sm-4 col-md-4 text-center'>You</div><div class='col-xs-8 col-sm-8 col-md-8 input-group'><textarea id='popuptext" + uniqID + "' rows= '2' class='form-control popup-textarea'  id='popuptext" + uniqID + "' ></textarea > <span class='input-group-btn'> " + btn + " </span></div ></div>";
}




//Listeners
$(document).ready(function () {
    $(document).on("mouseover", ".open-pin", function () {
        var loc = $(this).data("location").split(' ');
        var lat = loc[0];
        var lng = loc[2];
        var latCollection = locations.map(function (value, index) { return value[1] });
        var lngCollection = locations.map(function (value, index) { return value[2] });

        if ($.inArray(parseInt(lat), latCollection) !== -1 && $.inArray(parseInt(lng), lngCollection) !== -1) {

            var latlng = L.latLng(lat, lng);
            var idCollection = locations.map(function (value, index) { return value[0] });
            var uniqID = idCollection[$.inArray(parseInt(lat), latCollection)];
            markerX = markersArray[markersArray.findIndex(x => parseInt(x.myData.id) === parseInt(uniqID))];
            markerX.setIcon(hoverPin); 
        }
    }).on("mouseleave", ".open-pin", function () {
        var loc = $(this).data("location").split(' ');
        var lat = loc[0];
        var lng = loc[2];
        var latCollection = locations.map(function (value, index) { return value[1] });
        var lngCollection = locations.map(function (value, index) { return value[2] });

        if ($.inArray(parseInt(lat), latCollection) !== -1 && $.inArray(parseInt(lng), lngCollection) !== -1) {

            var latlng = L.latLng(lat, lng);
            var idCollection = locations.map(function (value, index) { return value[0] });
            var uniqID = idCollection[$.inArray(parseInt(lat), latCollection)];
            markerX = markersArray[markersArray.findIndex(x => parseInt(x.myData.id) === parseInt(uniqID))];
            markerX.setIcon(customPin);
            
        }
    }).on("click", ".open-pin", function () {
        var loc = $(this).data("location").split(' ');
        var lat = loc[0];
        var lng = loc[2];
        var latCollection = locations.map(function (value, index) { return value[1] });
        var lngCollection = locations.map(function (value, index) { return value[2] });

        if ($.inArray(parseInt(lat), latCollection) !== -1 && $.inArray(parseInt(lng), lngCollection) !== -1) {

            var latlng = L.latLng(lat, lng);
            var idCollection = locations.map(function (value, index) { return value[0] });
            var uniqID = idCollection[$.inArray(parseInt(lat), latCollection)];
            markerX = markersArray[markersArray.findIndex(x => parseInt(x.myData.id) === parseInt(uniqID))].openPopup();
        }

    })
    $(document).on("keypress", ".popup-textarea", function (e) {
        if (e.which === 13) {
            $('.leaflet-popup-content button').click();
            // prevent duplicate submission
            return false;
        }
        });
})



