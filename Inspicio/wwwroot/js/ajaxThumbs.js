var thumbEnum = {
    Approved: 0,
    NeedsWork: 1,
    Rejected: 2
};

$(".thumb").click(function () {

    var button = $(this).attr("id");
    var className = $("#" + button + " i").attr("class");
    $("#" + button + " i").removeClass(className);
    if (className.toLowerCase().indexOf("-o") > 0) {
        className = className.replace("-o", "");
    }
    else {
        className = className.slice(0, 12) + "-o" + className.slice(12);
    }
    if (button === "thumbs-up") {
        updateThumbs(thumbEnum.Approved, button);
    }
    else if (button === "thumbs-down") {
        updateThumbs(thumbEnum.Rejected, button);
    }
    else if (button === "thumbs-middle") {
        updateThumbs(thumbEnum.NeedsWork, button);
    }
    $("#" + button + " i").addClass(className);
    
});

function updateThumbs(chosenState, button) {
    
    var text = "#" + button + " .rating";
    var image = {
        "ImageID": $("#ImageId").val(),
        "state": chosenState
    };
    
    $.ajax(
        {
            type: "POST", //HTTP POST Method  
            url: "../ChangeRating", // Controller/View  
            contentType: "application/json;",
            dataType: "text",
            data: JSON.stringify(image),
            success: function () {
                $("#thumbs-up > span").load(window.location.href + " " + "#thumbs-up > span");
                $("#thumbs-middle > span").load(window.location.href + " " + "#thumbs-middle > span");
                $("#thumbs-down > span").load(window.location.href + " " + "#thumbs-down > span");
                $(".reviewer-row").load(window.location.href + " .reviewer-row >*");
                disableThumb(true, chosenState);
            }
        });
}
//On page load, it gets the last review of the user from the database, on thumb click,it uses front-end information to update the thumbs
$(document).ready(function () {
    disableThumb(false);
})
function disableThumb(ifClick, chosenState) {
    $("#thumb-container button.btn").removeClass("disabled");
    if (ifClick) {
        if (chosenState == 0) {
            $("#thumbs-up").addClass("disabled");
        }
        else if (chosenState == 1) {
            $("#thumbs-middle").addClass("disabled");
        }
        if (chosenState == 2) {
            $("#thumbs-down").addClass("disabled");
        }
    }
    else{
    var id = $("#ImageId").val();
    $.ajax(
        {
            type: "GET", //HTTP GET Method  
            url: "../GetRating", // Controller/View  
            contentType: "application/json;",
            dataType: "json",
            data: {
                id: id
            },
            success: function (data) {
                if (data == 0) {
                    $("#thumbs-up").addClass("disabled");
                }
               else if (data == 1) {
                    $("#thumbs-middle").addClass("disabled");
                }
                if (data == 2) {
                    $("#thumbs-down").addClass("disabled");
                }
            }
        });
    }
}