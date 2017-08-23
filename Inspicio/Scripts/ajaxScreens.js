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

            alert(response);
            for (var i = 0; i < response.length; i++){

                $(".version-cover-container").html($(".version-cover-container").html() +
                    '<div class="version-cover-item" id= "' + response[i] + '" style= "cursor: pointer;" >' +
                    '<span id="' + response[i] + '" class="state"></span>'+
                    '</div >'
                );

                screenContent(response[i]);
                $(".version-cover-item").click(function () {
                    screenSelector($("#ReviewId").val(), $(this).attr("id"), true);
                });
            }
        }
    });
}

$(document).ready(function () {
    $(".cover-item").each(function () {
        screenContent($(this).attr("id"));
        $(this).click(function () {
            screenSelector($("#ReviewId").val(), $(this).attr("id"), false);
        })
    })

    $(".version-cover-item").each(function () {
        screenContent($(this).attr("id"));
        $(this).click(function () {
            screenSelector($("#ReviewId").val(), $(this).attr("id"), true);
        })
    })
})
