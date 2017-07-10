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
        updateThumbs(true, button);
    }
    else {
        updateThumbs(false, button);
    }
    $("#" + button + " i").addClass(className);
    
});

function updateThumbs(bool,button) {
    var text = "#" + button + " .rating";
    var image = {
        "ImageID": $("#ImageId").val(),
        "boolean" : bool
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
                $("#thumbs-down > span").load(window.location.href + " " + "#thumbs-down > span");
            }
        });
}