function activateChatBot() {
    var width = $("#homeImageMap").width();
    var height = $("#homeImageMap").height();
    var loc = new L.latLng(width * Math.random(), height * Math.random());
    
    setTimeout(function () {
        createMarker(loc);
    },3000)

}