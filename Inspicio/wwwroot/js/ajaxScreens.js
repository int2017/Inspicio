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

    var CommentsVisibiltyState = $(".flex-sidebar").hasClass("side-hide");

    var Id = [reviewid, id, (CommentsVisibiltyState == true) ? 1 : 0 ];

    $.ajax(
        {
            type: "GET", //HTTP GET Method
            url: "../_ScreenPartial", // Controller/View
            data: {
                RId: reviewid,
                SId: id,
                CommentVisibiltyState: (CommentsVisibiltyState == true) ? 1 : 0
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
