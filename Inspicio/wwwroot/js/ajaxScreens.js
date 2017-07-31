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
                $("#screen-container").html(response);
                reloadMarkers();
            }
        });
}
