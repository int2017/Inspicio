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

L.marker([0, 0])
    .addTo(imageMap)
    .bindPopup("<b>Hello world!</b><br />I am a popup.");
//Set the center view for the map
imageMap.setView([0, 0], 1);

//Setting the correct size for the map if the window is resized
window.onresize = function (event) {
    imageMap.invalidateSize();
};

//this will have to updated with a cycle and function once we get the actual list of comments working
var commentBox = " <div class='container-fluid'> <div class='row'> <div class='col-md-4'><p>User</p></div><div class='col-md-8'>This is my comment about your screen</div></div><div class='row comment-popup-input'><div class='col-md-4'>You</div><div class='col-md-8 input-group'><textarea rows='2' class='form-control'></textarea><span class='input-group-btn'> <button class='btn btn-default'type='submit'> <i class='glyphicon glyphicon-share-alt'></i> </button> </span></div></div></div>"

//listener for clicks
function mapOnClick(e) {
    var marker = new L.marker(e.latlng).addTo(markerGroup).bindPopup(commentBox, {
        autoPan: false
    })
}
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

