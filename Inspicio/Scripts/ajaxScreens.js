var ajaxComments = require("./ajaxComments");

function screenContent(id) {

    $.ajax(
        {
            type: "GET", //HTTP GET Method  
            url: "../GetScreenContentFor", // Controller/View  
            contentType: "application/json;",
            dataType: "json",
            data: {
                id: id
            },
            success: function (response) {
                $('#' + id).css("background-image", "url('" + response + "')");
            }
        });

}
function screenSelector( reviewid, id) {
    var Id = [reviewid, id];
    $.ajax(
        {
            type: "GET", //HTTP GET Method
            url: "../_ScreenPartial", // Controller/View
            data: {
                RId: reviewid,
                SId: id
            },
            success: function (response) {
                imageMap.remove();
                $(".colorpicker").remove();
                $("#screen-container").html(response);
                disableThumb(false);
                ajaxComments.reloadMarkers();
                $(".view-container").removeClass("wide");
                
            }
        });
}

$(document).ready(function () {
    $(".cover-item").each(function () {
        screenContent($(this).attr("id"));
        $(this).click(function () {
            screenSelector($("#ReviewId").val(), $(this).attr("id"));
        })
    })
})
