$(document).ready(function () {
    var width = $("#image-container > img").width()+20;

    $("#background-selector").width(width);
    var picker = $("#color-picker").colorpicker();
    picker.on("changeColor", function () {
        
        $("#background-selector").css("background-color",$(".colorpicker-color").css("background-color"));
    })
})