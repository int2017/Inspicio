
function commentClick(uniqID) {
    var locationLat;
    var locationLng;
    $(markersArray).each(function () {
        if (this.myData.id === uniqID) {
            locationLat = this.getLatLng().lat;
            locationLng = this.getLatLng().lng;
        }
    })
    alert(locationLat);
    var _DataFromBody = {
                "ImageId": $("#ImageId").val(),
                "Message": $(".popup-textarea").val(),
                "Lat" : locationLat,
                "Lng" : locationLng
    }
        alert(JSON.stringify(_DataFromBody));
        $.ajax(
            {
                type: "POST", //HTTP POST Method  
                url: "../Comment", // Controller/View  
                contentType: "application/json;",
                dataType: "text",
                data: JSON.stringify(_DataFromBody),
                
                success: function () {
                    createCommentRow("user", $(".popup-textarea").val(), uniqID);
                    $("#comment-section").load(window.location.href + " #comment-section > * ");
                    $("#comment-textarea").val("");

                }

              });

}; 

function commentClickMain() {
    var _DataFromBody = {
        "ImageId": $("#ImageId").val(),
        "Message": $("#comment-textarea").val(),
        "Lat": null,
        "Lng": null
    }
    alert(JSON.stringify(_DataFromBody));
    $.ajax(
        {
            type: "POST", //HTTP POST Method  
            url: "../Comment", // Controller/View  
            contentType: "application/json;",
            dataType: "text",
            data: JSON.stringify(_DataFromBody),
            success: function () {
                $("#comment-section").load(window.location.href + " #comment-section > * ");
                $("#comment-textarea").val("");
            }
        });

}; 

$('#comment-textarea').keypress(function (e) {
    if (e.which === 13) {
        $('#submit-comment').click();
        // prevent duplicate submission
        return false; 
    }
});