﻿//Replying to comments
$(document).on("click", ".reply", function () {
    var which = $(this).data("target");
    $(".replied-section").slideUp();
    if (!($("#replies-" + which).is(":visible"))) {
        $("#replies-" + which).slideDown();

    }
    else {
        $("#replies-" + which).slideUp();
    }
});

//Controlling the sidebar
$(document).on("click", "#close-side", function () {

    if ($(".flex-sidebar").hasClass("side-hide")) {

        $(".flex-sidebar").removeClass("side-hide");
        $(".view-container").removeClass("wide");

    }
    else {

        $(".flex-sidebar").addClass("side-hide");
        $(".view-container").addClass("wide");
    }


});

//Controlling project info tab
$(document).on("click", ".show-project", function () {
    $("#view-project-info > container").slideUp();
    if ($(".project-container").is(":visible")){
        $(".project-container").slideUp();
        $("#view-project-info i").css("transform", "rotate(0deg)");
    }
    else {
        $(".project-container").slideDown();
        $("#view-project-info i").css("transform", "rotate(180deg)");
    }
})


if ($("#view-project-info").length) {
    
    $(window).on("scroll", function () {
        $(".view-container").css("padding-top", "71px");
        var top = $('#view-project-info').offset().top - $(window).scrollTop()+68
        if (top <= 71) {
            $(".flex-sidebar").css("top", 71+ "px");
        
        }
        else {
            $(".flex-sidebar").css("top",  top + "px");
        }
    })
    $(window).scroll();
    }
else {
    $(".flex-sidebar").css("top", 71 + "px");
}


