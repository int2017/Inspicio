

$("#close-side").click(function () {

    if ($(".flex-sidebar").hasClass("side-hide")) {

        $(".flex-sidebar").removeClass("side-hide");
        $(".view-container").removeClass("wide");

    }
    else {

        $(".flex-sidebar").addClass("side-hide");
        $(".view-container").addClass("wide");
    }


});