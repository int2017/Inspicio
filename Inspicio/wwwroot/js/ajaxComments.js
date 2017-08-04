var commentEnum = {
    Default: 0,
    Urgent: 1
};

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

            success: function (data) {
                var container = document.createElement("div");
                $(container).addClass("comment today").append(data).appendTo("#comment-section > .comment-container");
                $(".leaflet-popup-content").fadeOut();
                var parent = $(data).find(".reply").data("target");
                createCommentRow($("span.main-user").html(), $(".popup-textarea").val(), uniqID, parent);
                $(".leaflet-popup-content").fadeIn();
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
                success: function (data) {
                    var container = document.createElement("div");
                    $(container).addClass("comment today").append(data).appendTo("#comment-section > .comment-container");
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
                success: function (data) {
                    $(element).fadeOut();       
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
                                
                            }

                        }
                    }
                    var container = document.createElement("div");
                    $(container).addClass("comment").append(data).appendTo("#replies-" + parent+" > .comment-container");
                    $(area).val("");
                    $(element).fadeIn();
                }
            });
    }

    //Get new comments for markers
    function reloadMarkers() {
        //b28a41bc-7d12-4868-83e3-aa037d1879d7
        var controllers = ["Images", "Account", "Images", "Manage"];
        var path = location.pathname.split("/");
        var method;
        if ($.inArray(path[1], controllers) > -1) {
            method = "Images/GetComments";

        }
        else {
            method = path[1] + "/Images/GetComments";
        }
        var id = $("#ScreenId").val();
        $.ajax(
            {
                type: "GET", //HTTP GET Method  
                url:  "/" + method, // Controller/View  
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


