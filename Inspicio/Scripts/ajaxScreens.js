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
                $('#' + id).css("background-image", "url('" + response.content + "')");
                $('#' + id).attr("title", "'" + response.title + "'");
                if (response.state == 0) {
                    $('#' + id + '.state').removeClass("screen-closed");
                    $('#' + id + '.state').removeClass("fa fa-lock");
                    $('#' + id + '.state').addClass("screen-open");
                    $('#' + id + '.state').addClass("fa fa-unlock fa-3x");
                }
                else {
                    $('#' + id).css("opacity", "0.80");
                    $('#' + id + '.state').removeClass("fa fa-unlock");
                    $('#' + id + '.state').removeClass("screen-open");
                    $('#' + id + '.state').addClass("screen-closed");
                    $('#' + id + '.state').addClass("fa fa-lock fa-3x");
                }
            }
        });

}
function screenSelector(reviewid, id) {
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
                reloadMarkers();
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
