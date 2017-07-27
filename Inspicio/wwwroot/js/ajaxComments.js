var commentEnum = {
    Default: 0,
    Urgent: 1
};

//Commenting from popups
function commentClick(uniqID, chosenState) {
    var urgent = $(".urgency-popup").is(":checked");
    var urgency;
    if (urgent) {
        urgency = commentEnum.Urgent;
    }
    else urgency = commentEnum.Default;
    var locationLat;
    var locationLng;
    $(markersArray).each(function () {
        if (this.myData.id === uniqID) {
            locationLat = Math.round(this.getLatLng().lat);
            locationLng = Math.round(this.getLatLng().lng);
        }
    });
    var DataFromBody = {
        "ScreenId": $("#ScreenId").val(),
        "Message": $(".popup-textarea").val(),
        "Lat": locationLat,
        "Lng": locationLng,
        "ParentId": null,
        "CommentUrgency": urgency
    };
    $.ajax(
        {
            type: "POST", //HTTP POST Method  
            url: "../Comment", // Controller/View  
            contentType: "application/json;",
            dataType: "text",
            data: JSON.stringify(DataFromBody),

            success: function () {
                $(".leaflet-popup-content").fadeOut();
                markerX = markersArray[markersArray.findIndex(x => parseInt(x.myData.id) === parseInt(uniqID))];
                markerX.closePopup();
                $(markersArray).each(function () {
                    this.getPopup().setContent("");
                });
                reloadMarkers();
                $(".leaflet-popup-content").fadeIn();
                $("#comment-section").load(window.location.href + " #comment-section > * ");
                $("#comment-textarea").val("");

            }

        });
}

    

    //Commenting from main comment section
    function commentClickMain(chosenState) {

        var urgent = $("#urgent-main").is(":checked");
        var urgency;
        if (urgent) {
            urgency = commentEnum.Urgent;
        }
        else urgency = commentEnum.Default;
        var DataFromBody = {
            "ScreenId": $("#ScreenId").val(),
            "Message": $("#comment-textarea").val(),
            "Lat": null,
            "Lng": null,
            "ParentId": null,
            "CommentUrgency": urgency
        };
        $.ajax(
            {
                type: "POST", //HTTP POST Method  
                url: "../Comment", // Controller  
                contentType: "application/json;",
                dataType: "text",
                data: JSON.stringify(DataFromBody),
                success: function () {
                    $("#comment-section").load(window.location.href + " #comment-section > * ");                 
                    $("#comment-textarea").val("");
                }
            });

    }
    
    //Adding live listeners to the reply buttons
    $(document).ready(function () {
        reloadMarkers();
        $(document).on("keypress", ".reply-textarea", function (e) {
            if (e.which === 13) {
                var parent = $(this).attr("id").slice(5);
                $("#button-" + parent).click();
                // prevent duplicate submission
                return false;
            }
        });
        $(document).on("keypress", "#comment-textarea", function (e) {
            if (e.which === 13) {
                $('#submit-comment').click();
                // prevent duplicate submission
                return false;
            }
        });
        $(document).on("click", ".reply-button", function () {
            var area;
            var parent = $(this).data("parent");
            if ($(this).hasClass("popup-btn")) {
                area = $(".popup-textarea");
            }
            else {
                area = $("#text-" + parent);
            }
            replyComment(parent, area);

        });
        $(document).on("click", "#submit-comment", function () {
            commentClickMain();
        });
    });

    function replyComment(parent, area) {
        var loc;
        var element = " #replies-" + parent;
        try {
            loc = $("#loc-" + parent).data("location").split(" ");
            var lat = loc[0];
            var lng = loc[2];
        }
        catch (err) {
            loc = null;
        }
        var DataFromBody = {
            "ScreenId": $("#ScreenId").val(),
            "Message": area.val(),
            "Lat": lat,
            "Lng": lng,
            "ParentId": parent
        };
        $.ajax(
            {
                type: "POST", //HTTP POST Method  
                url: "../Comment", // Controller/View  
                contentType: "application/json;",
                dataType: "text",
                data: JSON.stringify(DataFromBody),
                success: function () {

                    $(element).fadeOut();

                    $("#comment-section #replies-" + parent + " .comment-container").load(window.location.href + " #comment-section #replies-" + parent + " .comment-container>*");
                    if (loc !== null) {
                        if ($(area).hasClass("popup-textarea")) {
                            var uniqID = $(area).attr("id").slice(9);
                            createCommentRow($("span.main-user").html(), $(".popup-textarea").val(), uniqID, parent);
                        }
                        else {
                            {
                                $(markersArray).each(function () {
                                    this.getPopup().setContent("");
                                });
                                reloadMarkers();
                            }

                        }
                    }
                    $(area).val("");
                    $(element).fadeIn();
                }
            });
    }

    //Get new comments for markers
    function reloadMarkers() {
        
        var id = $("#ScreenId").val();
        $.ajax(
            {
                type: "GET", //HTTP GET Method  
                url: "../GetComments", // Controller/View  
                contentType: "application/json;",
                dataType: "json",
                data: {
                    id: id
                },
                success: function (data) {
                    $(data).each(function () {

                        var parent;
                        if (this.parentId === undefined) {
                            parent = this.commentId;
                        }

                        else {
                            parent = this.parentId;
                        }
                        createMarkers(this.message, this.posterProfileName, this.lat, this.lng, parent, this.commentUrgency, true);

                    });
                }
            });
    }


