$(".thumb").click(function () {

    var button = $(this).attr("id");
    var className = $("#" + button + " i").attr("class");
    $("#" + button + " i").removeClass(className);
    if (className.toLowerCase().indexOf("-o") > 0) {
        className = className.replace("-o", "");
        
    }
    else {
        className = className.slice(0, 12)+ "-o"+ className.slice(12);
    }
    $("#" + button + " i").addClass(className);
});

function updateThumbs(bool) {
    var image = {
        "ImageID": $("#imageID").val(),
        "boolean" : bool
    };
    $.ajax(
        {
            type: "POST", //HTTP POST Method  
            url: "../ChangeRating", // Controller/View  
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(bool,image),
            success: function () {
                alert(result.success);
            }
        });
}