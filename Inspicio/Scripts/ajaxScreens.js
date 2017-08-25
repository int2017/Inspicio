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
                if (response.state === 0) {
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
function screenSelector(reviewid, id, previousScreen) {

    var CommentsVisibiltyState = $(".flex-sidebar").hasClass("side-hide");
    $.ajax(
        {
            type: "GET", //HTTP GET Method
            url: "../_ScreenPartial", // Controller/View
            data: {
                RId: reviewid,
                SId: id,
                CommentVisibiltyState: (CommentsVisibiltyState === true) ? 1 : 0,
                previousVersion: previousScreen
            },
            success: function (response) {
                imageMap.remove();
                $(".colorpicker").remove();
                $("#screen-container").html(response);
                // clear the current previous versions
                if (!previousScreen) {
                    $(".version-cover-container").html("");
                    GetVersions(id);
                }
                disableThumb(false);
                reloadMarkers();
            }
        });
}

function GetVersions(id) {

    $.ajax({

        type: "GET",
        url: "../GetVersions",
        data: {
            id: id,
        },
        success: function (response) {

            for (var i = 0; i < response.length; i++){

                $(".version-cover-container").html($(".version-cover-container").html() +
                    '<div class="version-cover-item" id= "' + response[i] + '" style= "cursor: pointer;" >' +
                    '<span id="' + response[i] + '" class="state"></span>'+
                    '</div >'
                );

                screenContent(response[i]);
                $(".version-cover-item").click(function () {
                    $(".version-cover-item").css({
                        "border": "none",
                        "box-shadow": "none",
                        "height": "50px",
                        "width": "50px"
                    });
                    screenSelector($("#ReviewId").val(), $(this).attr("id"), true);
                    $(this).css({
                        "border-color": "white",
                        "border-width": "4px",
                        "border-style": "solid",
                        "box-shadow": "2px 2px 4px #676767",
                        "height": "60px",
                        "width": "60px"
                    });
                });
            }
        }
    });
}

$(document).ready(function () {
    $(".cover-item:first-child").css({
        "border-color": "white",
        "border-width": "6px",
        "border-style": "solid",
        "box-shadow": "2px 2px 4px #676767",
        "height": "110px",
        "width": "110px"
    })

    $(".version-cover-item:first-child").css({
        "border": "none",
        "box-shadow": "none",
        "height": "50px",
        "width": "50px"
    })

    $(".cover-item").each(function () {
        screenContent($(this).attr("id"));
        $(this).click(function () {
            $(".cover-item").css({
                "border": "none",
                "box-shadow": "none",
                "height": "100px",
                "width": "100px"
            });
            screenSelector($("#ReviewId").val(), $(this).attr("id"), false);
            $(this).css({
                "border-color": "white",
                "border-width": "6px",
                "border-style": "solid",
                "box-shadow": "2px 2px 4px #676767",
                "height": "110px",
                "width": "110px"
            });
        })
    })

    $(".version-cover-item").each(function () {
        screenContent($(this).attr("id"));
        $(this).click(function () {
            $(".version-cover-item").css({
                "border": "none",
                "box-shadow": "none",
                "height": "50px",
                "width" : "50px"
            });
            screenSelector($("#ReviewId").val(), $(this).attr("id"), true);
            $(this).css({
                "border-color": "white",
                "border-width": "4px",
                "border-style": "solid",
                "box-shadow": "2px 2px 4px #676767",
                "height": "60px",
                "width": "60px"
            });
        })
    })
})
