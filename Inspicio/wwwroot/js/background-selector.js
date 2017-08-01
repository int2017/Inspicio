

    var width = $("#image-container > img").width()+20;
    $("#background-selector").width(width);
    var picker = $("#color-picker").colorpicker();
    $(document).on("click", "#color-picker", function () {
        if ($(".colorpicker-visible").is(":visible")) {
            picker.colorpicker("hide");
        }
        else picker.colorpicker("show");
    })
    picker.on("changeColor", function () {
        
        $("#background-selector").css("background-color",$(".colorpicker-color").css("background-color"));
    })
