﻿var pins = require("./pinComments.js");

var commentEnum = {
    Default: 0,
    Urgent: 1
};

var self = this;
var map;

//Comments from popups
function commentClick(id, chosenState) {
    var urgent = $(".urgency-popup").is(":checked");
    var urgency;
    if (urgent) {
        urgency = commentEnum.Urgent;
    }
    else urgency = commentEnum.Default;
    var latlng = self.map.markersArray[id].location;
    var locationLat = latlng.lat;
    var locationLng = latlng.lng;
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
                var parent = $(data).find(".reply").data("target");
                self.map.markersArray[id].popupObject.addRow($("span.main-user").html(), $(".popup-textarea").val(), parent, true, urgency);

                //Enabling dragging on the new marker
                self.map.markersArray[id].markerLeaf.dragging.enable();

                $("#comment-textarea").val("");
                $("#loc-" + parent).attr("data-marker", self.map.markersArray.length);

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
        var id;
        var parent = $(this).data("parent");
        if ($(this).hasClass("popup-btn")) {
            area = $(".popup-textarea");
            id = $(area).attr("id").slice(9);
        }
        else {
            area = $("#text-" + parent);
            id = -1;
        }

        replyComment(parent, area, id);

    });
    $(document).on("click", "#submit-comment", function () {
        commentClickMain();
    });
    $(document).on("click", ".initial-button", function () {
        var id = $(this).attr("id").slice(4);
        var urgency = $("#popupinput" + id + " checkbox").is(":checked");
        commentClick(id, urgency);
    });
    $(document).on("click", ".open-pin", function () {
        //Checks if the popup is already open and does the appropriate changes
        if ($(this).hasClass("close-pin")) {
            var id = $(this).data("marker");
            self.map.markersArray[id - 1].markerLeaf.closePopup();
            $(this).html("Open pin");
            $(this).removeClass("close-pin")
        }
        else {
            var id = $(this).data("marker");
            self.map.markersArray[id - 1].openPopup();
            $(this).addClass("close-pin");
            $(this).html("Close pin");
        }

    })
    $(document).on("click", "#hide-pop", function () {
        $(this).toggleClass("clicked");
        self.map.popupState();
    })

    $(document).on("click", "#close-side", function () {

        $(".view-container").one("transitionend", function () {

            if ($(".flex-sidebar").hasClass("side-hide")) {

                // remove map listener
                self.map.mapLeaf.removeEventListener();

                // hide pins
                $("#" + self.map.mapArea).fadeOut(500);
                self.map.mapLeaf.off('click');

                // disable buton
                $('#hide-pop').prop('disabled', true);
            }

            else {

                // add listerner back
                self.map.mapLeaf.on('click', function (e) {
                    var markerObject = new self.map.markerClass(e.latlng, self.markersArray.length, self.isLocal);
                    self.map.addMarkerToMap(markerObject);
                    markerObject.openPopup();
                });

                // show pins
                if (!$("#hide-pop").hasClass("clicked")) {

                    $("#" + self.map.mapArea).fadeIn(300);
                    $("#" + self.map.mapArea).removeClass("hidden");
                    self.map.mapLeaf.on('click', function (e) {
                        var markerObject = new self.map.markerClass(e.latlng, self.markersArray.length);
                        self.addMarkerToMap(markerObject);
                        markerObject.openPopup();
                    });
                }

                // enable button
                $('#hide-pop').prop('disabled', false);
            }
        });
    });
});

function replyComment(parent, area, id) {

    var element = " #replies-" + parent;

    if (id > -1) {
        var latlng = self.map.markersArray[id].location;
        var lat = latlng.lat;
        var lng = latlng.lng;
    }
    else if ($("#loc-" + parent).length) {
        var latlng = $("#loc-" + parent).data("location").split(" ");
        var lat = latlng[0];
        var lng = latlng[1];
        $(self.map.markersArray).each(function () {
            if (this.popupObject.parentId == parent) {
                id = this.id;
                return false;
            }
        })
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
                $(element).fadeOut(100);
                if (lat !== null && lat !== undefined) {
                    self.map.markersArray[id].popupObject.addRow($("span.main-user").html(), $(area).val(), parent, false);
                }
                var container = document.createElement("div");
                $(".replied-section").slideUp();
                $(container).addClass("comment").append(data).appendTo("#replies-" + parent + " > .comment-container");
                $(area).val("");
                $(element).fadeIn(100);
            }

        });
}

//Get new comments for markers
var reloadMarkers = function () {
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
    $.ajax({

        type: "GET", //HTTP GET Method  
        url: "/" + method, // Controller/View  
        contentType: "application/json;",
        dataType: "json",
        data: {
            id: id
        },
        success: function (data) {
            self.map = pins.newMap("imageMap");
            $(data).each(function () {
                //Check if the comment has a pin or not. (Impossible to put a comment at coords 0,0 because the map bounds start at 1,1)
                if (this.lat !== 0 && this.lng !== 0) {
                    var parent;
                    var isInitial;
                    if (this.parentId === undefined) {
                        parent = this.commentId;
                        isInitial = true;
                    }

                    else {
                        parent = this.parentId;
                        isInitial = false;
                    }
                    self.map.createMarker(this.message, this.posterProfileName, this.lat, this.lng, parent, isInitial, this.commentUrgency);
                    //Adding a data attribute to the open pin link
                    $("#loc-" + parent).attr("data-marker", self.map.markersArray.length);
                }
            });

            $("#" + self.map.mapArea).fadeOut(500);
            self.map.mapLeaf.off('click');
        }
    });
}

module.exports.reloadMarkers = reloadMarkers;