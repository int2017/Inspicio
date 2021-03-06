﻿var thumbEnum = {
    Approved: 0,
    NeedsWork: 1,
    Rejected: 2
};

var owner = false;

function addThumbListener(btn) {
    
    var button = $(btn).attr("id");
        
        if (button === "thumbs-up") {
            updateThumbs(thumbEnum.Approved, button);
        }
        else if (button === "thumbs-down") {
            updateThumbs(thumbEnum.Rejected, button);
        }
        else if (button === "thumbs-middle") {
            updateThumbs(thumbEnum.NeedsWork, button);
        }
        
   
}

function updateThumbs(chosenState, button ) {
    
    var text = "#" + button + " .rating";
    var image = {
        "ScreenId": $("#ScreenId").val(),
        "state": chosenState
    };
    
    $.ajax(
        {
            type: "POST", //HTTP POST Method  
            url: "../ChangeRating", // Controller/View  
            contentType: "application/json;",
            dataType: "text",
            data: JSON.stringify(image),
            success: function (response) {
              
                $("#thumbs-up > span").load(window.location.href + " " + "#thumbs-up > span");
                $("#thumbs-middle > span").load(window.location.href + " " + "#thumbs-middle > span");
                $("#thumbs-down > span").load(window.location.href + " " + "#thumbs-down > span");
                $(".reviewer-row").load(window.location.href + " .reviewer-row >*");
                
                disableThumb(true, chosenState);

                var splitId = ($("p:contains(" + response + ")"))[0].id.split("-");

                var ratingIcon = $("#reviewers-section-rating" + splitId[splitId.length - 1])[0];
                ratingIcon.className = "";
                if (chosenState == 0) {
                    ratingIcon.className = "fa fa-thumbs-o-up";
                }
                else if (chosenState == 1){
                    ratingIcon.className = "fa fa-thumbs-o-up fa-rotate-90";
                }
                else if (chosenState == 2) {
                    ratingIcon.className = "fa fa-thumbs-o-down";
                }
            },
            error : function (x, err) {
                alert("You can't rate your own work!")
            }
        });
}
//On page load, it gets the last review of the user from the database, on thumb click,it uses front-end information to update the thumbs
$(document).ready(function () {

    if (!owner) {
        disableThumb(false);
        $(document).on("click", ".thumb", function () { addThumbListener($(this)) });
    }
})

function disableThumb(ifClick, chosenState) {
    if (ifClick) {
        changeState(chosenState);
    }
    else{
    var id = $("#ScreenId").val();
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
                changeState(data);
            }
        });
    }
}

function ownerState() {

    owner = true;
    $("#thumbs-up").addClass("disabled");
    $("#thumbs-up").off();

    $("#thumbs-middle").addClass("disabled");
    $("#thumbs-middle").off();

    $("#thumbs-down").addClass("disabled");
    $("#thumbs-down").off();
}

function changeState(state) {
    $("#thumb-container button.btn").removeClass("disabled");
    $(".thumb").off();

    if (state === 0) {
        $("#thumbs-up").addClass("disabled");
        $("#thumbs-up").off();
    }
    else if (state === 1) {
        $("#thumbs-middle").addClass("disabled");
        $("#thumbs-middle").off();
    }
    if (state === 2) {
        $("#thumbs-down").addClass("disabled");
        $("#thumbs-down").off();
    }

    updateIcon();
}


function updateIcon() {
    $("#thumb-container button.btn i").each(function () {

        var className = $(this).attr("class");
        $(this).removeClass(className);
        if ($(this).parent().hasClass("disabled")) {
            
            className = className.replace("-o", "");
          
        }
        else if (className.indexOf("-o")<0) {
           className = className.slice(0, 12) + "-o" + className.slice(12);
   
        }
        $(this).addClass(className);
    })
}